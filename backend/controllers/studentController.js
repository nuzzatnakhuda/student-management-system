const db = require('../models')
const { Op,Sequelize } = require('sequelize')

const Student = db.student
const StudentFamilyInfo = db.student_family
const StudentPastSchool = db.student_past_school
const StudentEnrollment = db.student_enrollment
const StudentExit = db.student_exit
const StudentPromotion = db.student_promotions
const GradeSection = db.grade_sections
const Grade = db.grades
const GradeFees = db.grade_fees
const SchoolFund = db.school_fund
const SchoolFundTransaction = db.school_fund_transaction
const sequelize = db.sequelize
const SemesterFee = db.semester_fee
const GradeFee = db.grade_fees
const MonthlyFee = db.monthly_fee
const Employee=db.employees
const JobDetail=db.job_details

const addStudent = async (req, res) => {
    try {
        const student = await Student.create({
            first_name: req.body.first_name,
            father_name: req.body.father_name,
            last_name: req.body.last_name,
            date_of_birth: req.body.date_of_birth,
            gender: req.body.gender,
            address: req.body.address,
            contact_number: req.body.contact_number,
            email: req.body.email
        })
        const student_family_info = await StudentFamilyInfo.create({
            student_id: student.id,
            religion: req.body.religion,
            caste: req.body.caste,
            place_of_birth: req.body.place_of_birth,
            father_occupation: req.body.father_occupation,
            occupation_address: req.body.occupation_address,
        })
        if (req.body.school_name) {
            let student_past_school = await StudentPastSchool.create({
                student_id: student.id,
                school_name: req.body.school_name,
                last_grade: req.body.last_grade,
                academic_year: req.body.past_academic_year,
                reason_for_leaving: req.body.reason_for_leaving,
            })
        }
        const student_enrollment = await StudentEnrollment.create({
            student_id: student.id,
            grade_section_id: req.body.grade_section_id,
            academic_year: req.body.academic_year,
            enrollment_date: req.body.enrollment_date,
            status: 'active',
            remarks: req.body.remarks,
        })
        if (req.body.newAdmission) {
            let school_fund = await SchoolFund.findOne({})
            await SchoolFund.update({
                current_balance: parseFloat(school_fund.current_balance) + parseFloat(req.body.admission_fee)
            }, {
                where: {
                    id: 1
                }
            })
            let school_fund_transaction = await SchoolFundTransaction.create({
                transaction_date: req.body.payment_date,
                type: 'income',
                amount: req.body.admission_fee,
                balance_after: parseFloat(school_fund.current_balance) + parseFloat(req.body.admission_fee),
                description: 'Admission Fees Received'
            })
            console.log("Semester:", req.body.semester);
            let semester_fee = await SemesterFee.create({
                student_id: student.id,
                student_enrollment_id: student_enrollment.id,
                semester: req.body.semester,
                amount_due: parseFloat(req.body.semesterFee),
                due_date: req.body.payment_date,
                amount_paid: parseFloat(req.body.semesterFee),
                payment_date: req.body.payment_date,
                is_paid: true
            })

            school_fund = await SchoolFund.findOne({})
            await SchoolFund.update({
                current_balance: parseFloat(school_fund.current_balance) + parseFloat(req.body.semesterFee)
            }, {
                where: {
                    id: 1
                }
            })
            school_fund_transaction = await SchoolFundTransaction.create({
                transaction_date: req.body.payment_date,
                type: 'income',
                amount: req.body.admission_fee,
                balance_after: parseFloat(school_fund.current_balance) + parseFloat(req.body.semesterFee),
                description: `Semester ${req.body.semester} Fees Received`
            })

            let grade_id = await GradeSection.findOne({
                where: {
                    id: req.body.grade_section_id
                },
                attributes: ['grade_id']
            })
            let grade_fee = await GradeFee.findOne({
                where: {
                    grade_id: grade_id.grade_id
                },
                attributes: ['fee']
            })
            const date = new Date(req.body.payment_date);
            console.log(grade_fee)
            const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
            let monthly_fee = await MonthlyFee.create({
                student_id: student.id,
                student_enrollment_id: student_enrollment.id,
                month: formattedDate,
                amount_due: parseFloat(grade_fee.fee),
                amount_paid: parseFloat(grade_fee.fee),
                payment_date: req.body.payment_date,
                is_paid: true,
            })

            school_fund = await SchoolFund.findOne({})
            await SchoolFund.update({
                current_balance: parseFloat(school_fund.current_balance) + parseFloat(grade_fee.fee)
            }, {
                where: {
                    id: 1
                }
            })
            school_fund_transaction = await SchoolFundTransaction.create({
                transaction_date: req.body.payment_date,
                type: 'income',
                amount: grade_fee.fee,
                balance_after: parseFloat(school_fund.current_balance) + parseFloat(grade_fee.fee),
                description: 'Fees Received'
            })
            res.status(200).send({ student,semester_fee, monthly_fee })
            return
        }
        res.status(200).send({ student, student_family_info, student_enrollment, })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }

}

