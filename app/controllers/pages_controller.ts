import type { HttpContext } from '@adonisjs/core/http'

export default class PagesController {
  async index({ inertia }: HttpContext) {
    return inertia.render('pages/index', { version: 6 })
  }
}
