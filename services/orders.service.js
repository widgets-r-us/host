var OrdersDao = require('../daos/orders.dao')

exports.getOrders = async function(req, res, next) {
  try {
    var orders = await OrdersDao.readOrders()
    return res.status(200).json({status: 200, data: orders})
  } catch(e) {
    return res.status(400).json({status: 400, message: e.message})
  }
}

exports.getMyOrder = async function(req, res, next) {
  var widgetsRUsUserId = req.query.widgetsRUsUserId
  // TODO(ajmed): validate order, for now do some poor man validation
  if (!req.body.widgetsRUsUserId)
    return res.status(400).json({status: 400, message: "No widgetsRUsUserId was specified"})

  var page = req.query.page ? req.query.page : 1
  var limit = req.query.limit ? req.query.limit : 1

  try {
    var orders = await OrdersDao.readOrders({}, page, limit)
    return res.status(200).json({status: 200, data: orders})
  } catch(e) {
    return res.status(400).json({status: 400, message: e.message})
  }
}

exports.createOrder = async function(req, res, next) {
  // TODO(ajmed): validate order, for now do some poor man validation
  if (!req.body.widgetsRUsUserId)
    return res.status(400).json({status: 400, message: "No widgetsRUsUserId was specified"})

  var order = {
    widgetsRUsUserId: req.body.widgetsRUsUserId
  }
  try {
    var createdOrder = await OrdersDao.createOrder(order)
    return res.status(201).json({status: 201, data: createdOrder})
  } catch(e) {
    return res.status(400).json({status: 400, message: e.message})
  }
}

exports.updateOrder = async function(req, res, next) {
  // TODO(ajmed): validate order, for now do some poor man validation
  if (!req.body._id)
    return res.status(400).json({status: 400, message: "No _id was specified"})
  else if (!req.body.widgetsRUsUserId)
    return res.status(400).json({status: 400, message: "No widgetsRUsUserId was specified"})

  var order = {
    _id: req.body._id,
    widgetsRUsUserId: req.body.widgetsRUsUserId
  }
  try {
    var createdOrder = await OrdersDao.createOrder(order)
    return res.status(201).json({status: 201, data: createdOrder})
  } catch(e) {
    return res.status(400).json({status: 400, message: e.message})
  }
}
