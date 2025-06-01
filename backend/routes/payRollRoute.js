const payRollController = require('../controllers/payRollController')

const router = require('express').Router()

router.post('/generateSalary/:id',payRollController.generateEmployeeSalary)
router.post('/paySalary/:id',payRollController.paySalary)
router.get('/pendingSalary/:id',payRollController.getPendingSalary)
router.get('/pendingSalaryEmployees/:id',payRollController.getPendingSalaryEmployees)
router.get('/monthlyPendingSalary/:id',payRollController.getMonthlyPendingSalary)
router.get('/monthlyPendingSalaryById/:id',payRollController.getPendingSalaryEmployeesByMonth)
router.get('/monthlyPaidSalaryById/:id',payRollController.getPaidSalaryEmployeesByMonth)
router.get('/employeePayRoll/:id',payRollController.getEmployeePayRollDetails)
router.get('/employeeProvident/:id',payRollController.getEmployeeProvidentDetails)

module.exports = router