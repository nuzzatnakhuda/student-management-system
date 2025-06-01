const db = require('../models')
const { Op, BOOLEAN } = require('sequelize');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const secretKey = "qwerty";

const Employee = db.employees
const JobDetail = db.job_details
const Session = db.sessions
const Designation = db.designations
const Salary = db.salary
const EmployeeProvident = db.employee_provident
const Login = db.login
const sequelize = db.sequelize

// Add Employee along with its provident fund job details salary and login info
const addEmployee = async (req, res) => {

    try {
        const employee = await Employee.create({
            full_name: req.body.full_name,
            date_of_birth: req.body.date_of_birth,
            gender: req.body.gender,
            contact_number: req.body.contact_number,
            email: req.body.email,
            address: req.body.address,
            aadhar: req.body.aadhar,
            hasPF : req.body.has_provident_fund,
            isActive: true
        })
        if(employee.hasPF){
        const employeeProvident = await EmployeeProvident.create({
            employee_id: employee.id,
            accumulated_balance: 0,
            isActive: true
        })
    }
        const job_detail = await JobDetail.create({
            employee_id: employee.id,
            session_id: req.body.session_id,
            designation_id: req.body.designation_id,
            date_of_join: req.body.date_of_join,
        })
        const salary = await Salary.create({
            employee_id: employee.id,
            salary: parseFloat(req.body.salary),
            isActive: true
        })
        if(req.body.username)
        {
        const login = await Login.create({
            employee_id: employee.id,
            username: req.body.username,
            password: req.body.password
        })
    }
        console.log(job_detail, salary)
        res.status(200).send(employee)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Something went wrong' })
    }

}

// Update Employee along with its job details salary and login info
const updateEmployee = async (req, res) => {
    try {
        let employee = await Employee.update({
            full_name: req.body.full_name,
            date_of_birth: req.body.date_of_birth,
            gender: req.body.gender,
            contact_number: req.body.contact_number,
            email: req.body.email,
            address: req.body.address,
            aadhar: req.body.aadhar,
        }, {
            where: {
                id: req.params.id,
            }
        })
        let job_detail = await JobDetail.update({
            session_id: req.body.session_id,
            designation_id: req.body.designation_id,
            date_of_join: req.body.date_of_join,
        }, {
            where: { employee_id: req.params.id }
        })
        let salary = await Salary.update({
            salary: parseFloat(req.body.salary),
        }, {
            where: { employee_id: req.params.id }
        })
        let login = Login.findOne({
            where: { employee_id: req.params.id }
        })

        if (login.username == req.body.username) {
            login = await Login.update({
                password: req.body.password
            }, {
                where: { employee_id: req.params.id }
            })
            res.status(200).send(employee)
        }
        else {
            login = await Login.update({
                username: req.body.username,
                password: req.body.password
            }, {
                where: { employee_id: req.params.id }
            })
            res.status(200).send(employee)
        }


    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Something went wrong' })
    }

}

// Update Employee along with its provident fund job details salary and login info and set isActive to false
const employeeExit = async (req, res) => {
    try {
        let employee = await Employee.update({
            isActive: false
        }, {
            where: { id: req.params.id }
        })

        let employee_provident = await EmployeeProvident.update({
            isActive: false
        }, {
            where: { employee_id: req.params.id }
        })
        let job_detail = await JobDetail.update({
            date_of_exit: req.body.date_of_exit
        }, {
            where: { employee_id: req.params.id }
        })
        let salary = await Salary.update({
            isActive: false
        }, {
            where: { employee_id: req.params.id }
        })
        let login = await Login.update({
            isActive: false
        }, {
            where: { employee_id: req.params.id }
        })
        res.status(200).send(employee)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Something went wrong' })
    }
}

//Will not be used
const deleteEmployee = async (req, res) => {
    try {
        await Employee.destroy({
            where: { id: req.params.id }
        })
        res.status(200).send({ 'message': 'Employee Deleted' })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Something went wrong' })
    }

}