const updateStudent = async (req, res) => {
    try {
        let student = await Student.update({
            first_name: req.body.first_name,
            father_name: req.body.father_name,
            last_name: req.body.last_name,
            date_of_birth: req.body.date_of_birth,
            gender: req.body.gender,
            address: req.body.address,
            contact_number: req.body.contact_number,
            email: req.body.email
        }, {
            where: { id: req.params.id }
        })
        let student_family_info = await StudentFamilyInfo.update({
            religion: req.body.religion,
            caste: req.body.caste,
            place_of_birth: req.body.place_of_birth,
            father_occupation: req.body.father_occupation,
            occupation_address: req.body.occupation_address
        }, {
            where: { student_id: req.params.id }
        })
        let student_enrollment = await StudentEnrollment.update({
            grade_section_id: req.body.grade_section_id,
            academic_year: req.body.academic_year,
            enrollment_date: req.body.enrollment_date,
            remarks: req.body.remarks,
        }, {
            where: {
                student_id: req.params.id,
                status: 'active'
            }
        })
        let student_past_school = await StudentPastSchool.findOne({
            where: {
                student_id: req.params.id
            }
        })
        if (student_past_school) {
            student_past_school = await StudentPastSchool.update({
                school_name: req.body.school_name,
                last_grade: req.body.last_grade,
                academic_year: req.body.past_academic_year,
                reason_for_leaving: req.body.reason_for_leaving,
            }, {
                where: {
                    student_id: req.params.id
                }
            })
        }
        else {
            student_past_school = await StudentPastSchool.create({
                student_id: req.params.id,
                school_name: req.body.school_name,
                last_grade: req.body.last_grade,
                academic_year: req.body.past_academic_year,
                reason_for_leaving: req.body.reason_for_leaving,
            })
        }
        res.status(200).send({ student, student_family_info, student_enrollment })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }

}

const studentExit = async (req, res) => {
    try {
        let student_enrollment = await StudentEnrollment.findOne({
            where: {
                student_id: req.params.id,
                status: 'active'
            }
        })
        await StudentEnrollment.update({
            status: 'dropped'
        }, {
            where: { id: student_enrollment.id }
        })
        let student_exit = await StudentExit.create({
            student_id: req.params.id,
            student_enrollment_id: student_enrollment.id,
            exit_date: req.body.exit_date,
            exit_reason: req.body.exit_reason
        })
        res.status(200).send(student_exit)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }
}

const studentPromoted = async (req, res) => {
    try {
        let old_student_enrollment = await StudentEnrollment.findOne({
            where: {
                student_id: req.params.id,
                status: 'active'
            }
        })
        await StudentEnrollment.update({
            status: 'promoted'
        }, {
            where: { id: old_student_enrollment.id }
        })

        const new_student_enrollment = await StudentEnrollment.create({
            student_id: req.params.id,
            grade_section_id: req.body.grade_section_id,
            academic_year: req.body.academic_year,
            enrollment_date: req.body.enrollment_date,
            status: 'active',
            remarks: req.body.remarks,
        })
        let student_promotion = await StudentPromotion.create({
            student_id: req.params.id,
            old_enrollment_id: old_student_enrollment.id,
            new_enrollment_id: new_student_enrollment.id,
            promotion_date: new Date()
        })
        res.status(200).send(student_promotion)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }
}

//Grade Section Wise
const getAllStudents = async (req, res) => {
    try {
        const students = await Student.findAll({
            include: [{
                model: StudentEnrollment,
                as: 'student_enrollment',
                required: true,
                where: {
                    status: 'active'
                },
                order: [['enrollment_date', 'DESC']],
                include: [{
                    model: GradeSection,
                    as: 'grade_section',
                    required: true,
                    attributes: ['name'],
                    where: {
                        id: req.params.id
                    },
                    include: [{
                        model: Grade,
                        as: 'grade',
                        required: true,
                        attributes: ['name']
                    }]
                }]
            }]
        })
        res.status(200).send(students)

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }

}

