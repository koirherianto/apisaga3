import type { HttpContext } from '@adonisjs/core/http'

export default class LandingController {
  index({ view }: HttpContext) {
    // return inertia.render('home', { version: 6 })

    return view.render('landing')
  }
}
