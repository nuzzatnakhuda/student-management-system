const db = require('../models')

const Grade = db.grades
const GradeFees = db.grade_fees
const GradeSection = db.grade_sections
const StudentEnrollment = db.student_enrollment
const Session = db.sessions
const Sequelize = db.Sequelize

const addGradeSection = async (req, res) => {
    try {
        const grade_section = await GradeSection.create({
            grade_id: req.body.grade_id,
            name: req.body.name,
            isActive: true
        })
        res.status(200).send(grade_section)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Something went wrong' })
    }

}

const getGradeSectionById = async (req, res) => {
    try {
        let grade_section = await GradeSection.findOne({
            where: {
                id: req.params.id,
                isActive: true
            },
            include: [{
                model: Grade,
                as: 'grade'
            }]
        })
        res.status(200).send(grade_section)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Something went wrong' })
    }

}

const updateGradeSection = async (req, res) => {
    try {
        const grade_section = await GradeSection.update({
            name : req.body.name
        },{
            where : {id : req.params.id}
        })
        res.status(200).send(grade_section)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Something went wrong' })
    }

}

const deleteGradeSection = async (req, res) => {
    try {
        let student_enrollments = await StudentEnrollment.findAll({
            where: {
                grade_section_id: req.params.id,
                status: 'active'
            }
        })
        console.log(student_enrollments.length)
        if (student_enrollments.length != 0)
            //res.status(500).send(student_enrollments)
            res.status(500).send({ message: 'There are sections in this grade. It Cannot be deleted' })
        else {
            let grade_section = await GradeSection.update({
                isActive: false
            }, {
                where: { id: req.params.id }
            })
            res.status(200).send(grade_section)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Something went wrong' })
    }

}

const getAllGradeSections = async (req, res) => {
    try {
        let grade_sections = await GradeSection.findAll({
            where: {
                isActive: true,
                grade_id: req.params.g_id
            },
            include: [
                {
                    model: Grade,
                    as: 'grade',
                    attributes: ['name'],
                },
                {
                    model: StudentEnrollment,
                    as: 'student_enrollment',
                    attributes: [], // We only want the count, so no additional attributes from StudentEnrollment
                    where: {
                        status: 'active'
                    },
                    required: false // Ensure a LEFT JOIN (allows for sections with no students)
                }
            ],
            attributes: [
                'id',
                'name',
                // Use Sequelize.fn to count the student enrollment and handle no students
                [Sequelize.fn('IFNULL', Sequelize.fn('COUNT', Sequelize.col('student_enrollment.id')), 0), 'student_count']
            ],
            group: ['grade_section.id'], // Group by GradeSection to aggregate the counts
            order: [['name', 'ASC']] // Optional: Order the sections alphabetically
        });
        
        
        res.status(200).send(grade_sections);
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Something went wrong' })
    }

}

module.exports = {
    addGradeSection,
    getGradeSectionById,
    updateGradeSection,
    deleteGradeSection,
    getAllGradeSections
}