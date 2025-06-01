const studentController = require('../controllers/studentController')

const router = require('express').Router()

router.post('/addStudent',studentController.addStudent)
router.post('/promoteStudent/:id',studentController.studentPromoted)
router.put('/:id',studentController.updateStudent)
router.put('/studentExit/:id',studentController.studentExit)
router.get('/:id',studentController.getStudentById)
router.get('/allStudents/:id',studentController.getAllStudents)
router.get('/allEnrollments/:id',studentController.getStudentAllEnrollments)
router.get('/search/:id/student',studentController.searchStudent)
router.get('/gradeCount/:id',studentController.getGradeWiseStudentCount)
router.get('/sessionStudents/:id',studentController.getAllStudentsbySession)
router.get('/gradeStudents/:id',studentController.getAllGradeStudents)
router.get('/search/gradeStudents/:id',studentController.searchStudentByGrade)
router.get('/search/sectionStudents/:id',studentController.searchStudentBySection)
router.get('/studentGrade/:id',studentController.getStudentGrade)
router.get('/past/Students',studentController.getAllPastStudentsbySession)
router.get('/search/Past',studentController.searchPastStudent)
router.get('/summary/School/:id',studentController.getSummary)


router.delete('/:id',studentController.deleteStudent)

module.exports = router