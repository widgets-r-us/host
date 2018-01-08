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

var ProductValidator = WidgetsRUsModel.Validators.ProductValidator
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
    validation = WidgetCategoryOptionValidator.validate(categoryOption)
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
    await new WidgetXWidgetAttribute({widgetId: savedWidget._id, widgetAttributeId: attribute._id}).save()
  }
  for (const categoryOption of categoryOptions) {
    await new WidgetXWidgetCategoryOption({widgetId: savedWidget._id, widgetCategoryOptionId: categoryOption._id}).save()
  }

  if (isMerchandise) {
    product.merchandiseId = savedWidget._id
    await product.save()
  }
  return new ApiResponse(200, savedWidget)
}

let getWidget = async function(widgetId) {
  let widget = await Widget.find({_id: widgetId})
  widget.attributes = await WidgetXWidgetAttribute.find({widgetId: widgetId})
  for (const widgetXWidgetAttribute of widget['attributes']) {
    widgetXWidgetAttribute['widgetAttributeForm'] = await WidgetAttribute.find({_id: widgetXWidgetAttribute.widgetAttributeId})
  }
  widget.categories = await WidgetXWidgetCategoryOption.find({widgetId: widgetId})
  for (const widgetXWidgetCategoryOption of widget.categories) {
    widgetXWidgetCategoryOption.widgetCategoryOptionName = await WidgetCategoryOption.find({_id: widgetXWidgetCategoryOption.widgetCategoryOptionId})
    let child = widgetXWidgetCategoryOption.widgetCategoryOptionName
    while (child.widgetCategoryName !== 'reservedRootWidgetCategory') {
      let parentWidgetCategory = await WidgetCategory.find({_id: child.parentId})
      parentWidgetCategory.child = child
      child = parentWidgetCategory
    }
  }
  return new ApiResponse(200, {widget: widget})
}

let searchWidgets = async function(widget, isMerchandise, attributes, categoryOptions) {
  // search by a widgetName, widgetAttributeForm, category (key) and a value?
}

let updateWidget = async function(widget, isMerchandise, attributes, categoryOptions) {

}

let deleteWidget = async function(widgetId) {
  return await BaseService.baseDeleteById(Widget, widgetId, WidgetValidator)
}


let createWidgetAttribute = async function(widgetAttributeName) {
  let widgetAttribute = new WidgetAttribute({widgetAttributeName: widgetAttributeName})
  if ((await WidgetAttribute.find({widgetAttributeName: widgetAttributeName}).limit(1)).length > 0)
    return new ApiResponse(400, new WidgetsRUsError({code: 'widget-attribute/already-exists',
      context: 'WidgetService#createWidgetAttribute',
      message: 'Failed validation: widget attribute name already exists',
      data: {input: {widgetAttributeName: widgetAttributeName}}
    }))
  return await BaseService.baseCreate(widgetAttribute, WidgetAttributeValidator)
}

let getWidgetAttributes = async function() {
  return new ApiResponse(200, await WidgetAttribute.find())
}

let deleteWidgetAttribute = async function(widgetAttributeId) {
  return await BaseService.baseDeleteById(WidgetAttribute, widgetAttributeId, WidgetAttributeValidator)
}

/**
 * @param widgetCategory: WidgetCategory
 * @returns {Promise.<void>}
 */
let createWidgetCategory = async function(widgetCategory) {
  let completeWidgetCategory = new WidgetCategory({widgetCategoryName: widgetCategory})
  return await BaseService.baseCreate(completeWidgetCategory, WidgetCategoryValidator)
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

let recursiveBuildCategoryTree = async function(categories, categoryToOptionsMap) {
  if (!categories)
    return []
  for (const category of categories) {
    category.children = await WidgetCategory.find({parentId: category._id}).lean()
    let options = categoryToOptionsMap[category._id] || []
    category.children = category.children.concat(options)
    category.children = await recursiveBuildCategoryTree(category.children, categoryToOptionsMap)
  }
  return categories
}

const reservedRootWidgetCategoryName = 'reservedRootWidgetCategory'

let getWidgetCategoriesAndOptions = async function() {
  let rootWidgetCategory = await WidgetCategory.findOne({widgetCategoryName: reservedRootWidgetCategoryName}).lean()
  rootWidgetCategory.children = await WidgetCategory
      .where({parentId: rootWidgetCategory._id})
      .where('widgetCategoryName').ne(reservedRootWidgetCategoryName)
      .find().lean()
  let widgetCategoryOptions = await WidgetCategoryOption.find().lean()
  let tree = {root: rootWidgetCategory}
  let categoryToOptionsMap = {}
  for (const option of widgetCategoryOptions) {
    // if options already exist for this parentId, push a new element, otherwise create a new entry for this option's parentId
    if (categoryToOptionsMap[option.parentId])
      categoryToOptionsMap[option.parentId].push(option)
    else
      categoryToOptionsMap[option.parentId] = [option]
  }
  console.log(categoryToOptionsMap)
  tree.root.children = await recursiveBuildCategoryTree(tree.root.children, categoryToOptionsMap)
  return new ApiResponse(200, {categoryTreeRoot: tree.root})
}

/**
 * @param widgetCategoryOptionId: number
 * @returns {Promise.<void>}
 */
let deleteWidgetCategoryOption = async function(widgetCategoryOptionId) {
  return await BaseService.baseDeleteById(WidgetCategoryOption, widgetCategoryOptionId, WidgetCategoryOptionValidator)
}

let associateWidgetAttributeWithWidget = async function(widgetId, attributeId) {
  // check existence of widgetAttributeForm via Id and widget via Id
  // add entry to junction table WidgetXWidgetAttribute
  let modelToCreate = new WidgetXWidgetAttribute({widgetId: widgetId, attributeId: attributeId})
  return await BaseService.baseCreate(modelToCreate, WidgetXWidgetAttributeValidator)
}

let dissociateWidgetAttributeWithWidget = async function(widgetId, attributeId) {
  // check existence of widgetAttributeForm via Id and widget via Id
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