// Search Employees Session Specific
const searchEmployee = async (req, res) => {
    try {
        let session_id =req.params.session_id
        let employees = await Employee.findAll({
            include :[{
                model : JobDetail,
                as : 'job_detail',
                include : [{
                    model : Designation,
                    as : 'designation'
                }],
                where : {session_id}
            },
        ],
            where: {
                full_name: { [Op.like]: `%${req.query.name}%` },
                isActive: true // Case-insensitive search
            },
        })

        res.status(200).send(employees)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Something went wrong' })
    }

}

//Get All Employees
const getAllEmployees = async (req, res) => {
    try {
        let employees = await Employee.findAll({
            where: { isActive: true }
        })
        res.status(200).send(employees)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Something went wrong' })
    }

}

//Get All Employee Information
const getEmployeeById = async (req, res) => {
    try {
        let employee = await Employee.findOne({
            include: [
                {
                    model: EmployeeProvident,
                    as: 'employee_provident'
                },
                {
                    model: JobDetail,
                    include: [
                        {
                            model: Session,
                            as: 'session',
                        },
                        {
                            model: Designation,
                            as: 'designation'
                        }
                    ],
                    as: 'job_detail'
                },
                {
                    model: Salary,
                    as: 'salary'
                },
                {
                    model: Login,
                    as: 'login'
                },
            ],
            where: { id: req.params.id }
        })
        res.status(200).send(employee)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Something went wrong' })
    }

}

//Session Wise Employee Provident
const getAllActiveEmployeeProvident = async (req, res) => {
    try {
        let session_id =req.params.session_id
        let employees = await Employee.findAll({
            include :[{
                model : JobDetail,
                as : 'job_detail',
                where : {session_id}
            },
            {
                model : EmployeeProvident,
                as : 'employee_provident'
            }
        ],
            where : {
                isActive : true
            }
        })
        res.status(200).send(employees)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Something went wrong' })
    }
}

//Get All Employees By Designation
const getEmployeeByDesignation = async (req,res)=>{
    try {
        let job_details = await JobDetail.findAll({
            where: {
               designation_id :  req.query.id, 
               date_of_exit : null
            },
            include: [
                {
                    model: Employee,
                    as: 'employee'
                },
                {
                    model: Session,
                    as: 'session',
                },
                {
                    model: Designation,
                    as: 'designation'
                }]
        })
        res.status(200).send(job_details)

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Something went wrong' })
    }
}

//Get All Session Employees
const getEmployeeBySession = async (req,res)=>{
    try {
        let job_details = await JobDetail.findAll({
            where: {
               session_id : req.query.id , 
               date_of_exit : null
            },
            include: [
                {
                    model: Employee,
                    as: 'employee'
                },
                {
                    model: Session,
                    as: 'session',
                },
                {
                    model: Designation,
                    as: 'designation'
                }]
        })
        res.status(200).send(job_details)

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Something went wrong' })
    }
}

//Get Employees by Designation on Basis of Session
const getEmployeeBySessionAndDesignation = async (req,res)=>{
    try {
        let job_details = await JobDetail.findAll({
            where: {
               session_id : req.query.id , 
               designation_id : req.query.des_id , 
               date_of_exit : null
            },
            include: [
                {
                    model: Employee,
                    as: 'employee'
                },
                {
                    model: Session,
                    as: 'session',
                },
                {
                    model: Designation,
                    as: 'designation'
                }]
        })
        res.status(200).send(job_details)

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Something went wrong' })
    }

}

// Session Wise Employees Salary
const getAllEmployeeSalary = async (req,res)=>{
    try {
        let job_details = await JobDetail.findAll({
            where: {
               date_of_exit : null,
               session_id : req.params.id
            },
            attributes:['id'],
            include: [
                {
                    model: Employee,  
                    as: 'employee',
                    include : [{
                        model : Salary,
                        as : 'salary',
                        attributes:['salary']
                    },
                    ],
                    attributes:['id','full_name']

                },
                {
                    model: Designation,
                    as: 'designation',
                    attributes :['designation']
                }]
        })
        res.status(200).send(job_details)

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Something went wrong' })
    }
}

