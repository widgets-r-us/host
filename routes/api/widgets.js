var express = require('express')
var router = express.Router()
var WidgetsService = require('../../services/widgets.service')

router.post('/createWidget', WidgetsService.createWidget)
router.get('/searchWidgets', WidgetsService.searchWidgets)
router.post('/updateWidget', WidgetsService.updateWidget)
router.delete('/deleteWidget', WidgetsService.deleteWidget)
module.exports = router
