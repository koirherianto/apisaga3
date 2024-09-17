import type { HttpContext } from '@adonisjs/core/http'

export default class ProfilesController {
  index({ view, auth }: HttpContext) {
    const user = auth.user!
    return view.render('profiles/index', { user })
  }

  async update({ request, response, auth, session }: HttpContext) {
    const user = auth.user!
    const data = request.only(['name', 'email', 'password', 'username'])

    if (data.password === '' || data.password === null) {
      delete data.password
    }

    user.merge(data)
    await user.save()

    session.flash({ notification: 'Profile updated successfully' })
    response.redirect().toRoute('profiles.index', { username: user.username })
  }
}
