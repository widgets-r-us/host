var express = require('express')
var router = express.Router()
var WidgetService = require('../../services/widgets.service')

router.post('/createWidget', async function(req, res, next) {
  let widget = req.body.widget
  let isMerchandise = req.body.isMerchandise
  let attributes = req.body.attributes
  let categoryOptions = req.body.categoryOptions
  let apiResponse = await WidgetService.createWidget(widget,
      isMerchandise, attributes, categoryOptions)
  return res.status(apiResponse.status).json(apiResponse)
})

router.get('/getWidget', async function(req, res, next) {
  let widgetId = req.query.widgetId
  let apiResponse = await WidgetService.getWidget(widgetId)
  return res.status(apiResponse.status).json(apiResponse)
})

router.get('/searchWidgets', async function(req, res, next) {
  let widget = req.body.widget
  let isMerchandise = req.body.isMerchandise
  let attributes = req.body.attributes
  let categoryOptions = req.body.categoryOptions
  let apiResponse = await WidgetService.searchWidgets(widget,
      isMerchandise, attributes, categoryOptions)
  return res.status(apiResponse.status).json(apiResponse)
})

router.post('/updateWidget', async function(req, res, next) {
  let widget = req.body.widget
  let isMerchandise = req.body.isMerchandise
  let attributes = req.body.attributes
  let categoryOptions = req.body.categoryOptions
  let apiResponse = await WidgetService.updateWidget(widget,
      isMerchandise, attributes, categoryOptions)
  return res.status(apiResponse.status).json(apiResponse)
})

router.delete('/deleteWidget', async function(req, res, next) {
  let widgetId = req.body.widgetId
  let apiResponse = await WidgetService.deleteWidget(widgetId)
  return res.status(apiResponse.status).json(apiResponse)
})

router.post('/associateWidgetAttributeWithWidget', async function(req, res, next) {
  let widgetId = req.body.widgetId
  let attributeId = req.body.attributeId
  let apiResponse = await
      WidgetService.associateWidgetAttributeWithWidget(widgetId, attributeId)
  return res.status(apiResponse.status).json(apiResponse)
})

router.post('/dissociateWidgetAttributeWithWidget', async function(req, res, next) {
  let widgetId = req.body.widgetId
  let attributeId = req.body.attributeId
  let apiResponse = await
      WidgetService.dissociateWidgetAttributeWithWidget(widgetId, attributeId)
  return res.status(apiResponse.status).json(apiResponse)
})

router.post('/associateWidgetCategoryOptionWithWidget', async function(req, res, next) {
  let widgetId = req.body.widgetId
  let widgetCategoryOptionId = req.body.widgetCategoryOptionId
  let apiResponse = await
      WidgetService.associateWidgetCategoryOptionWithWidget(widgetId, widgetCategoryOptionId)
  return res.status(apiResponse.status).json(apiResponse)
})

router.post('/dissociateWidgetCategoryOptionWithWidget', async function(req, res, next) {
  let widgetId = req.body.widgetId
  let widgetCategoryOptionId = req.body.widgetCategoryOptionId
  let apiResponse = await
      WidgetService.dissociateWidgetCategoryOptionWithWidget(widgetId, widgetCategoryOptionId)
  return res.status(apiResponse.status).json(apiResponse)
})

router.post('/createWidgetCategory', async function(req, res, next) {
  let widgetCategory = req.body.widgetCategory
  let apiResponse = await WidgetService.createWidgetCategory(widgetCategory)
  return res.status(apiResponse.status).json(apiResponse)
})

router.get('/getWidgetCategoriesAndOptions', async function(req, res, next) {
  let apiResponse = await WidgetService.getWidgetCategoriesAndOptions()
  return res.status(apiResponse.status).json(apiResponse)
})

router.delete('/deleteWidgetCategory', async function(req, res, next) {
  let widgetCategoryId = req.body.widgetCategoryId
  let apiResponse = await WidgetService.deleteWidgetCategory(widgetCategoryId)
  return res.status(apiResponse.status).json(apiResponse)
})

router.post('/createWidgetCategoryOption', async function(req, res, next) {
  let widgetCategoryOption = req.body.widgetCategoryOption
  let apiResponse = await WidgetService.createWidgetCategoryOption(widgetCategoryOption)
  return res.status(apiResponse.status).json(apiResponse)
})

router.delete('/deleteWidgetCategoryOption', async function(req, res, next) {
  let widgetCategoryOptionId = req.body.widgetCategoryOptionId
  let apiResponse = await WidgetService.deleteWidgetCategoryOption(widgetCategoryOptionId)
  return res.status(apiResponse.status).json(apiResponse)
})

router.post('/createWidgetAttribute', async function(req, res, next) {
  let widgetAttribute = req.body.widgetAttribute
  let apiResponse = await WidgetService.createWidgetCategoryOption(widgetAttribute)
  return res.status(apiResponse.status).json(apiResponse)
})

router.delete('/deleteWidgetAttribute', async function(req, res, next) {
  let widgetAttributeId = req.body.widgetAttributeId
  let apiResponse = await WidgetService.deleteWidgetCategoryOption(widgetAttributeId)
  return res.status(apiResponse.status).json(apiResponse)
})

module.exports = router
