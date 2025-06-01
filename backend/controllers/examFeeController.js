const db = require('../models')
const { Op } = require('sequelize')

const ExamFee = db.exam_fee
const StudentEnrollment = db.student_enrollment
const GradeSection = db.grade_sections
const Grade = db.grades
const GradeFee = db.grade_fees
const SchoolFund = db.school_fund
const SchoolFundTransaction = db.school_fund_transaction
const Student = db.student
const Sequelize = db.Sequelize
const sequelize = db.sequelize

const generateExamFee = async (req, res) => {
    try {
        // Fetch active student enrollments for the given session
        const enrollments = await StudentEnrollment.findAll({
            where: { status: 'active' },
            include: [
                {
                    model: GradeSection,
                    required: true,
                    as: 'grade_section',
                    include: [{
                        model: Grade,
                        as: 'grade',
                        where: { session_id: req.body.session_id }
                    }]
                }
            ]
        });

        // Fetch existing exam fees for this exam
        const existingFees = await ExamFee.findAll({
            where: {
                exam_name: req.body.exam_name,
            }
        });

        const existingEnrollmentIds = existingFees.map((fee) => fee.student_enrollment_id);

        // Create new fee entries for students who don't have this exam fee already
        const feeEntries = enrollments
            .filter((enrollment) => !existingEnrollmentIds.includes(enrollment.id))
            .map((enrollment) => ({
                student_id: enrollment.student_id,
                student_enrollment_id: enrollment.id,
                exam_name: req.body.exam_name,
                amount_due: req.body.amount_due,
                due_date: req.body.due_date,
                amount_paid: 0,
                is_paid: false
            }));

        if (feeEntries.length > 0) {
            await ExamFee.bulkCreate(feeEntries);
            return res.status(200).json({ message: 'Exam fees generated successfully.', entries: feeEntries });
        } else {
            return res.status(200).json({ message: 'No new exam fees to generate.' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};


const getTotalAmtPendingExamFees = async (req, res) => {
    try {
        const result = await ExamFee.findAll({
            attributes: [
                'exam_name', // Group by exam name
                // Count students with pending fees (where is_paid = false)
                [Sequelize.fn('COUNT', Sequelize.literal('IF(exam_fee.is_paid = false, 1, NULL)')), 'total_students_with_pending_fees'],
                // Sum the pending amount (where is_paid = false)
                [Sequelize.fn('SUM', Sequelize.literal('IF(exam_fee.is_paid = false, exam_fee.amount_due, 0)')), 'total_pending_amount'],
                // Count students who have paid (where is_paid = true)
                [Sequelize.fn('COUNT', Sequelize.literal('IF(exam_fee.is_paid = true, 1, NULL)')), 'total_students_with_paid_fees'],
                // Sum the paid amount (where is_paid = true)
                [Sequelize.fn('SUM', Sequelize.literal('IF(exam_fee.is_paid = true, exam_fee.amount_paid, 0)')), 'total_paid_amount']
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
                            include: [
                                {
                                    model: Grade,
                                    as: 'grade',
                                    attributes: [],
                                    where: { session_id: req.params.id } // Filter by session ID
                                }
                            ]
                        }
                    ]
                }
            ],
            group: ['exam_fee.exam_name'], // Group by exam_name
            raw: true
        });

        const pending_exam_fees = result.map((item) => ({
            exam_name: item.exam_name,
            total_students_with_pending_fees: parseInt(item.total_students_with_pending_fees, 10) || 0,
            total_pending_amount: parseFloat(item.total_pending_amount, 10) || 0,
            total_paid_amount: parseFloat(item.total_paid_amount, 10) || 0,
            total_students_with_paid_fees: parseInt(item.total_students_with_paid_fees, 10) || 0
        }));
        res.status(200).send(pending_exam_fees);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
};

const getExamSummary = async (req, res) => {
    try {
        const result = await ExamFee.findAll({
            attributes: [
                'exam_name',
                // Count only students with pending fees (is_paid = false)
                [Sequelize.fn('COUNT', Sequelize.literal('IF(exam_fee.is_paid = false, 1, NULL)')), 'total_students_with_pending_fees'],
                // Count only students with paid fees (is_paid = true)
                [Sequelize.fn('COUNT', Sequelize.literal('IF(exam_fee.is_paid = true, 1, NULL)')), 'total_students_with_paid_fees'],
                // Sum the pending amounts (is_paid = false)
                [Sequelize.fn('SUM', Sequelize.literal('IF(exam_fee.is_paid = false, exam_fee.amount_due, 0)')), 'total_pending_amount'],
                // Sum the paid amounts (is_paid = true)
                [Sequelize.fn('SUM', Sequelize.literal('IF(exam_fee.is_paid = true, exam_fee.amount_paid, 0)')), 'total_paid_amount']
            ],
            include: [
                {
                    model: StudentEnrollment,
                    as: 'student_enrollment',
                    required: true,
                    attributes: ['id'],
                    include: [
                        {
                            model: GradeSection,
                            as: 'grade_section',
                            attributes: ['id'],
                            required: true,
                            include: [
                                {
                                    model: Grade,
                                    as: 'grade',
                                    required: true,
                                    attributes: ['id', 'name'],
                                    where: {
                                        session_id: req.params.id
                                    }
                                }
                            ]
                        }
                    ]
                }
            ],
            where: {
                exam_name: req.params.name  // Filter by exam name
            },
            group: ['exam_fee.exam_name', 'student_enrollment.grade_section.grade.id', 'student_enrollment.grade_section.grade.name'],
            raw: true
        });

        // Format the result
        const formattedResult = result.map(row => ({
            exam_name: row.exam_name,
            total_students_with_pending_fees: row.total_students_with_pending_fees ? parseInt(row.total_students_with_pending_fees, 10) : 0,
            total_students_with_paid_fees: row.total_students_with_paid_fees ? parseInt(row.total_students_with_paid_fees, 10) : 0,
            total_pending_amount: row.total_pending_amount ? parseFloat(row.total_pending_amount, 10) : 0,
            total_paid_amount: row.total_paid_amount ? parseFloat(row.total_paid_amount, 10) : 0,
            grade: {
                id: row['student_enrollment.grade_section.grade.id'],
                name: row['student_enrollment.grade_section.grade.name']
            }
        }));

        console.log(formattedResult);
        res.status(200).json(formattedResult);

    } catch (error) {
        console.error('Error processing exam summary:', error);
        res.status(500).send({ message: 'Something went wrong' });
    }
};

const getStudentsWithPendingFees = async (req, res) => {
    try {
        const { exam_name, grade_id } = req.params; // Get exam name & grade ID from request params

        const students = await ExamFee.findAll({
            attributes: [
                'id',
                'amount_due',
                'amount_paid'
            ],
            include: [
                {
                    model: StudentEnrollment,
                    as: 'student_enrollment',
                    required:'true',
                    attributes: [],
                    include: [
                        {
                            model: GradeSection,
                            as: 'grade_section',
                            attributes: ['name'],
                            required: 'true',
                            include: [
                                {
                                    model: Grade,
                                    as: 'grade',
                                    required: 'true',
                                    attributes: ['id', 'name'],
                                    where: { id: grade_id } // Filter by grade
                                }
                            ]
                        },
                        {
                            model: Student,
                            as: 'student',
                            attributes: ['id','first_name', 'father_name', 'last_name', 'email', 'contact_number']
                        }
                    ]
                }
            ],
            where: { exam_name, is_paid: false }, // Filter unpaid fees
            raw: true
        });

        if (students.length === 0) {
            return res.status(200).json({ message: 'No pending exam fees for this grade.' });
        }
        const formattedStudents = students.map(student => ({
            id:student.id,
            first_name: student['student_enrollment.student.first_name'],
            father_name: student['student_enrollment.student.father_name'],
            last_name: student['student_enrollment.student.last_name'],
            email: student['student_enrollment.student.email'],
            contact_number: student['student_enrollment.student.contact_number'],
            amount_due: parseFloat(student.amount_due),
            amount_paid: parseFloat(student.amount_paid),
            grade: {
                id: grade_id,
                name: student['student_enrollment.grade_section.grade.name']
            },
            section_name: student['student_enrollment.grade_section.name']
        }));
        console.log(formattedStudents)
        res.status(200).json(formattedStudents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};

const getStudentsWithPaidFees = async (req, res) => {
    try {
        const { exam_name, grade_id } = req.params; // Get exam name & grade ID from request params

        const students = await ExamFee.findAll({
            attributes: [
                'amount_due',
                'amount_paid',
                'payment_date'
            ],
            include: [
                {
                    model: StudentEnrollment,
                    as: 'student_enrollment',
                    required:'true',
                    attributes: [],
                    include: [
                        {
                            model: GradeSection,
                            as: 'grade_section',
                            attributes: ['name'],
                            required: true,
                            include: [
                                {
                                    model: Grade,
                                    as: 'grade',
                                    required: true,
                                    attributes: ['id', 'name'],
                                    where: { id: grade_id } // Filter by grade
                                }
                            ]
                        },
                        {
                            model: Student,
                            as: 'student',
                            attributes: ['id','first_name', 'father_name', 'last_name', 'email', 'contact_number']
                        }
                    ]
                }
            ],
            where: { exam_name:exam_name, is_paid: true }, // Filter paid fees
            raw: true
        });

        if (students.length === 0) {
            return res.status(200).json({ message: 'No paid exam fees for this grade.' });
        }

        const formattedStudents = students.map(student => ({
            id:student['student_enrollment.student.id'],
            payment_date:student.payment_date,
            student_id :student['student_enrollment.student.id'],
            first_name: student['student_enrollment.student.first_name'],
            father_name: student['student_enrollment.student.father_name'],
            last_name: student['student_enrollment.student.last_name'],
            email: student['student_enrollment.student.email'],
            contact_number: student['student_enrollment.student.contact_number'],
            amount_due: parseFloat(student.amount_due),
            amount_paid: parseFloat(student.amount_paid),
            grade: {
                id: grade_id,
                name: student['student_enrollment.grade_section.grade.name']
            },
            section_name: student['student_enrollment.grade_section.name']
        }));
        console.log(formattedStudents)
        res.status(200).json(formattedStudents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};

const payExamFee = async (req, res) => {
    try {
        // Update Exam Fee Record
        let examFee = await ExamFee.update({
            amount_paid: req.body.amount_paid,
            payment_date: req.body.payment_date,
            is_paid: true
        }, {
            where: {
                id: req.body.id,
            }
        });
        examFee = await ExamFee.findOne({
            where: {
                id: req.body.id,
            }
        })
        // Fetch Current School Fund Balance
        let school_fund = await SchoolFund.findOne({ where: { id: 1 } });

        // Update School Fund Balance
        await SchoolFund.update({
            current_balance: parseFloat(school_fund.current_balance) + parseFloat(req.body.amount_paid)
        }, {
            where: { id: 1 }
        });

        // Record Transaction in School Fund Transactions
        let school_fund_transaction = await SchoolFundTransaction.create({
            transaction_date: req.body.payment_date,
            type: 'income',
            amount: req.body.amount_paid,
            balance_after: parseFloat(school_fund.current_balance) + parseFloat(req.body.amount_paid),
            description: 'Exam '+ examFee.exam_name+' Fees Received'
        });

        res.status(200).send(school_fund_transaction);

    } catch (error) {
        console.error('Error processing exam fee payment:', error);
        res.status(500).send({ message: error.message });
    }
};

const getStudentFeeDetails = async(req,res)=>{
    try {
        const feeDetails = await ExamFee.findAll({
            where  :{
                student_id : req.params.id
            }
        })
        res.status(200).send(feeDetails)
        
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
}


module.exports = {
    generateExamFee,
    getTotalAmtPendingExamFees,
    getExamSummary,
    getStudentsWithPendingFees,
    getStudentsWithPaidFees,
    payExamFee,
    getStudentFeeDetails,
}