import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

import hash from '@adonisjs/core/services/hash'

export default class AuthController {
  async registerPage({ view }: HttpContext) {
    return view.render('auth/register')
  }

  async register({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(registerValidator)

    const user = await User.create(data)

    await auth.use('web').login(user)

    response.redirect('/dashboard')
  }

  async loginpage({ view }: HttpContext) {
    return view.render('auth/login')
  }

  async login({ session, request, response, auth }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.findBy('email', email)
    const isVerify = await hash.verify(user!.password, password)

    if (isVerify && user) {
      await auth.use('web').login(user)
      response.redirect('/projects')
    } else {
      session.flash('inputErrorsBag', { email: ['Email or password is wrong'] })
      response.redirect().back()
    }
  }

  async logout({ response, auth }: HttpContext) {
    await auth.use('web').logout()
    return response.status(200).json({ success: true })
  }
}
