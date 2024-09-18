import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProfilesController {
  edit({ view, auth }: HttpContext) {
    const user = auth.user!
    return view.render('profiles/edit', { user })
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
    response.redirect().toRoute('profiles.edit', { username: user.username })
  }

  async show({ view, params }: HttpContext) {
    const user = await User.findByOrFail('username', params.username)
    const projects = await user.related('projects').query().orderBy('created_at', 'desc').exec()
    return view.render('profiles/show', { user, projects })
  }
}
