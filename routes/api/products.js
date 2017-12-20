var express = require('express')
var router = express.Router()
var ProductsService = require('../../services/products.service')

router.post('/createProduct', ProductsService.createProduct)
router.post('/searchProducts', ProductsService.searchProducts)
router.delete('/deleteProduct', ProductsService.deleteProduct)
module.exports = router
