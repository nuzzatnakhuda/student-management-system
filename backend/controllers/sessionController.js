const db = require('../models')

const Session = db.sessions

const addSession = async (req, res) => {

    const session = await Session.create({
        session: req.body.session
    })

    res.status(200).send(session)
}

const getAllSessions = async (req, res) => {
    let sessions = await Session.findAll({})
    res.status(200).send(sessions)
}

const getSessionById = async (req, res) => {
    let session = await Session.findOne({
        where: { id: req.params.id }
    })
    res.status(200).send(session)
}

const updateSession = async (req, res) => {
    let session = await Session.update(req.body, {
        where: { id: req.params.id }
    })
    res.status(200).send(session)
} 

const deleteSession = async (req, res) => {
    await Session.destroy( {
        where: { id: req.params.id }
    })
    res.status(200).send({'message':'Session Deleted'})
} 

module.exports ={
    addSession,
    getAllSessions,
    getSessionById,
    updateSession,
    deleteSession
}