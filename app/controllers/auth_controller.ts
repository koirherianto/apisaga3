import User from '#models/user'
import { loginValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

import hash from '@adonisjs/core/services/hash'

export default class AuthController {
  async registerPage({ view }: HttpContext) {
    return view.render('auth/register')
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
      response.redirect('/dashboard')
    } else {
      session.flash('inputErrorsBag', { email: ['Email or password is wrong'] })
      response.redirect().back()
    }
  }
}
