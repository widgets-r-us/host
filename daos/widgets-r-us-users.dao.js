var WidgetsRUsModel = require('@widgets-r-us/model')
var WidgetsRUsUser = WidgetsRUsModel.WidgetsRUsUser
var WidgetsRUsError = WidgetsRUsModel.WidgetsRUsError

exports.readUserByUsername = async function(widgetsRUsUser) {
  try {
    var foundWidgetsRUsUser = await WidgetsRUsUser.findOne({username: widgetsRUsUser.username})
    if (foundWidgetsRUsUser.length)
      return foundWidgetsRUsUser
    else
      return new WidgetsRUsError({
        context: "WidgetsRUsUsersDao#readUserByUsername",
        code: "widgetsRUsUsers/no-user-exists",
        message: "The specified username has not been registered.",
        data: {e: e, input: {widgetsRUsUser: widgetsRUsUser}},
      })
  } catch (e) {
    throw Error(new WidgetsRUsError({
      context: "WidgetsRUsUsersDao#readUserByUsername",
      code: "widgetsRUsUsers/findOne",
      message: "There was an error while finding the user by their username.",
      data: {e: e, input: {widgetsRUsUser: widgetsRUsUser}},
    }))
  }
}

exports.exists = async function(widgetsRUsUser) {
  try {
    var foundWidgetsRUsUser = await WidgetsRUsUser.findOne({username: widgetsRUsUser.username})
    return foundWidgetsRUsUser.length > 0
  } catch (e) {
    throw Error(new WidgetsRUsError({
      context: "WidgetsRUsUsersDao#exists",
      code: "widgetsRUsUsers/findOne",
      message: "There was an error while checking the existence of the specified user.",
      data: {e: e, input: {widgetsRUsUser: widgetsRUsUser}},
    }))
  }
}

exports.createUser = async function(widgetsRUsUser) {
  var newWidgetsRUsUser = new WidgetsRUsUser({
    username: widgetsRUsUser.username
  })

  try {
    var foundWidgetsRUsUser = await WidgetsRUsUser.findOne({username: widgetsRUsUser.username})
    if (foundWidgetsRUsUser.length)
      return new WidgetsRUsError({
        context: "WidgetsRUsUsersDao#createUser",
        code: "widgetsRUsUsers/already-exists",
        message: "That username is already taken.",
        data: {e: e, input: {widgetsRUsUser: widgetsRUsUser}},
      })

    var savedWidgetsRUsUser = await newWidgetsRUsUser.save()
    return savedWidgetsRUsUser
  } catch (e) {
    return new WidgetsRUsError(new WidgetsRUsError({
      context: "WidgetsRUsUsersDao#createUser",
      code: "widgetsRUsUsers/save",
      message: "There was an error creating the new user.",
      data: {e: e, input: {widgetsRUsUser: widgetsRUsUser}},
    }))
  }
}
