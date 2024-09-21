import Project from '#models/project'
import type { HttpContext } from '@adonisjs/core/http'

export default class PagesController {
  async index({ inertia, params }: HttpContext) {
    const project = await Project.query().where('slug', params.projectSlug).firstOrFail()

    return inertia.render('pages/index', { project })
  }
}
