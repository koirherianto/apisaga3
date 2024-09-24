import Page from '#models/page'
import Project from '#models/project'
import Topbar from '#models/topbar'
import Version from '#models/version'
import { createProjectValidator, updateProjectValidator } from '#validators/project'
import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class ProjectsController {
  async index({ view, auth }: HttpContext) {
    const user = auth.user!
    const projects = await user.related('projects').query().orderBy('created_at', 'desc').exec()

    for (const project of projects) {
      project.defaultUrl = await this.defaultUrl(project.slug)
    }

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
          name: project.type === 'version' ? 'i' : 'i',
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

      await Page.create(
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

  async edit({ view, auth, params }: HttpContext) {
    const user = auth.user!
    const project = await user
      .related('projects')
      .query()
      .where('slug', params.projectSlug)
      .firstOrFail()

    return view.render('projects/edit', { user, project })
  }

  async update({ request, response, auth, session, params }: HttpContext) {
    const data = await request.validateUsing(updateProjectValidator)
    const user = auth.user!
    const project = await user
      .related('projects')
      .query()
      .where('slug', params.projectSlug)
      .firstOrFail()

    project.merge(data)
    await project.save()

    session.flash({ notification: 'Project updated successfully' })
    return response.redirect().toRoute('projects.index', { username: user.username })
  }

  async defaultUrl(
    projectSlug: string,
    versionSlug?: string,
    topbarSlug?: string
  ): Promise<string> {
    const project = await Project.findByOrFail('slug', projectSlug)

    let rangkaiUrl = projectSlug

    let version
    if (versionSlug) {
      version = await project.related('versions').query().where('slug', versionSlug).firstOrFail()
    } else {
      version = await project.related('versions').query().where('is_default', true).first()

      if (!version) {
        version = await project.related('versions').query().firstOrFail()
      }
    }

    rangkaiUrl += `/${version.slug}`

    // jika topbar dikirim
    let topbar
    if (topbarSlug) {
      topbar = await version.related('topbars').query().where('slug', topbarSlug).firstOrFail()
    } else {
      topbar = await version.related('topbars').query().where('is_default', true).first()
      if (!topbar) {
        topbar = await version.related('topbars').query().firstOrFail()
      }
    }

    rangkaiUrl += `/${topbar.slug}`

    let page = await topbar.related('pages').query().where('is_default', true).first()

    if (!page) {
      page = await topbar.related('pages').query().firstOrFail()
    }

    rangkaiUrl += `/${page.slug}`

    return rangkaiUrl
  }
}
