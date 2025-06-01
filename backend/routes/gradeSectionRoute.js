const gradeSectionController = require('../controllers/gradeSectionController')

const router = require('express').Router()

router.post('/addGradeSection',gradeSectionController.addGradeSection)
router.get('/:id',gradeSectionController.getGradeSectionById)
router.get('/grade/allGradeSection/:g_id',gradeSectionController.getAllGradeSections)
router.put('/:id',gradeSectionController.updateGradeSection)
router.delete('/:id',gradeSectionController.deleteGradeSection)

module.exports = router