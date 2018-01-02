var ApiResponse = require('./api-response').ApiResponse
var BaseDao = require('../daos/base.dao')
var BaseService = require('./base.service')
var OrderService = require('./orders.service')
var WidgetsRUsModel = require('@widgets-r-us/model')
var WidgetsRUsError = WidgetsRUsModel.WidgetsRUsError
var Widget = WidgetsRUsModel.Widget
var Product = WidgetsRUsModel.Product
var OrderXProduct = WidgetsRUsModel.OrderXProduct
var WidgetAttribute = WidgetsRUsModel.WidgetAttribute
var WidgetXWidgetAttribute = WidgetsRUsModel.WidgetXWidgetAttribute
var WidgetCategory = WidgetsRUsModel.WidgetCategory
var WidgetCategoryOption = WidgetsRUsModel.WidgetCategoryOption
var WidgetXWidgetCategoryOption = WidgetsRUsModel.WidgetXWidgetCategoryOption

var WidgetValidator = WidgetsRUsModel.Validators.WidgetValidator
var WidgetAttributeValidator = WidgetsRUsModel.Validators.WidgetAttributeValidator
var WidgetCategoryValidator = WidgetsRUsModel.Validators.WidgetCategoryValidator
var WidgetCategoryOptionValidator = WidgetsRUsModel.Validators.WidgetCategoryOptionValidator
var WidgetXWidgetAttributeValidator = WidgetsRUsModel.Validators.WidgetXWidgetAttributeValidator
var WidgetXWidgetCategoryOptionValidator = WidgetsRUsModel.Validators.WidgetXWidgetCategoryOptionValidator


let createWidget = async function(widget, isMerchandise, product, attributes, categoryOptions) {
  // we have to make the widget first and then we save the product and tie with product's merchandise id to this
  // widget's id
  let validation = WidgetValidator.validate(widget)
  if (validation !== 'pass')
    return new ApiResponse(400, validation)
  for (const attribute of attributes) {
    validation = WidgetAttributeValidator.validate(attribute)
    if (validation !== 'pass')
      return new ApiResponse(400, validation)
  }
  for (const categoryOption of categoryOptions) {
    validation = WidgetCategoryOption.validate(categoryOption)
    if (validation !== 'pass')
      return new ApiResponse(400, validation)
  }
  // if we check 'is merchandise' then we should also create a product entry with this function
  if (isMerchandise) {
    validation = ProductValidator.validate(product)
    if (validation !== 'pass')
      return new ApiResponse(400, validation)
  }
  // Now that we've validated all the input, we need to ensure the attributes and categoryOptions exist
  // TODO(ajmed): Check existence of attributes and categoryOptions, return error if they don't


  // Now we need to start saving the widget and the ties between the widget and its attributes/categoryOptions
  // implement two-phase commit
  let savedWidget = await widget.save()
  for (const attribute of attributes) {
    let widgetXWidgetAttribute = new WidgetXWidgetAttribute({widgetId: savedWidget._id,
      widgetAttributeId: attribute._id})
    await widgetXWidgetAttribute.save()
  }
  for (const categoryOption of categoryOptions) {
    let widgetXWidgetCategoryOption = new WidgetXWidgetCategoryOption({widgetId: savedWidget._id,
      widgetCategoryOptionId: categoryOption._id})
    await widgetXWidgetCategoryOption.save()
  }

  if (isMerchandise) {
    product.merchandiseId = savedWidget._id
    await product.save()
  }
  return new ApiResponse(200, savedWidget)
}

let getWidget = async function(widgetId) {
  let widget = await Widget.find({_id: widgetId})
  widget['attributes'] = await WidgetXWidgetAttribute.find({widgetId: widgetId})
  for (const widgetXWidgetAttribute of widget['attributes']) {
    widgetXWidgetAttribute['widgetAttribute'] = await WidgetAttribute.find({_id: widgetXWidgetAttribute.widgetAttributeId})
  }
  widget['categories'] = await WidgetXWidgetCategoryOption.find({widgetId: widgetId})
  for (const widgetXWidgetCategoryOption of widget['categories']) {
    widgetXWidgetCategoryOption['widgetCategoryOption'] = await WidgetCategoryOption.find({_id: widgetXWidgetCategoryOption.widgetCategoryOptionId})
    let child = widgetXWidgetCategoryOption['widgetCategoryOption']
    while (child.parentId) {
      let parentWidgetCategory = await WidgetCategory.find({_id: child.parentId})
      parentWidgetCategory['child'] = child
      widgetXWidgetCategoryOption['widgetCategoryOption'] = parentWidgetCategory
      child = parentWidgetCategory
    }
  }
  return new ApiResponse(200, {widget: widget})
}

let searchWidgets = async function(widget, isMerchandise, attributes, categoryOptions) {
  // search by a name, attribute, category (key) and a value?
}

let updateWidget = async function(widget, isMerchandise, attributes, categoryOptions) {

}

let deleteWidget = async function(widgetId) {
  return await BaseService.baseDeleteById(Widget, widgetId, WidgetValidator)
}


let createWidgetAttribute = async function(widgetAttribute) {
  return await BaseService.baseCreate(widgetAttribute, WidgetAttributeValidator)
}

let getWidgetAttributes = async function() {
  return new ApiResponse(200, {attributes: await WidgetAttribute.find()})
}

