import type { HttpContext } from '@adonisjs/core/http'

export default class LandingController {
  async index({ view, auth }: HttpContext) {
    // return inertia.render('home', { version: 6 })
    await auth.check()

    return view.render('landing')
  }
}
