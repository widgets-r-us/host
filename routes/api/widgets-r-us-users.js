var express = require('express')
var router = express.Router()
var WidgetsRUsUsersService = require('../../services/widgets-r-us-users.service')

router.post('/login', WidgetsRUsUsersService.login)
router.post('/logout', WidgetsRUsUsersService.logout)
router.post('/register', WidgetsRUsUsersService.register)
module.exports = router
