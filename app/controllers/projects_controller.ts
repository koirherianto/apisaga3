import LeftbarItem from '#models/leftbar_item'
import Topbar from '#models/topbar'
import Version from '#models/version'
import { createProjectValidator } from '#validators/project'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

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

  async store({ request, response, auth, session }: HttpContext) {
    const data = await request.validateUsing(createProjectValidator)
    const trx = await db.transaction()

    try {
      const user = auth.user!
      user.useTransaction(trx)
      const project = await user.related('projects').create(data)

      const version = await Version.create(
        {
          projectId: project.id,
          name: project.type === 'version' ? '1.0.0' : 'Main',
          isDefault: true,
          visibility: 'public',
        },
        { client: trx }
      )

      const topBar = await Topbar.create(
        {
          versionId: version.id,
          name: 'docs',
          slug: 'i',
          isDefault: true,
        },
        { client: trx }
      )

      await LeftbarItem.create(
        {
          topbarId: topBar.id,
          name: 'Introduction',
          order: 1,
          isDefault: true,
          content: '# Introduction\n\nThis is the introduction of your project',
        },
        { client: trx }
      )

      await trx.commit()
      session.flash({ notification: 'Profile updated successfully' })
    } catch (error) {
      await trx.rollback()
    }
    const user = auth.user!
    return response.redirect().toRoute('projects.index', { username: user.username })
  }
}
