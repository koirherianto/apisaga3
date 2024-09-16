import type { HttpContext } from '@adonisjs/core/http'

export default class ProjectsController {
  async index({ view, auth }: HttpContext) {
    const user = auth.user!
    const kucing = 'kucing'
    return view.render('projects/index', { user, kucing })
  }
}
