var WidgetsRUsModel = require('../../model/src/models')
var Order = WidgetsRUsModel.Order
var WidgetsRUsError = WidgetsRUsModel.WidgetsRUsError

exports.readOrders = async function() {
  try {
    var orders = await Order.find({}, function(err, orders){})/*.exec()*/
    return orders
  } catch (e) {
    throw Error(new WidgetsRUsError({
      context: "OrdersDao#readOrders",
      code: "orders/pagination",
      message: "There was an error while paginating through the orders",
      data: {e: e},
    }))
  }
}

exports.createOrder = async function(order) {
  var newOrder = new Order({
    widgetsRUsUserId: order.widgetsRUsUserId
  })

  try {
    var savedOrder = await newOrder.save()
    return savedOrder
  } catch (e) {
    throw Error(new WidgetsRUsError({
      context: "OrdersDao#createOrder",
      code: "orders/save",
      message: "There was an error while saving the new order",
      data: {e: e, input: {order: order}},
    }))
  }
}

exports.updateOrder = async function(order) {
  var id = order._id
  try {
    var oldOrder = await Order.findById(id)
  } catch (e) {
    throw Error(new WidgetsRUsError({
      context: "OrdersDao#updateOrder",
      code: "orders/find-by-id",
      message: "There was an error while trying to find the specified order",
      data: {e: e, input: {order: order}},
    }))
  }

  if (!oldOrder)
    return false

  console.log(oldOrder)
  oldOrder.widgetsRUsUserId = order.widgetsRUsUserId
  console.log(oldOrder)
  try {
    var savedOrder = await oldOrder.save()
    return savedOrder
  } catch(e) {
    throw Error(new WidgetsRUsError({
      context: "OrdersDao#updateOrder",
      code: "orders/save",
      message: "There was an error while saving the new order",
      data: {e: e, input: {order: order}},
    }))
  }
}

exports.deleteOrder = async function(id) {
  let throwDeletionError = function() {
    throw Error(new WidgetsRUsError({
      context: "OrdersDao#deleteOrder",
      code: "orders/delete",
      message: "There was an error while removing the specified order",
      data: {e: e, input: {orderId: id}},
    }))
  }

  try {
    var deleted = await Order.remove({_id: id})
    if (deleted.result.n === 0)
      throwDeletionError()

    return deleted
  } catch (e) {
    throwDeletionError()
  }

}