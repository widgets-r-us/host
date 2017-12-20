var WidgetsRUsUsersDao = require('../daos/widgets-r-us-users.dao')

exports.login = async function(req, res, next) {
  var username = req.body.username
  // TODO(ajmed): validate username, for now do some poor man validation
  if (!username)
    return res.status(400).json({status: 400, message: "No username was specified"})
  else if (!username.match(/^[a-z0-9_-]{3,15}$/))
    return res.status(400).json({status: 400, message: "Invalid username, must be between 3 & 15 characters and may contain only letters, numbers, and hyphens"})

  try {
    var widgetsRUsUser = await WidgetsRUsUsersDao.readUserByUsername(username)

    // if readUserByUsername returned an error, return http 400
    if (widgetsRUsUser['context'] && widgetsRUsUser['code'] && widgetsRUsUser['message'])
      return res.status(400).json({status: 400, message: widgetsRUsUser.message})
    else
      return res.status(200).json({status: 200, data: widgetsRUsUser})
  } catch(e) {
    return res.status(400).json({status: 400, message: e.message})
  }
}

exports.logout = async function(req, res, next) {
  // TODO(ajmed): Currently logout only affects the client, but later we might want to clear the session or something
  return res.status(200).json({status: 200, data: {_id: -1, username: ''}})
}

exports.register = async function(req, res, next) {
  // TODO(ajmed): validate username, for now do some poor man validation
  var username = req.body.username
  if (!username)
    return res.status(400).json({status: 400, message: "No username was specified"})
  else if (!username.match(/^[a-z0-9_-]{3,15}$/))
    return res.status(400).json({status: 400, message: "Invalid username, must be between 3 & 15 characters and may contain only letters, numbers, and hyphens"})

  var widgetsRUsUser = {
    username: req.body.username
  }
  try {
    var createdWidgetsRUsUser = await WidgetsRUsUsersDao.createUser(widgetsRUsUser)

    // if createUser returned an error, return http 400
    if (createdWidgetsRUsUser['context'] && createdWidgetsRUsUser['code'] && createdWidgetsRUsUser['message'])
      return res.status(400).json({status: 400, message: createdWidgetsRUsUser.message})
    else
      return res.status(201).json({status: 201, data: createdWidgetsRUsUser})
  } catch(e) {
    return res.status(400).json({status: 400, message: e.message})
  }
}
