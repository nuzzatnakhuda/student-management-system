const semesterFeeController = require('../controllers/semesterFeeController');

const router = require('express').Router();

router.post('/addSemesterFee', semesterFeeController.generateSemesterFee);
router.get('/getSemesterFeePending/:id', semesterFeeController.getTotalAmtPendingSemesterFees);
router.get('/getSemesterFeePendingGradeWise/:id/:semester', semesterFeeController.getSemesterSummary);
router.get('/pending-semester-fees/:semester/:grade_id', semesterFeeController.getStudentsWithPendingSemesterFees);
router.get('/paid-semester-fees/:semester/:grade_id', semesterFeeController.getStudentsWithPaidSemesterFees);
router.put('/paySemesterFees', semesterFeeController.paySemesterFee);
router.get('/getStudentFee/:id', semesterFeeController.getStudentFeeDetails);
router.get('', semesterFeeController.getAllSemester);

module.exports = router;
