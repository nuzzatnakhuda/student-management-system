const db = require('../models');
const { Op } = require('sequelize');

const SemesterFee = db.semester_fee;
const StudentEnrollment = db.student_enrollment;
const GradeSection = db.grade_sections;
const Grade = db.grades;
const SchoolFund = db.school_fund;
const SchoolFundTransaction = db.school_fund_transaction;
const Student = db.student;
const Sequelize = db.Sequelize;
const sequelize = db.sequelize;

const generateSemesterFee = async (req, res) => {
    try {
        const { semester, session_id, amount_due, due_date } = req.body;

        const enrollments = await StudentEnrollment.findAll({
            where: { status: 'active' },
            include: [{
                model: GradeSection,
                required: true,
                as: 'grade_section',
                include: [{
                    model: Grade,
                    as: 'grade',
                    where: { session_id }
                }]
            }]
        });

        const existingFees = await SemesterFee.findAll({
            where: { semester }
        });
        
        const existingEnrollmentIds = existingFees.map(fee => fee.student_enrollment_id);

        const feeEntries = enrollments
            .filter(enrollment => !existingEnrollmentIds.includes(enrollment.id))
            .map(enrollment => ({
                student_id: enrollment.student_id,
                student_enrollment_id: enrollment.id,
                semester:semester,
                amount_due:amount_due,
                due_date:due_date,
                amount_paid: 0,
                is_paid: false
            }));

        if (feeEntries.length > 0) {
            await SemesterFee.bulkCreate(feeEntries);
            return res.status(200).json({ message: 'Semester fees generated successfully.', entries: feeEntries });
        } else {
            return res.status(200).json({ message: 'No new semester fees to generate.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

const getTotalAmtPendingSemesterFees = async (req, res) => {
    try {
        const result = await SemesterFee.findAll({
            attributes: [
                'semester',
                [Sequelize.fn('COUNT', Sequelize.literal('IF(semester_fee.is_paid = false, 1, NULL)')), 'total_students_with_pending_fees'],
                [Sequelize.fn('SUM', Sequelize.literal('IF(semester_fee.is_paid = false, semester_fee.amount_due, 0)')), 'total_pending_amount'],
                [Sequelize.fn('COUNT', Sequelize.literal('IF(semester_fee.is_paid = true, 1, NULL)')), 'total_students_with_paid_fees'],
                [Sequelize.fn('SUM', Sequelize.literal('IF(semester_fee.is_paid = true, semester_fee.amount_paid, 0)')), 'total_paid_amount']
            ],
            include: [{
                model: StudentEnrollment,
                as: 'student_enrollment',
                attributes: [],
                include: [{
                    model: GradeSection,
                    as: 'grade_section',
                    attributes: [],
                    include: [{
                        model: Grade,
                        as: 'grade',
                        attributes: [],
                        where: { session_id: req.params.id }
                    }]
                }]
            }],
            group: ['semester_fee.semester'],
            raw: true
        });

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const paySemesterFee = async (req, res) => {
    try {
        let semesterFee = await SemesterFee.update({
            amount_paid: req.body.amount_paid,
            payment_date: req.body.payment_date,
            is_paid: true
        }, {
            where: { id: req.body.id }
        });

        semesterFee = await SemesterFee.findOne({ where: { id: req.body.id } });
        let school_fund = await SchoolFund.findOne({ where: { id: 1 } });

        await SchoolFund.update({
            current_balance: parseFloat(school_fund.current_balance) + parseFloat(req.body.amount_paid)
        }, { where: { id: 1 } });

        let school_fund_transaction = await SchoolFundTransaction.create({
            transaction_date: req.body.payment_date,
            type: 'income',
            amount: req.body.amount_paid,
            balance_after: parseFloat(school_fund.current_balance) + parseFloat(req.body.amount_paid),
            description: `Semester ${semesterFee.semester} Fees Received`
        });

        res.status(200).send(school_fund_transaction);
    } catch (error) {
        console.error('Error processing semester fee payment:', error);
        res.status(500).send({ message: error.message });
    }
};

const getSemesterSummary = async (req, res) => {
    try {
        const result = await SemesterFee.findAll({
            attributes: [
                'semester',
                // Count only students with pending fees (is_paid = false)
                [Sequelize.fn('COUNT', Sequelize.literal('IF(semester_fee.is_paid = false, 1, NULL)')), 'total_students_with_pending_fees'],
                // Count only students with paid fees (is_paid = true)
                [Sequelize.fn('COUNT', Sequelize.literal('IF(semester_fee.is_paid = true, 1, NULL)')), 'total_students_with_paid_fees'],
                // Sum the pending amounts (is_paid = false)
                [Sequelize.fn('SUM', Sequelize.literal('IF(semester_fee.is_paid = false, semester_fee.amount_due, 0)')), 'total_pending_amount'],
                // Sum the paid amounts (is_paid = true)
                [Sequelize.fn('SUM', Sequelize.literal('IF(semester_fee.is_paid = true, semester_fee.amount_paid, 0)')), 'total_paid_amount']
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
                semester: req.params.semester // Filter by semester
            },
            group: ['semester_fee.semester', 'student_enrollment.grade_section.grade.id', 'student_enrollment.grade_section.grade.name'],
            raw: true
        });

        // Format the result
        const formattedResult = result.map(row => ({
            semester: row.semester,
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
        console.error('Error processing semester summary:', error);
        res.status(500).send({ message: 'Something went wrong' });
    }
};

const getStudentsWithPendingSemesterFees = async (req, res) => {
    try {
        const { semester, grade_id } = req.params; // Get semester & grade ID from request params

        const students = await SemesterFee.findAll({
            attributes: [
                'id',
                'amount_due',
                'amount_paid'
            ],
            include: [
                {
                    model: StudentEnrollment,
                    as: 'student_enrollment',
                    required: true,
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
                            attributes: ['id', 'first_name', 'father_name', 'last_name', 'email', 'contact_number']
                        }
                    ]
                }
            ],
            where: { semester, is_paid: false }, // Filter unpaid fees
            raw: true
        });

        if (students.length === 0) {
            return res.status(200).json({ message: 'No pending semester fees for this grade.' });
        }

        const formattedStudents = students.map(student => ({
            id: student.id,
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
        console.log(formattedStudents);
        res.status(200).json(formattedStudents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};

const getStudentsWithPaidSemesterFees = async (req, res) => {
    try {
        const { semester, grade_id } = req.params; // Get semester & grade ID from request params

        const students = await SemesterFee.findAll({
            attributes: [
                'amount_due',
                'amount_paid',
                'payment_date'
            ],
            include: [
                {
                    model: StudentEnrollment,
                    as: 'student_enrollment',
                    required: true,
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
                            attributes: ['id', 'first_name', 'father_name', 'last_name', 'email', 'contact_number']
                        }
                    ]
                }
            ],
            where: { semester, is_paid: true }, // Filter paid fees
            raw: true
        });

        if (students.length === 0) {
            return res.status(200).json({ message: 'No paid semester fees for this grade.' });
        }

        const formattedStudents = students.map(student => ({
            id: student['student_enrollment.student.id'],
            payment_date: student.payment_date,
            student_id: student['student_enrollment.student.id'],
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
        console.log(formattedStudents);
        res.status(200).json(formattedStudents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};

const getStudentFeeDetails = async(req,res)=>{
    try {
        const feeDetails = await SemesterFee.findAll({
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

const getAllSemester = async(req,res)=>{
    try {
        const semester = await SemesterFee.findAll({
            attributes: [[sequelize.fn('DISTINCT', sequelize.col('semester')), 'semester'],
        'amount_due']
        });
        res.status(200).send(semester);
        
    } catch (error) {
        console.log(error)
        res.status(500).send({error:error.message})
    }
}

module.exports = {
    generateSemesterFee,
    getTotalAmtPendingSemesterFees,
    paySemesterFee,
    getSemesterSummary,
    getStudentsWithPaidSemesterFees,
    getStudentsWithPendingSemesterFees,
    getStudentFeeDetails,
    getAllSemester
};
