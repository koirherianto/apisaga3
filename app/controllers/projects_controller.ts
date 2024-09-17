import { createProjectValidator } from '#validators/project'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProjectsController {
  async index({ view, auth }: HttpContext) {
    const user = auth.user!
    const projects = await user.related('projects').query()
    return view.render('projects/index', { user, projects })
  }

  async create({ view, auth }: HttpContext) {
    const user = auth.user!
    return view.render('projects/create', { user })
  }

  async store({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(createProjectValidator)
    const user = auth.user!
    const project = await user.related('projects').create(request.all())
    return response.redirect().toRoute('projects', { username: user.username })
  }
}
