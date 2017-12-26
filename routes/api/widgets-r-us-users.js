var express = require('express')
var router = express.Router()
var WidgetsRUsUsersService = require('../../services/widgets-r-us-users.service')

router.post('/register', async function(req, res, next) {
  let username = req.body.username
  let apiResponse = WidgetsRUsUsersService.register(username)
  return res.status(apiResponse.status).json(apiResponse)
})

router.post('/login', async function(req, res, next) {
  let username = req.body.username
  let apiResponse = await WidgetsRUsUsersService.login(username)
  return res.status(apiResponse.status).json(apiResponse)
})

router.post('/logout', async function(req, res, next) {
  // TODO(ajmed): Currently, logout only affects the client,
  // but later we might want to clear the session or something
  let apiResponse = await WidgetsRUsUsersService.logout()
  return res.status(apiResponse.status).json(apiResponse)
})

module.exports = router
