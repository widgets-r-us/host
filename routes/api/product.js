var express = require('express')
var router = express.Router()
var ProductsService = require('../../services/products.service')

router.post('/createProduct', async function(req, res, next) {
  let product = req.body

})
router.post('/searchProducts', ProductsService.searchProducts)
router.delete('/deleteProduct', ProductsService.deleteProduct)
module.exports = router
