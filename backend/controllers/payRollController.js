const db = require('../models')
const { Op, where } = require('sequelize')

const PayRoll = db.pay_roll
const Employee = db.employees
const JobDetails = db.job_details
const Session = db.sessions
const Salary = db.salary
const ProvidentFund = db.provident_fund
const EmployeeProvident = db.employee_provident
const SchoolFund = db.school_fund
const SchoolFundTransaction = db.school_fund_transaction
const Sequelize = db.Sequelize

//Generate Salary By Session For Employees
const generateEmployeeSalary = async (req, res) => {
    try {
        const currentMonth = new Date();
        let formattedMonth = `${currentMonth.getFullYear()}-${(currentMonth.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-01`;
        const employees = await Employee.findAll({
            where: {
                isActive: true
            },
            include: [
                {
                    model: JobDetails,
                    as: 'job_detail',
                    where: { session_id: req.params.id },
                    attributes: ['id'],
                },
                {
                    model: Salary,
                    as: 'salary',
                    attributes: ['salary'],
                },
            ],
        })

        for (const employee of employees) {
            const { id: employee_id, salary: emp_sal } = employee;
            const { salary } = emp_sal;
            const existingSalary = await PayRoll.findOne({
                where: {
                    employee_id: employee_id,
                    month: formattedMonth,
                },
            });

            if (existingSalary) {
                console.log(
                    `Salary already generated for employee ID ${employee_id} for month ${formattedMonth}`
                );
                continue;
            }
            if (salary != 0) {
                const pay_roll = await PayRoll.create({
                    employee_id: employee_id,
                    month: formattedMonth,
                    salary: salary,
                    net_salary: 0, // Initially unpaid
                    is_paid: false,
                });
                if (employee.hasPF) {
                    let employee_provident = await EmployeeProvident.findOne({
                        where: {
                            employee_id: employee_id
                        }
                    })
                    await ProvidentFund.create({
                        employee_id: employee_id,
                        pay_roll_id: pay_roll.id,
                        contribution_date: formattedMonth,
                        employee_contribution: parseFloat(pay_roll.salary) * 0.12,
                        employer_contribution: parseFloat(pay_roll.salary) * 0.15,
                        total_contribution: (parseFloat(pay_roll.salary) * 0.12) + (parseFloat(pay_roll.salary) * 0.15)
                    })
                }
            }
        }
        res.status(200).send(employees)

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }
}

//Pay Employee Salary
const paySalary = async (req, res) => {
    try {
        let pay_roll = await PayRoll.update({
            payment_date: req.body.payment_date,
            bonus: req.body.bonus,
            deductions: req.body.deductions,
            net_salary: req.body.net_salary,
            remarks: req.body.remarks,
            is_paid: 'true',
        }, {
            where: {
                id: req.params.id,
            }
        })
        pay_roll = await PayRoll.findOne({
            where: {
                id: req.params.id,
                month: req.body.month
            }
        })
        let employee_provident = await EmployeeProvident.findOne({
            where: {
                employee_id: pay_roll.employee_id
            }
        })
        
        if (employee_provident) {
            let accumulated_balance=0
            if(employee_provident.accumulated_balance)
            {
                accumulated_balance =Number(employee_provident.accumulated_balance)
                console.log(accumulated_balance)
            }
            let provident_fund = await ProvidentFund.findOne({    
                where: {
                    pay_roll_id: req.params.id
                }
            })
            await ProvidentFund.update({
                contribution_date: req.body.payment_date,
                accumulated_balance: accumulated_balance + Number(provident_fund.total_contribution)
            }, {
                where: {
                    pay_roll_id: pay_roll.id
                }
            })
            provident_fund = await ProvidentFund.findOne({
                where: {
                    pay_roll_id: pay_roll.id
                }
            })
            await employee_provident.update({
                accumulated_balance: provident_fund.accumulated_balance
            }, {
                where: {
                    employee_id: pay_roll.employee_id
                }
            })

            let school_fund = await SchoolFund.findOne({})
            await SchoolFund.update({
                current_balance: parseFloat(school_fund.current_balance) - parseFloat(pay_roll.net_salary) - parseFloat(provident_fund.total_contribution)
            }, {
                where: {
                    id: 1
                }
            })
            school_fund = await SchoolFund.findOne({})
            let school_fund_transaction = await SchoolFundTransaction.create({
                transaction_date: pay_roll.payment_date,
                type: 'expense',
                amount: parseFloat(pay_roll.net_salary) + parseFloat(provident_fund.total_contribution),
                balance_after: school_fund.current_balance,
                description: 'Employee Salary Paid'
            })
        }
        else {
            let school_fund = await SchoolFund.findOne({})
            await SchoolFund.update({
                current_balance: parseFloat(school_fund.current_balance) - parseFloat(pay_roll.net_salary)
            }, {
                where: {
                    id: 1
                }
            })
            school_fund = await SchoolFund.findOne({})
            let school_fund_transaction = await SchoolFundTransaction.create({
                transaction_date: pay_roll.payment_date,
                type: 'expense',
                amount: parseFloat(pay_roll.net_salary),
                balance_after: school_fund.current_balance,
                description: 'Employee Salary Paid'
            })

        }
        res.status(200).send(pay_roll)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }
}

