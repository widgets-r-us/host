var WidgetsRUsModel = require('@widgets-r-us/model')
var WidgetsRUsUser = WidgetsRUsModel.WidgetsRUsUser
var WidgetsRUsError = WidgetsRUsModel.WidgetsRUsError

exports.readUserByUsername = async function(username) {
  try {
    let foundWidgetsRUsUser = await WidgetsRUsUser.findOne({username: username})
    if (foundWidgetsRUsUser) {
      return foundWidgetsRUsUser
    } else {
      return new WidgetsRUsError({
        context: "WidgetsRUsUsersDao#readUserByUsername",
        code: "widgetsRUsUsers/no-user-exists",
        message: "The specified username has not been registered.",
        data: {input: {username: username}},
      })
    }
  } catch (e) {
    throw new WidgetsRUsError({
      context: "WidgetsRUsUsersDao#readUserByUsername",
      code: "widgetsRUsUsers/findOne",
      message: "There was an error while finding the user by their username.",
      data: {e: e, input: {username: username}},
    })
  }
}

exports.exists = async function(widgetsRUsUser) {
  try {
    let foundWidgetsRUsUser = await WidgetsRUsUser.findOne({username: widgetsRUsUser.username})
    return foundWidgetsRUsUser.length > 0
  } catch (e) {
    throw new WidgetsRUsError({
      context: "WidgetsRUsUsersDao#exists",
      code: "widgetsRUsUsers/findOne",
      message: "There was an error while checking the existence of the specified user.",
      data: {e: e, input: {widgetsRUsUser: widgetsRUsUser}},
    })
  }
}

exports.createUser = async function(widgetsRUsUser) {
  let newWidgetsRUsUser = new WidgetsRUsUser({username: widgetsRUsUser.username})

  try {
    let foundWidgetsRUsUser = await WidgetsRUsUser.findOne({username: newWidgetsRUsUser.username})
    console.log(foundWidgetsRUsUser)
    if (foundWidgetsRUsUser)
      return new WidgetsRUsError({
        context: "WidgetsRUsUsersDao#createUser",
        code: "widgetsRUsUsers/already-exists",
        message: "That username is already taken.",
        data: {input: {widgetsRUsUser: widgetsRUsUser}},
      })

    return await newWidgetsRUsUser.save()
  } catch (e) {
    throw new WidgetsRUsError({
      context: "WidgetsRUsUsersDao#createUser",
      code: "widgetsRUsUsers/save",
      message: "There was an error creating the new user.",
      data: {e: e, input: {widgetsRUsUser: widgetsRUsUser}},
    })
  }
}
