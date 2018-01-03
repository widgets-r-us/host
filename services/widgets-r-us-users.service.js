var ApiResponse = require('./api-response').ApiResponse
var WidgetsRUsModel = require('@widgets-r-us/model')
var WidgetsRUsUser = WidgetsRUsModel.WidgetsRUsUser
var WidgetsRUsError = WidgetsRUsModel.WidgetsRUsError
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
    if (createdWidgetsRUsUser instanceof WidgetsRUsError)
      return new ApiResponse(400, createdWidgetsRUsUser)
    else
      return new ApiResponse(201, createdWidgetsRUsUser)
  } catch(e) {
    return new ApiResponse(500, e.message)
  }
}

exports.login = async function(username) {
  let validation = WidgetsRUsUserValidator.validate({username: username})
  if (validation !== 'pass')
    return new ApiResponse(400, validation)

  try {
    let widgetsRUsUser = await WidgetsRUsUsersDao.readUserByUsername(username)
    console.log(widgetsRUsUser)

    // if readUserByUsername returned an error, return http 400
    if (widgetsRUsUser instanceof WidgetsRUsError)
      return new ApiResponse(400, widgetsRUsUser)
    else
      return new ApiResponse(200, widgetsRUsUser)
  } catch(e) {
    return new ApiResponse(500, e)
  }
}

exports.logout = async function() {
  return new ApiResponse(200, {_id: -1, username: ''})
}
