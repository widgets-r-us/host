var ApiResponse = require('api-response').ApiResponse
var WidgetsRUsModel = require('@widgets-r-us/model')
var WidgetValidator = WidgetsRUsModel.Validators.WidgetValidator
var Widget = WidgetsRUsModel.Widget
var Product = WidgetsRUsModel.Product
var WidgetAttribute = WidgetsRUsModel.WidgetAttribute
var WidgetWidgetAttribute = WidgetsRUsModel.WidgetXWidgetAttribute
var WidgetCategory = WidgetsRUsModel.WidgetCategory
var WidgetCategoryOption = WidgetsRUsModel.WidgetCategoryOption
var WidgetWidgetCategoryOption = WidgetsRUsModel.WidgetXWidgetCategoryOption

let createWidget = async function(widget, isMerchandise, attributes, categoryOptions) {
  let validation = WidgetValidator.validate(widget, attributes, categoryOptions)
  if (validation !== 'pass')
    return new ApiResponse(400, new validation)
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
  // check existence of attribute via Id and widget via Id
  // add entry to junction table WidgetXWidgetAttribute
}
let dissociateWidgetAttributeWithWidget = async function(widgetId, attributeId) {
  // check existence of attribute via Id and widget via Id
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
let createWidgetCategory = async function(widgetCategory) {

}
/**
 * @param widgetCategoryId: number | widgetCategoryName: string
 * @returns {Promise.<void>}
 */
let deleteWidgetCategory = async function(widgetCategoryId) {
}
/**
 * @returns {Promise.<void>}
 */
let createWidgetCategoryOption = async function(widgetCategoryOption) {

}
/**
 * @param widgetCategoryOptionId: number
 * @returns {Promise.<void>}
 */
let deleteWidgetCategoryOption = async function(widgetCategoryOptionId) {
  // if it's the last option in the category we should prolly delete the category as well?
}
let createWidgetAttribute = async function(widgetAttribute) {
}
let deleteWidgetAttribute = async function(widgetAttributeId) {
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
