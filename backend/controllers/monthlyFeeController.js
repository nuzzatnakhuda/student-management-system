const db = require('../models')
const { Op } = require('sequelize')

const MonthlyFee = db.monthly_fee
const StudentEnrollment = db.student_enrollment
const GradeSection = db.grade_sections
const Grade = db.grades
const GradeFee = db.grade_fees
const SchoolFund = db.school_fund
const SchoolFundTransaction = db.school_fund_transaction
const Student = db.student
const Sequelize = db.Sequelize
const sequelize = db.sequelize

//For complete session
const generateMonthlyFee = async (req, res) => {
    try {
        const currentMonth = new Date();
        const formattedMonth = `${currentMonth.getFullYear()}-${(currentMonth.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-01`;
        const enrollments = await StudentEnrollment.findAll({
            where: { status: 'active' },
            include: [
                {
                    model: GradeSection,
                    required: true,
                    as: 'grade_section',
                    attributes: ['name'],
                    include: [{
                        model: Grade,
                        as: 'grade',
                        attributes: ['name'],
                        where: {
                            session_id: req.body.session_id
                        },
                        include: [{
                            model: GradeFee,
                            as: 'grade_fee',
                            attributes: ['fee']
                        }]
                    },
                    ],

                },

            ],
        });
        const existingFees = await MonthlyFee.findAll({
            where: { month: formattedMonth },
        });
        const existingEnrollmentIds = existingFees.map((fee) => fee.student_enrollment_id);
        const feeEntries = enrollments
            .filter((enrollment) => !existingEnrollmentIds.includes(enrollment.id))
            .map((enrollment) => {
                let gradeFee = enrollment.grade_section.grade.grade_fee.fee
                return {
                    student_id: enrollment.student_id,
                    student_enrollment_id: enrollment.id,
                    month: formattedMonth,
                    amount_due: gradeFee,
                    amount_paid: false,
                    is_paid: false,
                };
            });
        if (feeEntries.length > 0) {
            await MonthlyFee.bulkCreate(feeEntries);
            return res.status(200).json({ message: 'Monthly fees generated successfully.', entries: feeEntries });
        } else {
            return res.status(200).json({ message: 'No new fees to generate for this grade.' });
        }

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Something went wrong' })
    }

}

const payFee = async (req, res) => {
    try {
        const monthly_fee = await MonthlyFee.update({
            amount_paid: req.body.amount_paid,
            payment_date: req.body.payment_date,
            is_paid: true
        }, {
            where: {
                id: req.body.id,
            }
        })
        let school_fund = await SchoolFund.findOne({})
        await SchoolFund.update({
            current_balance: parseFloat(school_fund.current_balance) + parseFloat(req.body.amount_paid)
        }, {
            where: {
                id: 1
            }
        })
        let school_fund_transaction = await SchoolFundTransaction.create({
            transaction_date: req.body.payment_date,
            type: 'income',
            amount: req.body.amount_paid,
            balance_after: parseFloat(school_fund.current_balance) + parseFloat(req.body.amount_paid),
            description: 'Fees Received'
        })
        res.status(200).send(school_fund_transaction)

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }
}

//Get Student's Pending Fee
const getStudentPendingFees = async (req, res) => {
    try {
        const pendingFees = await MonthlyFee.findAll({
            where: {
                student_id: req.params.id,
                is_paid: false // or you could omit this if you want to also capture partially paid fees
            },
            include: [{
                model: Student,  // Assuming you have a Student model
                required: true,
                as: 'student'  // Ensures only students with pending fees are returned
            }],
            order: [['month', 'ASC']], // Optional: Order by month or any other field
        });
        res.status(200).send(pendingFees)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }
}

//Get All Pending Fees
const getAllPendingFees = async (req, res) => {
    try {
        const pendingFees = await MonthlyFee.findAll({
            where: {
                 // or you could omit this if you want to also capture partially paid fees
            },
            include: [{
                model: Student,  // Assuming you have a Student model
                required: true,
                as: 'student',
                attributes: ['id', 'first_name', "father_name", "last_name"]  // Ensures only students with pending fees are returned
            }],
            order: [['month', 'ASC']], // Optional: Order by month or any other field
        });
        res.status(200).send(pendingFees)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }
}

