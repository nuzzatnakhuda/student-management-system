const employeeController = require('../controllers/employeeController')

const router = require('express').Router()

router.get('/allEmployees',employeeController.getAllEmployees)
router.get('/:session_id/allEmployeeProvident',employeeController.getAllActiveEmployeeProvident)
router.get('/designation',employeeController.getEmployeeByDesignation)
router.get('/session',employeeController.getEmployeeBySession)
router.get('/session/designation',employeeController.getEmployeeBySessionAndDesignation)
router.get('/salary/:id',employeeController.getAllEmployeeSalary)
router.get('/:session_id/search',employeeController.searchEmployee)
router.get('/:id',employeeController.getEmployeeById)
router.get('/employeeCount/:id',employeeController.getEmployeeCountDesignation)
router.get('/employeeProvident/:id',employeeController.getEmployeeProvident)
router.post('/addEmployee',employeeController.addEmployee)
router.put('/exit/:id',employeeController.employeeExit)
router.put('/:id',employeeController.updateEmployee)
router.delete('/:id',employeeController.deleteEmployee) 
router.get('/past/Employees',employeeController.getPastEmployeeBySession)
router.get('/search/Past',employeeController.searchPastEmployee)
router.post("/login", employeeController.login);
router.get("/jobdetail/:id", employeeController.getEmployeeJobDetails);

module.exports = router