var ApiResponse = require('api-response').ApiResponse
var WidgetsRUsModel = require('@widgets-r-us/model')
var WidgetValidator = WidgetsRUsModel.WidgetValidator
var Widget = WidgetsRUsModel.Widget
var WidgetAttribute = WidgetsRUsModel.WidgetAttribute
var WidgetWidgetAttribute = WidgetsRUsModel.WidgetWidgetAttribute
var WidgetCategory = WidgetsRUsModel.WidgetCategory
var WidgetCategoryOption = WidgetsRUsModel.WidgetCategoryOption
var WidgetWidgetCategoryOption = WidgetsRUsModel.WidgetWidgetCategoryOption

let createWidget = async function(widget, isMerchandise, attributes, categoryOptions) {
  let validation = WidgetValidator.validate(widget, attributes, categoryOptions)
  if (validation !== 'pass')
    return new ApiResponse(400, validation)
  // create widget entry
  // if we check 'is merchandise' then we should also create a product entry with this function
}
let searchWidgets = async function(widget, isMerchandise, attributes, categoryOptions) {
  // search by a name, attribute, category (key) and a value?
}
let updateWidget = async function(widget, isMerchandise, attributes, categoryOptions) {
}
let deleteWidget = async function(widgetId) {
  // find and remove widget by ID
  // find the product with merchandiseId = widgetId and remove
}
let associateWidgetAttributeWithWidget = async function(widgetId, attributeId) {
  // add entry to junction table WidgetXWidgetAttribute
}
let dissociateWidgetAttributeWithWidget = async function(widgetId, attributeId) {
  // remove entry to junction table WidgetXWidgetAttribute
}
let associateWidgetCategoryOptionWithWidget = async function(widgetId, widgetCategoryOptionId) {
  // verify widgetId exists
  // verify widgetCategoryOptionId exists
  // add entry to junction table WidgetXWidgetCategoryOption
}
let dissociateWidgetCategoryOptionWithWidget = async function(widgetId, widgetCategoryOptionId) {
  // verify widgetId exists
  // verify widgetCategoryOptionId exists
  // remove entry to junction table WidgetXWidgetCategoryOption
}
/**
 * @param widgetCategory: WidgetCategory
 * @returns {Promise.<void>}
 */
let createWidgetCategory = async function() {

}
/**
 * @param widgetCategoryId: number | widgetCategoryName: string
 * @returns {Promise.<void>}
 */
let deleteWidgetCategory = async function() {
}
/**
 *
 * @returns {Promise.<void>}
 */
let createWidgetCategoryOption = async function() {
}
/**
 *
 * @returns {Promise.<void>}
 */
let deleteWidgetCategoryOption = async function() {
}
let createWidgetAttribute = async function() {
}
let deleteWidgetAttribute = async function() {
}

exports.createWidget = createWidget
exports.searchWidgets = searchWidgets
exports.updateWidget = updateWidget
exports.deleteWidget = deleteWidget
exports.associateWidgetAttributeWithWidget = associateWidgetAttributeWithWidget
exports.dissociateWidgetAttributeWithWidget = dissociateWidgetAttributeWithWidget
exports.associateWidgetCategoryOptionWithWidget = associateWidgetCategoryOptionWithWidget
exports.dissociateWidgetCategoryOptionWithWidget = dissociateWidgetCategoryOptionWithWidget
exports.createWidgetCategory = createWidgetCategory
exports.deleteWidgetCategory = deleteWidgetCategory
exports.createWidgetCategoryOption = createWidgetCategoryOption
exports.deleteWidgetCategoryOption = deleteWidgetCategoryOption
exports.createWidgetAttribute = createWidgetAttribute
exports.deleteWidgetAttribute = deleteWidgetAttribute