//Get Fees Paid in the selected date 
const getFeesPaidInDateRange = async (req, res) => {
    try {
        const feesPaid = await MonthlyFee.findAll({
            where: {
                payment_date: {
                    [Op.between]: [req.body.startDate, req.body.endDate], // Filter by date range
                },
                is_paid: true, // Ensure only paid fees are included
            },
            attributes: ['student_id', 'amount_paid', 'payment_date'], // Select relevant fields
            include: {
                model: Student,
                as: 'student',
                attributes: ['first_name', 'last_name'], // Include student details
            },
        });
        res.status(200).send(feesPaid)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }
}

const getSectionMonthlyFee = async (req, res) => {
    try {
        const sectionWiseFees = await GradeSection.findAll({
            attributes: ['id', 'name'], // Select only relevant fields for GradeSection
            include: [
                {
                    model: StudentEnrollment,
                    as: 'student_enrollment',
                    attributes: ['id'], // Select only enrollment ID
                    include: [
                        {
                            model: MonthlyFee,
                            as: 'monthly_fee',
                            attributes: [
                                'month',
                                'amount_due',
                                'amount_paid',
                                'payment_date',
                                'is_paid',
                            ],
                            where: {
                                month: req.body.month, // Filter for the specific month
                            },
                        },
                        {
                            model: Student,
                            as: 'student',
                            attributes: ['first_name', 'last_name']
                        }
                    ],
                },
            ],
        });
        res.status(200).send(sectionWiseFees)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }
}

//Get session wise total amt pending and number of pending fees count
const getTotalAmtPending = async (req, res) => {
    try {
        const result = await MonthlyFee.findAll({
            attributes: [
                [Sequelize.fn('COUNT', Sequelize.col('monthly_fee.student_id')), 'total_students_with_pending_fees'],
                [Sequelize.fn('SUM', Sequelize.col('amount_due')), 'total_pending_amount']
            ],
            include: [
                {
                    model: StudentEnrollment,
                    as: 'student_enrollment',
                    attributes: [], // We don't need additional columns from this table
                    include: [
                        {
                            model: GradeSection,
                            as: 'grade_section',
                            attributes: [], // We don't need additional columns from this table
                            include: [
                                {
                                    model: Grade,
                                    as: 'grade',
                                    attributes: [], // We don't need additional columns from this table
                                    where: { session_id: req.params.id } // Filter by session ID
                                }
                            ]
                        }
                    ]
                }
            ],
            where: { is_paid: false }, // Only unpaid fees
            raw: true
        });

        const pending_fees = {
            total_students_with_pending_fees: parseInt(result[0]?.total_students_with_pending_fees || 0, 10),
            total_pending_amount: parseFloat(result[0]?.total_pending_amount || 0.0)
        };
        res.status(200).send(pending_fees)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }
}

