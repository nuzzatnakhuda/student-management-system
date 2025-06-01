const designationController = require('../controllers/designationController')

const router = require('express').Router()

router.post('/addDesignation',designationController.addDesignation)
router.get('/allDesignations',designationController.getAllDesignations)
router.get('/:id',designationController.getDesignationById)
router.put('/:id',designationController.updateDesignation)
router.delete('/:id',designationController.deleteDesignation)

module.exports = router