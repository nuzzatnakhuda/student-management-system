const examFeeController = require('../controllers/examFeeController')

const router = require('express').Router()

router.post('/addExamFee',examFeeController.generateExamFee)
router.get('/getExamFeePending/:id',examFeeController.getTotalAmtPendingExamFees)
router.get('/getExamFeePendingGradeWise/:id/:name',examFeeController.getExamSummary)
router.get('/pending-exam-fees/:exam_name/:grade_id', examFeeController.getStudentsWithPendingFees);
router.get('/paid-exam-fees/:exam_name/:grade_id', examFeeController.getStudentsWithPaidFees);
router.put('/payFees',examFeeController.payExamFee)
router.get('/getStudentFee/:id',examFeeController.getStudentFeeDetails)



module.exports = router