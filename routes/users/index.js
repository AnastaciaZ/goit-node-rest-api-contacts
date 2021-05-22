const express = require('express')
const router = express.Router()
const ctrl = require('../../controllers/users')
const {validationUserSignup}=require('./validation-user')
const guard = require('../../helper/guard')
const uploadAvatar = require('../../helper/upload-avatar')
//const upload = require('../../helper/upload-avatar')

router.post('/signup', validationUserSignup, ctrl.signup)
router.post('/login', ctrl.login)
router.post('/logout', guard, ctrl.logout)
router.patch(
    '/avatars',
    guard,
    uploadAvatar.single('avatar'),
    ctrl.updateAvatar,
)

router.get('/verify/:token', ctrl.verify )
router.post('/verify', ctrl.repeatEmailVerify)

module.exports = router