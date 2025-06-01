const fundTypeController = require('../controllers/fundTypeController')
const schoolFundController = require('../controllers/schoolFundController')

const router = require('express').Router()

router.post('/addFundType',fundTypeController.addFundType)
router.get('/allFundTypes',fundTypeController.getAllFundTypes)
router.get('/allFundTransaction/:id',fundTypeController.getAllFundTransaction)
router.post('/makeExpense/:id',fundTypeController.makeExpense)
router.get('/:id',fundTypeController.getFundTypeById)
router.put('/:id',fundTypeController.updateFundType)

//School Fund
router.post('/addSchoolFund',schoolFundController.addSchoolFund)
router.get('/school/schoolFund',schoolFundController.getSchoolFund)
//School Fund Transaction
router.get('/school/getAllTransaction',schoolFundController.getAllSchoolFundTransaction)
router.get('/school/getTransaction',schoolFundController.getSchoolFundTransactionByDateRange)
router.get('/school/getMonthlyIncExp',schoolFundController.getMonthlyIncomeExpenses)
router.get('/school/getReport',schoolFundController.getGroupedTransaction)
router.post('/school/makeExpense',schoolFundController.makeExpense)
router.post('/school/getIncome',schoolFundController.getIncome)


module.exports = router