const getPendingSalary = async (req, res) => {
    try {
        const pendingSalaryData = await PayRoll.findAll({
            where: {
                is_paid: false, // Filter employees whose salary is not paid
            },
            include: [
                {
                    model: ProvidentFund,  // Include ProvidentFund details
                    as: 'provident_fund',
                    required: false,  // Left join (outer join)
                    attributes: ['employer_contribution'],  // Select only the PF contribution columns
                },
                {
                    model: Employee,
                    as: 'employee',
                    attributes: [],
                    include: [{
                        model: JobDetails,
                        as: 'job_detail',
                        required: 'true',
                        where: {
                            session_id: req.params.id,
                        }
                    }]
                }
            ]
        });


        let totalPendingSalary = 0;
        let employeeCount = 0;

        // Loop through each employee's data to calculate total pending salary including PF
        pendingSalaryData.forEach(employee => {
            // Add net salary to total pending salary
            totalPendingSalary += employee.salary;
            // Check if PF data exists and add it to the pending salary
            if (employee.provident_fund && Array.isArray(employee.provident_fund) && employee.provident_fund.length > 0) {
                totalPendingSalary += Number(employee.provident_fund[0].employer_contribution) ?? 0;
            }

            employeeCount += 1;  // Increment employee count
        });

        res.status(200).send({
            totalPendingSalary: totalPendingSalary,
            employeeCount: employeeCount
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }
}

const getMonthlyPendingSalary = async (req, res) => {
    try {
        const result = await PayRoll.findAll({
            attributes: [
                'month',
                [Sequelize.fn('COUNT', Sequelize.literal('DISTINCT CASE WHEN is_paid = false THEN pay_roll.employee_id END')), 'total_pending_employees'],
                [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN is_paid = false THEN salary END')), 'total_pending_salary'],
                [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN is_paid = true THEN salary END')), 'total_paid_salary'],
                [Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN is_paid = true THEN pay_roll.employee_id END')), 'employees_who_received_salary'],
                [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN is_paid = false THEN provident_fund.employer_contribution END')), 'total_pending_pf'],
                [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN is_paid = true THEN provident_fund.employer_contribution END')), 'total_paid_pf'] // Added paid PF
            ],
            include: [
                {
                    model: Employee,
                    as: 'employee',
                    attributes: [],
                    include: [
                        {
                            model: JobDetails,
                            as: 'job_detail',
                            attributes: [],
                            where: { session_id: req.params.id } // Filter by session
                        }
                    ]
                },
                {
                    model: ProvidentFund,  // Include Provident Fund details
                    as: 'provident_fund',
                    required: false, // Left Join (some employees might not have PF)
                    attributes: []
                }
            ],
            group: ['month'],
            order: [['month', 'ASC']],
            raw: true
        });
    
        // Convert to object format instead of array
        const pending_salaries = {};
        result.forEach(row => {
            pending_salaries[row.month] = {
                total_pending_salary: parseFloat(row.total_pending_salary || 0.0),
                total_pending_pf: parseFloat(row.total_pending_pf || 0.0), // Pending PF
                total_pending_employees: parseInt(row.total_pending_employees || 0, 10),
                total_paid_salary: parseFloat(row.total_paid_salary || 0.0),
                employees_who_received_salary: parseInt(row.employees_who_received_salary || 0, 10),
                total_paid_pf: parseFloat(row.total_paid_pf || 0.0) // Paid PF included
            };
        });
    
        res.status(200).send(pending_salaries);
    
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
    
}

const getPendingSalaryEmployees = async (req, res) => {
    try {
        const employees = await Employee.findAll({
            include: [
                {
                    model: PayRoll,
                    as: 'pay_roll',
                    required: 'true',
                    attributes: ['month'],
                    where: {
                        is_paid: false
                    }
                },
                {
                    model: JobDetails,
                    as: 'job_detail',
                    required: true,
                    attributes: [],
                    where: {
                        session_id: req.params.id
                    }
                }
            ]
        })
        res.status(200).send(employees)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }
}


const getPendingSalaryEmployeesByMonth = async (req, res) => {
    try {
        const employees = await Employee.findAll({
            include: [
                {
                    model: PayRoll,
                    as: 'pay_roll',
                    required: 'true',
                    attributes: ['month'],
                    where: {
                        is_paid: false,
                        month: req.query.month
                    }
                },
                {
                    model: JobDetails,
                    as: 'job_detail',
                    required: true,
                    attributes: [],
                    where: {
                        session_id: req.params.id
                    }
                }
            ]
        })
        res.status(200).send(employees)

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }
}

const getPaidSalaryEmployeesByMonth = async (req, res) => {
    try {
        const employees = await Employee.findAll({
            include: [
                {
                    model: PayRoll,
                    as: 'pay_roll',
                    required: 'true',
                    attributes: ['month'],
                    where: {
                        is_paid: true,
                        month: req.query.month
                    }
                },
                {
                    model: JobDetails,
                    as: 'job_detail',
                    required: true,
                    attributes: [],
                    where: {
                        session_id: req.params.id
                    }
                }
            ]
        })
        res.status(200).send(employees)

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }
}
const getEmployeePayRollDetails = async (req, res) => {
    try {
        const pay_rolls = await PayRoll.findAll({
            where: {
                employee_id: req.params.id
            }
        })
        res.status(200).send(pay_rolls)

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }
}

const getEmployeeProvidentDetails = async (req, res) => {
    try {
        const provident_fund = await ProvidentFund.findAll({
            where: {
                employee_id: req.params.id
            },
            include: [{
                model: PayRoll,
                as: 'pay_roll',
                where: {
                    is_paid: true
                }
            }]
        })
        res.status(200).send(provident_fund)

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }
}
module.exports = {
    generateEmployeeSalary,
    paySalary,
    getPendingSalary,
    getMonthlyPendingSalary,
    getPendingSalaryEmployees,
    getPendingSalaryEmployeesByMonth,
    getPaidSalaryEmployeesByMonth,
    getEmployeePayRollDetails,
    getEmployeeProvidentDetails
}