let deleteWidgetAttribute = async function(widgetAttributeId) {
  return await BaseService.baseDeleteById(WidgetAttribute, widgetAttributeId, WidgetAttributeValidator)
}

/**
 * @param widgetCategory: WidgetCategory
 * @returns {Promise.<void>}
 */
let createWidgetCategory = async function(widgetCategory) {
  return await BaseService.baseCreate(widgetCategory, WidgetCategoryValidator)
}

/**
 * @param widgetCategoryId: number | widgetCategoryName: string
 * @returns {Promise.<void>}
 */
let deleteWidgetCategory = async function(widgetCategoryId) {
  return await BaseService.baseDeleteById(WidgetCategory, widgetCategoryId, WidgetCategoryValidator)
}

/**
 * @returns {Promise.<void>}
 */
let createWidgetCategoryOption = async function(widgetCategoryOption) {
  return await BaseService.baseCreate(widgetCategoryOption, WidgetCategoryOptionValidator)
}

let recursiveBuildCategoryTree = async function(rootCategories, optionsIndex) {
  for (const category of rootCategories) {
    let widgetCategories = await WidgetCategory.find({parentId: category._id})
    category['children'] = widgetCategories
    await recursiveBuildCategoryTree(widgetCategories, optionsIndex)
    category['children'].concat(optionsIndex[category._id])
  }
}

let getWidgetCategoriesAndOptions = async function() {
  let rootWidgetCategories = await WidgetCategory.find({parentId: null})
  let widgetCategoryOptions = await WidgetCategoryOption.find()
  let tree = {root: rootWidgetCategories}
  let optionsIndex = {}
  for (const widgetCategoryOption of widgetCategoryOptions) {
    if (optionsIndex[widgetCategoryOption.parentId])
      optionsIndex[widgetCategoryOption.parentId].push(widgetCategoryOption)
    else
      optionsIndex[widgetCategoryOption.parentId] = [widgetCategoryOption]
  }
  await recursiveBuildCategoryTree(tree.root, optionsIndex)
  return new ApiResponse(200, {categoryTree: tree})
}

/**
 * @param widgetCategoryOptionId: number
 * @returns {Promise.<void>}
 */
let deleteWidgetCategoryOption = async function(widgetCategoryOptionId) {
  return await BaseService.baseDeleteById(WidgetCategoryOption, widgetCategoryOptionId, WidgetCategoryOptionValidator)
}

let associateWidgetAttributeWithWidget = async function(widgetId, attributeId) {
  // check existence of attribute via Id and widget via Id
  // add entry to junction table WidgetXWidgetAttribute
  let modelToCreate = new WidgetXWidgetAttribute({widgetId: widgetId, attributeId: attributeId})
  return await BaseService.baseCreate(modelToCreate, WidgetXWidgetAttributeValidator)
}

let dissociateWidgetAttributeWithWidget = async function(widgetId, attributeId) {
  // check existence of attribute via Id and widget via Id
  // remove entry to junction table WidgetXWidgetAttribute
  let whereClause = {widgetId: widgetId, attributeId: attributeId}
  return await BaseService.baseDeleteByWhereClause(WidgetXWidgetAttribute, whereClause,
      WidgetXWidgetAttributeValidator)
}

let associateWidgetCategoryOptionWithWidget = async function(widgetId, widgetCategoryOptionId) {
  // verify widgetId exists
  // verify widgetCategoryOptionId exists
  // add entry to junction table WidgetXWidgetCategoryOption
  let modelToCreate = new WidgetXWidgetCategoryOption({widgetId: widgetId,
    widgetCategoryOptionId: widgetCategoryOptionId})
  return await BaseService.baseCreate(modelToCreate, WidgetXWidgetCategoryOptionValidator)
}

let dissociateWidgetCategoryOptionWithWidget = async function(widgetId, widgetCategoryOptionId) {
  // verify widgetId exists
  // verify widgetCategoryOptionId exists
  let whereClause = {widgetId: widgetId, widgetCategoryOptionId: widgetCategoryOptionId}
  return await BaseService.baseDeleteByWhereClause(WidgetXWidgetCategoryOption, whereClause,
      WidgetXWidgetCategoryOptionValidator)
}

exports.createWidget = createWidget
exports.getWidget = getWidget
exports.searchWidgets = searchWidgets
exports.updateWidget = updateWidget
exports.deleteWidget = deleteWidget
exports.associateWidgetAttributeWithWidget = associateWidgetAttributeWithWidget
exports.dissociateWidgetAttributeWithWidget = dissociateWidgetAttributeWithWidget
exports.associateWidgetCategoryOptionWithWidget = associateWidgetCategoryOptionWithWidget
exports.dissociateWidgetCategoryOptionWithWidget = dissociateWidgetCategoryOptionWithWidget
exports.createWidgetCategory = createWidgetCategory
exports.getWidgetCategoriesAndOptions = getWidgetCategoriesAndOptions
exports.deleteWidgetCategory = deleteWidgetCategory
exports.createWidgetCategoryOption = createWidgetCategoryOption
exports.deleteWidgetCategoryOption = deleteWidgetCategoryOption
exports.createWidgetAttribute = createWidgetAttribute
exports.getWidgetAttributes = getWidgetAttributes
exports.deleteWidgetAttribute = deleteWidgetAttribute