//All Student Current Enrollment and Personal Information
const getStudentById = async (req, res) => {
    try {
        let student = await Student.findOne({
            where: {
                id: req.params.id
            },
            include: [
                {
                    model: StudentFamilyInfo,
                    as: 'student_family'
                },
                {
                    model: StudentPastSchool,
                    as: 'student_past_school'
                },
                {
                    model: StudentEnrollment,
                    as: 'student_enrollment',
                }
            ]
        })
        res.status(200).send(student)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }

}

//Get Students All Enrollments
const getStudentAllEnrollments = async (req, res) => {
    try {
        let student_enrollments = await StudentEnrollment.findAll({
            where: {
                student_id: req.params.id
            },
            include: [{
                model: GradeSection,
                as: 'grade_section',
                attributes: ['name'],
                include: [{
                    model: Grade,
                    as: 'grade',
                    attributes: ['name']
                }]
            }],
            order: [['enrollment_date', 'DESC']]
        });
        res.status(200).send(student_enrollments)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }

}

//Search All Students
const searchStudent = async (req, res) => {
    try {
        let students = await Student.findAll({
            where: {
                [Op.or]: [
                    { first_name: { [Op.like]: `%${req.query.name}%` } },
                    { last_name: { [Op.like]: `%${req.query.name}%` } },
                ],
            },
            include: [{
                model: StudentEnrollment,
                as: 'student_enrollment',
                attributes: ['enrollment_date'],
                where : {
                    status : 'active'
                },
                order: [['enrollment_date', 'DESC']],
                include: [{
                    model: GradeSection,
                    as: 'grade_section',
                    attributes: ['name'],
                    include: [{
                        model: Grade,
                        as: 'grade',
                        attributes: ['name'],
                        where: {
                            session_id: req.params.id
                        }
                    }]
                }]
            }],

        })
        res.status(200).send(students)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }

}

const deleteStudent = async (req, res) => {
    try {
        await Student.destroy({
            where: { id: req.params.id }
        })
        res.status(200).send({ 'message': 'Student Deleted' })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }

}

const getGradeWiseStudentCount = async (req, res) => {
    try {
        let student_enrollments = await Grade.findAll({
            where: {
                session_id: req.params.id
            },
            attributes: [
                'id',
                'name',
                // Use COALESCE or Sequelize fn to ensure `studentCount` is always 0 when no students are enrolled
                [sequelize.fn('COALESCE', sequelize.fn('COUNT', sequelize.col('grade_section.student_enrollment.id')), 0), 'studentCount'],
                [sequelize.fn('COALESCE', sequelize.fn('MAX', sequelize.col('grade_fee.fee')), 0), 'fee']
            ],
            include: [
                {
                    model: GradeSection,
                    as: 'grade_section',
                    required: false,  // Ensures we include all grade sections, even with no students
                    include: [
                        {
                            model: StudentEnrollment,
                            as: 'student_enrollment',
                            where: {
                                status: 'active'
                            },
                            attributes: [] // We only care about the count, no need to pull other data
                        }
                    ],
                    attributes: [] // We only care about the count, no need to pull other data

                },
                {
                    model: GradeFees,
                    as: 'grade_fee',
                    attributes: [] // Only include the fee attribute from the GradeFee table
                }
            ],
            group: ['Grade.id'], // Group by grade ID to get the count per grade
            raw: true,
        });

        res.status(200).send(student_enrollments)

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }
}

const getAllStudentsbySession = async (req, res) => {
    try {
        const students = await Student.findAll({
            include: [{
                model: StudentEnrollment,
                as: 'student_enrollment',
                required: true,
                where: {
                    status: 'active'
                },
                include: [{
                    model: GradeSection,
                    as: 'grade_section',
                    required: true,
                    attributes: ['name'],
                    include: [{
                        model: Grade,
                        as: 'grade',
                        required: true,
                        where: {
                            session_id: req.params.id
                        },
                        attributes: ['name']
                    }]
                }]
            }]
        })
        res.status(200).send(students)

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }
}

const getAllGradeStudents = async (req, res) => {
    try {
        const students = await Student.findAll({
            include: [{
                model: StudentEnrollment,
                as: 'student_enrollment',
                required: true,
                where: {
                    status: 'active'
                },
                include: [{
                    model: GradeSection,
                    as: 'grade_section',
                    required: true,
                    attributes: ['name'],
                    include: [{
                        model: Grade,
                        as: 'grade',
                        required: true,
                        where: {
                            id: req.params.id
                        },
                        attributes: ['name']
                    }]
                }]
            }]
        })
        res.status(200).send(students)

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }
}

