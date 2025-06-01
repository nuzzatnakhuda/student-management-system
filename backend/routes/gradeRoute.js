const gradeController = require('../controllers/gradeController')

const router = require('express').Router()

router.post('/addGrade',gradeController.addGrade)
router.get('/allGrades/:id',gradeController.getAllGrades)
router.get('/allGradeFees/:id',gradeController.getAllGradeFees)
router.get('/gradeFees/:id',gradeController.getGradeFee)
router.get('/:id',gradeController.getGradeById)
router.put('/:id',gradeController.updateGrade)
router.delete('/:id',gradeController.deleteGrade)

module.exports = router