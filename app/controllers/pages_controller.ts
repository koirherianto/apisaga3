import type { HttpContext } from '@adonisjs/core/http'

export default class PagesController {
  async index({ view }: HttpContext) {
    return 'cuy'
    return view.render('pages/index')
  }
}
