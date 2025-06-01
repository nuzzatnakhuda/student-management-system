const db = require('../models')

const Grade = db.grades
const GradeFees = db.grade_fees
const GradeSection = db.grade_sections
const Session = db.sessions

const addGrade = async (req, res) => {
    try {
        const grade = await Grade.create({
            session_id: req.body.session_id,
            name: req.body.name,
            isActive: true
        })
        const grade_fees = await GradeFees.create({
            grade_id: grade.id,
            fee: req.body.fee,
            description: req.body.description,
            isActive: true
        })
        const grade_section = await GradeSection.create({
            grade_id: grade.id,
            name: 'A',
            isActive: true
        })
        res.status(200).send(grade)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Something went wrong' })
    }

}

const getAllGrades = async (req, res) => {
    try {
        let grades = await Grade.findAll({
            where: {
                session_id: req.params.id,
                isActive: true
            },
            attributes : ['id','name']
        })
        res.status(200).send(grades)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Something went wrong' })
    }

}

const getGradeById = async (req, res) => {
    try {
        let grade = await Grade.findOne({
            where: {
                id: req.params.id,
                isActive: true
            },
            include: [{
                model: GradeSection,
                as: 'grade_section',
                where : {isActive : true}
            }, {
                model: GradeFees,
                as: 'grade_fee'
            }, {
                model: Session,
                as: 'session'
            }]
        })
        res.status(200).send(grade)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Something went wrong' })
    }

}

const updateGrade = async (req, res) => {
    try {
        let grade = await Grade.update(req.body, {
            where: { id: req.params.id }
        })
        const grade_fees = await GradeFees.update({
            fee: req.body.fee,
            description: req.body.description,
        }, { where: { grade_id: req.params.id } })
        res.status(200).send(grade)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Something went wrong' })
    }

}

const deleteGrade = async (req, res) => {
    try {
        let grade_section = await GradeSection.findAll({
            where: {
                grade_id: req.params.id,
                isActive: true
            }
        })
        if (grade_section.length != 0)
            res.status(500).send({ message: 'There are sections in this grade. It Cannot be deleted' })
        else {
            let grade = await Grade.update({
                isActive: false
            }, {
                where: { id: req.params.id }
            })
            const grade_fees = await GradeFees.update({
                isActive: false,
            }, { where: { grade_id: req.params.id } })
            res.status(200).send(grade)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Something went wrong' })
    }

}

const getAllGradeFees = async (req, res) => {
    try {
        let grades = await Grade.findAll({
            where: {
                session_id: req.params.id,
                isActive: true
            },
            include: [{
                model: GradeFees,
                as: 'grade_fee'
            }]
        })
        res.status(200).send(grades)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Something went wrong' })
    }

}

const getGradeFee = async(req,res)=>{
    try {
        let gradeFee = await GradeFees.findOne({
            where : {
                grade_id : req.params.id
            }
        })
        res.status(200).send({fee : gradeFee.fee})   
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })   
    }
}

module.exports = {
    addGrade,
    getAllGrades,
    getGradeById,
    updateGrade,
    deleteGrade,
    getAllGradeFees,
    getGradeFee
}