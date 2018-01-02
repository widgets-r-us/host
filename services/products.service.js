var ApiResponse = require('./api-response').ApiResponse
var WidgetsRUsModel = require('@widgets-r-us/model')
var Product = WidgetsRUsModel.Product

exports.createProduct = async function(product) {
  // save product
}

exports.searchProducts = async function(productId) {
  // find widget entry with entered value... somehow, maybe we don't search product, we only search widgets
}

exports.deleteProduct = async function(productId) {
  // find product id and remove it. Should we also remove the corresponding merchandiseId? Prolly not. A widget should
  // have a property saying it is a product or something.... no, but in the form, there is a checkbox to indicate
  // that we need to make a product that maps to the new widget
}