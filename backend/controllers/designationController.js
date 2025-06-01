const db = require('../models')

const Designation = db.designations

const addDesignation = async (req, res) => {
    try {
        const designation = await Designation.create({
            designation: req.body.designation
        })

        res.status(200).send(designation)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Something went wrong' })
    }

}

const getAllDesignations = async (req, res) => {
    try {
        let designations = await Designation.findAll({})
        res.status(200).send(designations)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Something went wrong' })
    }

}

const getDesignationById = async (req, res) => {
    try {
        let designation = await Designation.findOne({
            where: { id: req.params.id }
        })
        res.status(200).send(designation)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Something went wrong' })
    }

}

const updateDesignation = async (req, res) => {
    try {
        let designation = await Designation.update(req.body, {
            where: { id: req.params.id }
        })
        res.status(200).send(designation)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Something went wrong' })
    }

}

const deleteDesignation = async (req, res) => {
    try {
        await Designation.destroy({
            where: { id: req.params.id }
        })
        res.status(200).send({ 'message': 'Designation Deleted' })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Something went wrong' })
    }

}

module.exports = {
    addDesignation,
    getAllDesignations,
    getDesignationById,
    updateDesignation,
    deleteDesignation
}