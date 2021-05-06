const express = require('express')
const router = express.Router()
const ctrl = require('../../controllers/users')
const {validationUserSignup}=require('./validation-user')
const guard=require('../../helper/guard')

router.post('/signup', validationUserSignup, ctrl.signup)
router.post('/login', ctrl.login)
router.post('/logout', guard, ctrl.logout)

module.exports = router