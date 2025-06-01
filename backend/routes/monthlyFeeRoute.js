const monthlyFeeController = require('../controllers/monthlyFeeController')

const router = require('express').Router()

router.post('/addMonthlyFee',monthlyFeeController.generateMonthlyFee)
router.post('/payMonthlyFee',monthlyFeeController.payFee)
router.get('/pendingFees/:id',monthlyFeeController.getStudentPendingFees)
router.get('/paidFees/paidInDate',monthlyFeeController.getFeesPaidInDateRange)
router.get('/allPendingFees',monthlyFeeController.getAllPendingFees)
router.get('/sectionMonthlyFees/:id',monthlyFeeController.getSectionMonthlyFee)
router.get('/totalPending/:id',monthlyFeeController.getTotalAmtPending)
router.get('/totalPendingMonthly/:id',monthlyFeeController.getTotalAmtPendingForMonth)
router.get('/totalPendingAllMonth/:id',monthlyFeeController.getTotalAmtPendingForAllMonths)
router.get('/gradeTotalPending/:id',monthlyFeeController.getGradewiseMonthlyFee)
router.get('/gradeMonthlyTotalPending/:id',monthlyFeeController.getMonthlyDetailByGradeId)
router.get('/gradeAllTotalPending/:id',monthlyFeeController.getFeeDataOfAllMonthsByGradeID)
router.get('/gradeMonthlyStudents/:id',monthlyFeeController.getMonthlyPendingFeesByGrade)
router.get('/gradeMonthlyPaidStudents/:id',monthlyFeeController.getMonthlyPaidFeesByGrade)
router.get('/studentFee/:id',monthlyFeeController.getStudentFeeDetails)
router.get('/monthlyFeePending/:month',monthlyFeeController.getMonthWisePendingStudents)
router.get('/monthlyFeePendingCount/:id',monthlyFeeController.getStudentPendingFeeCount)

module.exports = router