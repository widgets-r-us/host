var ApiResponse = require('api-response').ApiResponse
var WidgetsRUsModel = require('@widgets-r-us/model')
var WidgetsRUsUser = WidgetsRUsModel.WidgetsRUsUser
var WidgetsRUsUserValidator = WidgetsRUsModel.Validators.WidgetsRUsUserValidator
var WidgetsRUsUsersDao = require('../daos/widgets-r-us-users.dao')

exports.register = async function(username) {
  let widgetsRUsUser = new WidgetsRUsUser({username: username})
  let validation = WidgetsRUsUserValidator.validate(widgetsRUsUser)
  if (validation !== 'pass')
    return new ApiResponse(400, validation)

  try {
    var createdWidgetsRUsUser = await WidgetsRUsUsersDao.createUser(widgetsRUsUser)

    // if createUser returned an error, return http 400
    if (createdWidgetsRUsUser['context'] && createdWidgetsRUsUser['code'] && createdWidgetsRUsUser['message'])
      return new ApiResponse(400, widgetsRUsUser.message)
    else
      return new ApiResponse(201, createdWidgetsRUsUser)
  } catch(e) {
    return new ApiResponse(400, e.message)
  }
}

exports.login = async function(username) {
  let validation = WidgetsRUsUserValidator.validate({username: username})
  if (validation !== 'pass')
    return new ApiResponse(400, validation)

  try {
    var widgetsRUsUser = await WidgetsRUsUsersDao.readUserByUsername(username)

    // if readUserByUsername returned an error, return http 400
    if (widgetsRUsUser['context'] && widgetsRUsUser['code'] && widgetsRUsUser['message'])
      return new ApiResponse(400, widgetsRUsUser.message)
    else
      return new ApiResponse(200, widgetsRUsUser)
  } catch(e) {
    return new ApiResponse(400, e.message)
  }
}

exports.logout = async function() {
  return new ApiResponse(200, {_id: -1, username: ''})
}
