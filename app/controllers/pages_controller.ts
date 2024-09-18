import type { HttpContext } from '@adonisjs/core/http'

export default class PagesController {
  async index({ inertia }: HttpContext) {
    return inertia.render('editor/index', { version: 6 })
  }
}
