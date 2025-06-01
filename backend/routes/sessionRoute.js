const sessionController = require('../controllers/sessionController')

const router = require('express').Router()

router.post('/addSession',sessionController.addSession)
router.get('/allSessions',sessionController.getAllSessions)
router.get('/:id',sessionController.getSessionById)
router.put('/:id',sessionController.updateSession)
router.delete('/:id',sessionController.deleteSession)

module.exports = router
