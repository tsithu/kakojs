import jwt from 'jsonwebtoken'
import passport from 'koa-passport'
import bcrypt from 'bcrypt'
import _ from 'lodash'
import generatePassword from 'password-generator'
import moment from 'moment'
import Cryptr from 'cryptr'
import { UserModel, UserController } from '$/modules/user'
import { TokenModel, TokenController } from '$/modules/token'
import BaseController from '$/modules/core/base/controller'

const SALT_ROUND = 12

export default class AuthController extends BaseController {
  static authStrategy (strategy) {
    return passport.authenticate(strategy)
  }

  generateToken (user, client, strategy, tokenTypeName = 'accessToken') {
    const { appSecret, authentication } = this.config
    const { jsonWebTokenOptions } = authentication.jwt
    const { expiresIn } = jsonWebTokenOptions
    if (user) {
      return jwt.sign(
        { user: _.pick(user, ['id', 'name', 'email']), strategy },
        appSecret,
        {
          ...jsonWebTokenOptions,
          subject: client,
          expiresIn: expiresIn[tokenTypeName.toString()]
        }
      )
    }
    return null
  }

  getClient ({ userAgent }, encrypt = false) {
    const {
      platform, os, browser, version
    } = userAgent
    const plainText = `${platform}::${os}::${browser}::${version}`
    if (encrypt) {
      const { appSecret } = this.config
      const cryptr = new Cryptr(appSecret)
      return cryptr.encrypt(plainText)
    }
    return plainText
  }

  async getAuth (user, client, strategy, save) {
    if (user && client && save) {
      const accessToken = this.generateToken(user, client, strategy)
      const refreshToken = this.generateToken(user, client, strategy, 'refreshToken')
      if (accessToken && refreshToken) {
        await save(accessToken, refreshToken)
        return { authenticated: !_.isEmpty(accessToken), user, accessToken }
      }
    }
    return { authenticated: false }
  }

  async login (email, password, ctx) {
    const strategy = 'local-jwt'
    const client = this.getClient(ctx)
    const clientEncrypted = this.getClient(ctx, true)
    const userCtrl = new UserController(UserModel, this.config)
    const user = await userCtrl.findOne({
      email: { eq: email },
      isActive: { eq: true }
    })
    const valid = user ? await bcrypt.compare(password, user.password) : false
    const save = async (accessToken, refreshToken) => {
      const tokenCtrl = new TokenController(TokenModel, this.config)
      await tokenCtrl.deleteByFilter({
        userId: { eq: user.id },
        client: { eq: client },
        strategy: { eq: strategy }
      })
      const token = await tokenCtrl.createNew({
        userId: user.id,
        client,
        strategy,
        accessToken,
        refreshToken,
        isRevoked: false,
        createdBy: user.id,
        updatedBy: user.id
      })
      return token || {}
    }
    return this.getAuth(valid ? user : null, clientEncrypted, strategy, save)
  }

  async logout (accessToken, ctx) {
    const { user } = ctx
    const client = this.getClient(ctx)
    const tokenCtrl = new TokenController(TokenModel, this.config)
    await tokenCtrl.deleteByFilter({
      client: { eq: client },
      accessToken: { eq: accessToken },
      ...(user ? { userId: { eq: user.id } } : null)
    })
    return this.getAuth()
  }

  async register (name, email, password, ctx) {
    const userCtrl = new UserController(UserModel, this.config)
    const hashedPassword = await bcrypt.hash(password, SALT_ROUND)
    const user = await userCtrl.createNew({
      name,
      email,
      password: hashedPassword,
      isActive: true,
      createdBy: 1,
      updatedBy: 1
    })
    if (user) {
      const { id } = user
      await userCtrl.patchById(id, {
        createdBy: id,
        updatedBy: id
      })
    }
    return this.login(email, password, ctx)
  }

  async resetPassword (resetToken) {
    try {
      const params = resetToken.split('::')

      if (!_.isEmpty(params) && params.length === 2) {
        const expire = moment(parseInt(params[0], 10)).add(1, 'day').toDate().getTime()
        const current = moment().toDate().getTime()
        if (current > expire) return { error: 'Reset token expired.' }

        const userCtrl = new UserController(UserModel, this.config)
        const user = await userCtrl.findOne({
          resetToken: { eq: resetToken },
          isActive: { eq: true }
        })
        if (user) {
          const generatedNewPassword = generatePassword(12, false)
          const hashedPassword = await bcrypt.hash(generatedNewPassword, SALT_ROUND)
          await userCtrl.patchById(user.id, {
            resetToken: null,
            password: hashedPassword
          })
          return { generatedNewPassword }
        }
        return { error: 'Invalid link or token has been used already.' }
      }
      return { error: 'Invalid link.' }
    } catch (err) {
      return { error: err }
    }
  }

  async changePassword (userId, oldPassword, newPassword) {
    const userCtrl = new UserController(UserModel, this.config)
    const user = await userCtrl.findOne({
      id: { eq: userId },
      isActive: { eq: true }
    })
    if (user) {
      const valid = await bcrypt.compare(oldPassword, user.password)
      if (valid) {
        const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUND)
        const { id, email } = user
        await userCtrl.patchById(id, {
          password: hashedNewPassword,
          updatedBy: id
        })
        return this.login(email, newPassword)
      }
    }
    return this.getAuth()
  }

  async forgotPassword (email) {
    const SUCCEED = ''
    const userCtrl = new UserController(UserModel, this.config)
    const user = await userCtrl.findOne({
      email: { eq: email },
      isActive: { eq: true }
    })
    if (!user) return 'Not a registered email.'
    const resetToken = `${new Date().getTime()}::${generatePassword(16, false)}`
    await userCtrl.patchById(user.id, { resetToken })
    // TODO: Sent Email To Inform User
    return SUCCEED
  }

  // eslint-disable-next-line no-unused-vars
  async refreshToken (accessToken, ctx) {
    // accessToken, ctx
    // TODO: Refetch new token
    return this.getAuth()
  }
}