const searchStudentByGrade = async (req, res) => {
    try {
        let students = await Student.findAll({
            where: {
                [Op.or]: [
                    { first_name: { [Op.like]: `%${req.query.name}%` } },
                    { last_name: { [Op.like]: `%${req.query.name}%` } },
                ],
            },
            include: [{
                model: StudentEnrollment,
                as: 'student_enrollment',
                required: true,
                attributes: ['enrollment_date'],
                where : {
                    status : 'active'
                },
                order: [['enrollment_date', 'DESC']],
                include: [{
                    model: GradeSection,
                    as: 'grade_section',
                    required: true,
                    attributes: ['name'],
                    include: [{
                        model: Grade,
                        as: 'grade',
                        required: true,
                        attributes: ['name'],
                        where: {
                            id: req.params.id
                        }
                    }]
                }]
            }],

        })
        res.status(200).send(students)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }
}

const searchStudentBySection = async (req, res) => {
    try {
        let students = await Student.findAll({
            where: {
                [Op.or]: [
                    { first_name: { [Op.like]: `%${req.query.name}%` } },
                    { last_name: { [Op.like]: `%${req.query.name}%` } },
                ],
            },
            include: [{
                model: StudentEnrollment,
                as: 'student_enrollment',
                required: true,
                where : {
                    status : 'active'
                },
                attributes: ['enrollment_date'],
                order: [['enrollment_date', 'DESC']],
                include: [{
                    model: GradeSection,
                    as: 'grade_section',
                    required: true,
                    attributes: ['name'],
                    where: {
                        id: req.params.id
                    }
                }]
            }],

        })
        res.status(200).send(students)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }

}

const getStudentGrade = async (req, res) => {
    try {
        const student_enrollment = await StudentEnrollment.findOne({
            where: {
                student_id: req.params.id,
                status: 'active'
            },
            attributes: [],
            include: [{
                model: GradeSection,
                as: 'grade_section',
                attributes: ['name'],
                include: [{
                    model: Grade,
                    as: 'grade',
                    attributes: ['name']
                }]
            }]
        })
        res.status(200).send(student_enrollment)

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }
}

const getAllPastStudentsbySession = async (req, res) => {
    try {

        const students = await Student.findAll({
            include: [{
                model: StudentEnrollment,
                as: 'student_enrollment',
                required: true,
                where: {
                    status: {
                        [Op.or]: ['dropped', 'completed']  // Check for 'dropped' or 'completed' status
                      }
                },
            }]
        })
        console.log(students)
        res.status(200).send(students)

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }
}

const searchPastStudent = async (req, res) => {
    try {
        let students = await Student.findAll({
            where: {
                [Op.or]: [
                    { first_name: { [Op.like]: `%${req.query.name}%` } },
                    { last_name: { [Op.like]: `%${req.query.name}%` } },
                ],
            },
            include: [{
                model: StudentEnrollment,
                as: 'student_enrollment',
                attributes: ['enrollment_date'],
                where : {
                    status: {
                        [Op.or]: ['dropped', 'completed']  // Check for 'dropped' or 'completed' status
                      }
                },
                order: [['enrollment_date', 'DESC']],
            }],

        })
        res.status(200).send(students)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }

}

const getSummary = async (req, res) => {
    try {
        // Query the StudentEnrollment model to count active students
        const activeStudentsCount = await StudentEnrollment.findAll({
            attributes: [
                [Sequelize.fn('COUNT', Sequelize.col('student_enrollment.id')), 'activeStudentCount']
            ],
            where: {
                status: 'active' // Only count active students
            },
            include: [{
                model: GradeSection,
                as: 'grade_section',
                attributes:[],
                required: true, // Ensures inner join
                include: [{
                    model: Grade,
                    as: 'grade',
                    attributes:[],
                    where: {
                        session_id: req.params.id // Filter by session ID
                    }
                }]
            }],
            raw: true
        });
        

        const activeEmployee = await JobDetail.count({
            where :{
                date_of_exit:null,
                session_id:req.params.id
            }
        })

        res.status(200).send({
            activeStudentsCount,
            activeEmployee
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message:error.message });
    }
};
module.exports = {
    addStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
    studentExit,
    studentPromoted,
    getStudentAllEnrollments,
    searchStudent,
    getGradeWiseStudentCount,
    getAllStudentsbySession,
    getAllGradeStudents,
    searchStudentByGrade,
    searchStudentBySection,
    getStudentGrade,
    getAllPastStudentsbySession,
    searchPastStudent,
    getSummary
}