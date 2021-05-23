const jwt = require('jsonwebtoken')
const jimp = require('jimp')
const fs = require('fs/promises')
const path =require('path')
require('dotenv').config()

const Users = require('../model/users')
const EmailService= require('../services/email')
const { HttpCode } = require('../helper/constants')
const JWT_SECRET_KEY=process.env.JWT_SECRET_KEY

const signup = async (req, res, next) => {
    const user = await Users.findByEmail(req.body.email)
    if (user) {
        return res.status(HttpCode.CONFLICT).json({
            status: 'error',
            code: HttpCode.CONFLICT,
            message: 'Email in use'
        })
    }
    try {
        const newUser = await Users.create(req.body)
        const {id, name, email, subscription, avatar, verifyTokenEmail} = newUser
        try {
            const emailService = new EmailService(process.env.NODE_ENV)
            await emailService.sendVerifyEmail(verifyTokenEmail, email,  name)
        } catch (e) {
            //logger
            console.log(e.message)
       }
        return res.status(HttpCode.CREATED).json({
            status: 'success',
            code: HttpCode.CREATED,
            data: {
                id,
                email,
                subscription,
                avatar,
            },
        })
    } catch (e) {
        next(e)
    }
 }

const login = async (req, res, next) => {
    const { email, password } = req.body
    const user = await Users.findByEmail(email)
    const isValidPassword = await user?.validPassword(password)
    if (!user || !isValidPassword || !user.verify) {
        return res.status(HttpCode.UNAUTHORIZED).json({
           status: 'error',
            code: HttpCode.UNAUTHORIZED,
            message: 'Email or password is wrong'  
        })
    }
    const payload = { id: user.id }
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '2h' })
    await Users.updateToken(user.id, token)
    return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: {token},
    })
 }

const logout = async (req, res, next) => {
    const id = req.user.id
    await Users.updateToken(id, null)
    return res.status(HttpCode.NO_CONTENT).json({})
}

const updateAvatar = async(req, res, next) => {
    const { id } = req.user
    const avatarUrl = await saveAvatarUsers(req)
    await Users.updateAvatar(id, avatarUrl)
    return res
        .status(HttpCode.OK)
        .json({
            status: 'success',
            code: HttpCode.OK,
            data: {avatarUrl}})
}

const saveAvatarUsers = async (req) => {
    const FOLDER_AVATARS = process.env.FOLDER_AVATARS
    //req.file
    const pathFile = req.file.path
    const newNameAvatar = `${Date.now().toString()}-${req.file.originalname}`
    const img = await jimp.read(pathFile)
    await img
        .autocrop()
        .cover(250, 250, jimp.HORIZONTAL_ALIGN_CENTER | jimp.VERTICAL_ALIGN_MIDDLE)
        .writeAsync(pathFile)
    try {
        await fs.rename(
        pathFile,
        path.join(process.cwd(), 'public', FOLDER_AVATARS, newNameAvatar),
    )
    } catch (e) {
        console.log(e.message)
    }
    const oldAvatar = req.user.avatar
    if (oldAvatar.includes(`${FOLDER_AVATARS}/`)) {
        await fs.unlink(path.join(process.cwd(), 'public', oldAvatar))
    }
    return path.join(FOLDER_AVATARS, newNameAvatar).replace('\\', '/')
}

const verify = async(req, res, next) => {
    try {
        const user = await Users.findByVerifyTokenEmail(req.params.token)
        if (user) {
            await Users.updateVerifyToken(user.id, true, null)
            return res.status(HttpCode.OK).json({
                status: 'success',
                code: HttpCode.OK,
                data: { message: 'Verification successful' },
            })
        }
        return res.status(HttpCode.BAD_REQUEST).json({
            status: 'error',
            code: HttpCode.BAD_REQUEST,
            message:
            'Your verification token is not valid. Contact to administration',
        }) 
    } catch (error) {
        next(error)
   }
}

const repeatEmailVerify = async (req, res, next) => {
    try {
        const user = await Users.findByEmail(req.body.email)
        if (user) {
            const { name, verifyTokenEmail, email } = user
            const emailService = new EmailService(process.env.NODE_ENV)
            await emailService.sendVerifyEmail(verifyTokenEmail, email, name)
            return res.status(HttpCode.OK).json({
                status: 'success',
                code: HttpCode.OK,
                data: {message: 'Verification email resubmited'},
            }) 
        }
        return res.status(HttpCode.NOT_FOUND).json({
            status: 'error',
            code: HttpCode.NOT_FOUND,
            message:'User not found',
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    signup,
    login,
    logout,
    updateAvatar,
    verify,
    repeatEmailVerify,
}