const getTotalAmtPendingForMonth = async (req, res) => {
    try {
        const result = await MonthlyFee.findAll({
            attributes: [
                [Sequelize.fn('COUNT', Sequelize.literal('DISTINCT CASE WHEN amount_due > amount_paid THEN monthly_fee.student_id END')), 'total_students_with_pending_fees'],
                [Sequelize.fn('SUM', Sequelize.literal('amount_due-amount_paid')), 'total_pending_amount'],
                // Total Paid Fees
                [Sequelize.fn('SUM', Sequelize.col('amount_paid')), 'total_paid_amount'],
                //Total Students Who Paid
                [Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN amount_paid > 0 THEN monthly_fee.student_id END')), 'students_who_paid']
            ],
            include: [
                {
                    model: StudentEnrollment,
                    as: 'student_enrollment',
                    attributes: [], // We don't need additional columns from this table
                    include: [
                        {
                            model: GradeSection,
                            as: 'grade_section',
                            attributes: [], // We don't need additional columns from this table
                            include: [
                                {
                                    model: Grade,
                                    as: 'grade',
                                    attributes: [], // We don't need additional columns from this table
                                    where: { session_id: req.params.id } // Filter by session ID
                                }
                            ]
                        }
                    ]
                }
            ],
            where: {
                month: req.query.month
            }, // Only unpaid fees
            raw: true
        });

        const pending_fees = {
            total_students_with_pending_fees: parseInt(result[0]?.total_students_with_pending_fees || 0, 10),
            total_pending_amount: parseFloat(result[0]?.total_pending_amount || 0.0),
            total_paid_amount: parseFloat(result[0]?.total_paid_amount || 0.0),
            students_who_paid: parseInt(result[0]?.students_who_paid || 0, 10)
        };
        res.status(200).send(pending_fees)

    } catch (error) {
        console.log(error)
        res.status(500).send(error.error.message)
    }
}

const getTotalAmtPendingForAllMonths = async (req, res) => {
    try {
        const result = await MonthlyFee.findAll({
            attributes: [
                'month',
                [Sequelize.fn('COUNT', Sequelize.literal('DISTINCT CASE WHEN amount_due > amount_paid THEN monthly_fee.student_id END')), 'total_students_with_pending_fees'],
                [Sequelize.fn('SUM', Sequelize.literal('amount_due-amount_paid')), 'total_pending_amount'],
                // Total Paid Fees
                [Sequelize.fn('SUM', Sequelize.col('amount_paid')), 'total_paid_amount'],
                //Total Students Who Paid
                [Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN amount_paid > 0 THEN monthly_fee.student_id END')), 'students_who_paid']
            ],
            include: [
                {
                    model: StudentEnrollment,
                    as: 'student_enrollment',
                    attributes: [], // We don't need additional columns from this table
                    include: [
                        {
                            model: GradeSection,
                            as: 'grade_section',
                            attributes: [], // We don't need additional columns from this table
                            include: [
                                {
                                    model: Grade,
                                    as: 'grade',
                                    attributes: [], // We don't need additional columns from this table
                                    where: { session_id: req.params.id } // Filter by session ID
                                }
                            ]
                        }
                    ]
                }
            ],
            having: Sequelize.literal('SUM(amount_due) > 0'), // Ensure pending amount is greater than zero
            group: ['month'], // Group by month
            order: [['month', 'ASC']], // Optional: Order by month
            raw: true
        });

        const pending_fees = result.map(row => ({
            month: row.month,
            total_students_with_pending_fees: parseInt(row.total_students_with_pending_fees || 0, 10),
            total_pending_amount: parseFloat(row.total_pending_amount || 0.0),
            total_paid_amount: parseFloat(row.total_paid_amount || 0.0),
            students_who_paid: parseInt(row.students_who_paid || 0, 10)
        }));
        res.status(200).send(pending_fees)

    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
}

const getGradewiseMonthlyFee = async (req, res) => {
    try {

        const grades = await Grade.findAll({
            where: {
                session_id: req.params.id
            },
            attributes: ['id', 'name']  // Fetch the grade ID and name
        });
        
        // Initialize an empty array to store the results
        const result = [];
        
        // Loop over each grade to fetch the corresponding fee details
        for (let grade of grades) {
            const feeDetails = await MonthlyFee.findAll({
                where: {
                    month: req.query.month,  // Filter records by the month passed in query
                },
                attributes: [
                    [sequelize.fn('sum', Sequelize.literal('amount_due-amount_paid')), 'totalPendingAmount'],
                    [sequelize.fn('sum', sequelize.col('amount_paid')), 'totalPaidAmount'],
                    [sequelize.fn('count', sequelize.literal('DISTINCT CASE WHEN amount_due > amount_paid THEN monthly_fee.student_id END')), 'totalPendingStudents'],
                    [sequelize.fn('count', sequelize.literal('CASE WHEN amount_paid > 0 THEN monthly_fee.student_id END')), 'totalPaidStudents'],
                ],
                include: [
                    {
                        model: StudentEnrollment,
                        as: 'student_enrollment',
                        attributes: [],
                        include: [
                            {
                                model: GradeSection,
                                as: 'grade_section',
                                attributes: [],
                                where: {
                                    grade_id: grade.id  // Filter by current grade_id
                                },
                                required: 'true',  // Enforce matching GradeSection
                            },
                        ],
                    },
                ],
                raw: true,  // Return plain data
            });
        
            // Push the results for the current grade into the result array
            result.push({
                grade_id: grade.id,
                grade_name: grade.name,
                totalPendingAmount: feeDetails.length > 0 ? feeDetails[0].totalPendingAmount : 0,
                totalPaidAmount: feeDetails.length > 0 ? feeDetails[0].totalPaidAmount : 0,
                totalPendingStudents: feeDetails.length > 0 ? feeDetails[0].totalPendingStudents : 0,
                totalPaidStudents: feeDetails.length > 0 ? feeDetails[0].totalPaidStudents : 0
            });
        }
        
        // Send the result as the response
        res.status(200).send(result);
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }
}

const getMonthlyDetailByGradeId = async(req,res)=>{
    try {
        const feeDetails = await MonthlyFee.findOne({
            where: {
                month: req.query.month,  // Filter records by the month passed in query
            },
            attributes: [
                [sequelize.fn('sum', Sequelize.literal('amount_due-amount_paid')), 'total_pending_amount'],
                [sequelize.fn('sum', sequelize.col('amount_paid')), 'total_paid_amount'],
                [sequelize.fn('count', sequelize.literal('DISTINCT CASE WHEN amount_due > amount_paid THEN monthly_fee.student_id END')), 'total_students_with_pending_fees'],
                [sequelize.fn('count', sequelize.literal('CASE WHEN amount_paid > 0 THEN monthly_fee.student_id END')), 'students_who_paid'],
            ],
            include: [
                {
                    model: StudentEnrollment,
                    as: 'student_enrollment',
                    attributes: [],
                    include: [
                        {
                            model: GradeSection,
                            as: 'grade_section',
                            attributes: [],
                            where: {
                                grade_id: req.params.id  // Filter by current grade_id
                            },
                            required: 'true',  // Enforce matching GradeSection
                        },
                    ],
                },
            ],
            raw: true,  // Return plain data
        });
        res.status(200).send(feeDetails);
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }
}

const getFeeDataOfAllMonthsByGradeID = async(req,res)=>{
    try {
        const result = await MonthlyFee.findAll({
            attributes: [
                'month',
                [Sequelize.fn('COUNT', Sequelize.literal('DISTINCT CASE WHEN amount_due > amount_paid THEN monthly_fee.student_id END')), 'total_students_with_pending_fees'],
                [Sequelize.fn('SUM', Sequelize.literal('amount_due-amount_paid')), 'total_pending_amount'],
                // Total Paid Fees
                [Sequelize.fn('SUM', Sequelize.col('amount_paid')), 'total_paid_amount'],
                //Total Students Who Paid
                [Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN amount_paid > 0 THEN monthly_fee.student_id END')), 'students_who_paid']
            ],
            include: [
                {
                    model: StudentEnrollment,
                    as: 'student_enrollment',
                    attributes: [], // We don't need additional columns from this table
                    include: [
                        {
                            model: GradeSection,
                            as: 'grade_section',
                            attributes: [], // We don't need additional columns from this table
                            include: [
                                {
                                    model: Grade,
                                    as: 'grade',
                                    required :'true',
                                    attributes: [], // We don't need additional columns from this table
                                    where: { id: req.params.id } // Filter by Grade ID
                                }
                            ]
                        }
                    ]
                }
            ],
            having: Sequelize.literal('SUM(amount_due) > 0'), // Ensure pending amount is greater than zero
            group: ['month'], // Group by month
            order: [['month', 'ASC']], // Optional: Order by month
            raw: true
        });

        const pending_fees = result.map(row => ({
            month: row.month,
            total_students_with_pending_fees: parseInt(row.total_students_with_pending_fees || 0, 10),
            total_pending_amount: parseFloat(row.total_pending_amount || 0.0),
            total_paid_amount: parseFloat(row.total_paid_amount || 0.0),
            students_who_paid: parseInt(row.students_who_paid || 0, 10)
        }));
        res.status(200).send(pending_fees)

    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
}

const getMonthlyPendingFeesByGrade = async(req,res)=>{
    try {
        const students = await MonthlyFee.findAll({
            where : {
                month : req.query.month,
                is_paid : false
            },
            attributes:[],
            include : [{
                model :  StudentEnrollment,
                as : 'student_enrollment',
                where : {
                    status : 'active'
                },
                attributes : ['id'],
                include : [{
                    model : Student,
                    as : 'student',
                    attributes : ['id','first_name','father_name','last_name','contact_number']
                },{
                    model : GradeSection,
                    as : 'grade_section',
                    required : 'true',
                    where : {
                        grade_id : req.params.id
                    },
                    attributes:[]
                }]
            }]
        })
        res.status(200).send(students)

    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
}

const getMonthlyPaidFeesByGrade = async(req,res)=>{
    try {
        const students = await MonthlyFee.findAll({
            where : {
                month : req.query.month,
                is_paid : true
            },
            attributes:['month','payment_date'],
            include : [{
                model :  StudentEnrollment,
                as : 'student_enrollment',
                where : {
                    status : 'active'
                },
                attributes : ['id'],
                include : [{
                    model : Student,
                    as : 'student',
                    attributes : ['id','first_name','father_name','last_name','contact_number']
                },{
                    model : GradeSection,
                    as : 'grade_section',
                    required : 'true',
                    where : {
                        grade_id : req.params.id
                    },
                    attributes:[]
                }]
            }]
        })
        res.status(200).send(students)

    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
}

const getStudentFeeDetails = async(req,res)=>{
    try {
        const feeDetials = await Student.findOne({
            where :{
                id : req.params.id
            },
            include:[{
                model:StudentEnrollment,
                as :'student_enrollment',
                required:'true',
                attributes:['id'],
                include : [{
                    model : MonthlyFee,
                    as :'monthly_fee'
                },{
                    model : GradeSection,
                    as : 'grade_section',
                    attributes :['name'],
                    include:[{
                        model :Grade,
                        as : 'grade',
                        attributes:['name']
                    }]
                }]
            }]
        })
        console.log(feeDetials)
        res.status(200).send(feeDetials)
        
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
}

const getMonthWisePendingStudents = async(req,res)=>{
    try {
    console.log("hello")
        const pending_students = await Student.findAll({
            include:[{
                model : MonthlyFee,
                as : 'monthly_fee',
                required : 'true',
                where : {
                    is_paid : false,
                    month:req.params.month
                }
            },{
                model : StudentEnrollment,
                as : 'student_enrollment',
                required:'true',
                where : {
                    status : 'active'
                },
                attributes:['id'],
                include : [{
                    model : GradeSection,
                    as :'grade_section',
                    attributes :['id','name'],
                    include :[{
                        model : Grade,
                        as :'grade',
                        attributes :['name']
                    }]
                }]
            }]  
        })
        console.log(pending_students)
        res.status(200).send(pending_students)
    } catch (error) {
        console.log(error)
        res.status(500).send({message:error.message})
    }
}

const getStudentPendingFeeCount = async(req,res)=>{
    try {
        const pendingFeesCount = await MonthlyFee.count({
            where: {
                student_id: req.params.id,
                is_paid: false
            }
        });
        console.log(pendingFeesCount)
        res.status(200).send({count:pendingFeesCount})
    } catch (error) {
        console.log(error)
        res.status(500).send({error:error.message})
    }
}
module.exports = {
    generateMonthlyFee,
    payFee,
    getStudentPendingFees,
    getAllPendingFees,
    getFeesPaidInDateRange,
    getSectionMonthlyFee,
    getTotalAmtPending,
    getTotalAmtPendingForMonth,
    getTotalAmtPendingForAllMonths,
    getGradewiseMonthlyFee,
    getMonthlyDetailByGradeId,
    getFeeDataOfAllMonthsByGradeID,
    getMonthlyPendingFeesByGrade,
    getMonthlyPaidFeesByGrade,
    getStudentFeeDetails,
    getMonthWisePendingStudents,
    getStudentPendingFeeCount
}