//Get Employee Provident
const getEmployeeProvident = async (req, res) => {
    try {
        let employees = await Employee.findAll({
            include :[{
                model : JobDetail,
                as : 'job_detail',
            },
            {
                model : EmployeeProvident,
                as : 'employee_provident'
            }
        ],
            where : {
                isActive : true,
                id : req.params.id
            }
        })
        res.status(200).send(employees)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Something went wrong' })
    }
}

const getEmployeeCountDesignation = async(req,res)=>{
    try {
        // Perform a count of employees grouped by session and designation, filtered by session_id
        const employeeCount = await JobDetail.findAll({
            where : {
                date_of_exit : null
            },
            attributes: [
                'session_id',
                'designation_id',
                [sequelize.fn('COUNT', sequelize.col('employee_id')), 'employee_count'], // Count of employees
            ],
            include: [
                {
                    model: Employee,
                    as : 'employee', // Join with Employee table,
                    attributes: [], // We don't need the employee details, only the count
                },
                {
                    model: Session,
                    as : 'session',
                    attributes: ['session'], // Session details (optional)
                    where: { id: req.params.id }, // Filter by session_id
                },
                {
                    model: Designation,
                    as : 'designation',
                    attributes: ['designation'], // Designation details (optional)
                },
            ],
            group: ['session_id', 'designation_id'], // Group by session and designation
            raw: true, // Get plain results
        });

        res.status(200).send(employeeCount)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Something went wrong' })
    }
}

const getPastEmployeeBySession = async (req, res) => {
    try {
        let job_details = await JobDetail.findAll({
            where: {
                date_of_exit: {
                    [Op.ne]: null  // Ensure date_of_exit is not null
                }
            },
            include: [
                {
                    model: Employee,
                    as: 'employee'
                },
                {
                    model: Session,
                    as: 'session',
                },
                {
                    model: Designation,
                    as: 'designation'
                }
            ]
        })
        console.log(job_details)
        res.status(200).send(job_details)

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Something went wrong' })
    }
}

const searchPastEmployee = async (req, res) => {
    try {

        // Fetch past employees by filtering on non-null date_of_exit
        let employees = await Employee.findAll({
            include: [{
                model: JobDetail,
                as: 'job_detail',
                where :{
                    date_of_exit: { [Op.ne]: null }, // Filter to get only past employees (where date_of_exit is not null)
                },
                include: [{
                    model: Designation,
                    as: 'designation'
                }],
            }],
            where: {
                full_name: { [Op.like]: `%${req.query.name}%` }, // Search by employee name
                
            },
        });

        res.status(200).send(employees);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Something went wrong' });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by username
        const user = await Login.findOne({ where: { username, isActive: true } });

        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ user_id: user.employee_id, username: user.username }, secretKey, { expiresIn: "1h" });

        res.status(200).json({ token, id: user.employee_id });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const getEmployeeJobDetails=async (req,res)=>{
    try {
        const job_detail = await JobDetail.findOne({
            where : {
                employee_id : req.params.id
            },
            attributes:['session_id','designation_id']
        })
        res.status(200).json(job_detail);
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: error.message});
    }
}

module.exports = {
    addEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
    searchEmployee,
    employeeExit,
    getEmployeeByDesignation,
    getEmployeeBySession,
    getEmployeeBySessionAndDesignation,
    getAllActiveEmployeeProvident,
    getAllEmployeeSalary,
    getEmployeeProvident,
    getEmployeeCountDesignation,
    getPastEmployeeBySession,
    searchPastEmployee,
    login,
    getEmployeeJobDetails
}