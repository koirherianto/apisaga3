import Page from '#models/page'
import Topbar from '#models/topbar'
import Version from '#models/version'
import { createProjectValidator } from '#validators/project'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class ProjectsController {
  async index({ view, auth }: HttpContext) {
    const isLogin = await auth.check()
    let projects

    const user = auth.user!
    projects = await user.related('projects').query().orderBy('created_at', 'desc').exec()

    // return projects
    return view.render('projects/index', { user, projects, isLogin })
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

  async defaultUrl({ request, params, response }: HttpContext) {
    const project = await Project.findByOrFail('slug', params.slug)

    // jika version dikirim
    let version
    if (request.input('version')) {
      version = await project
        .related('versions')
        .query()
        .where('slug', request.input('version'))
        .firstOrFail()
    } else {
      version = await project.related('versions').query().where('is_default', true).firstOrFail()
    }

    // jika topbar dikirim
    let topbar
    if (request.input('topbar')) {
      topbar = await version
        .related('topbars')
        .query()
        .where('slug', request.input('topbar'))
        .firstOrFail()
    } else {
      topbar = await version.related('topbars').query().where('is_default', true).firstOrFail()
    }

    const leftbarList = await topbar.related('leftbarItems').query().orderBy('order', 'asc').exec()

    // jika leftbar dikirim
    let leftbar
    if (request.input('leftbar')) {
      leftbar = await topbar
        .related('leftbarItems')
        .query()
        .where('slug', request.input('leftbar'))
        .firstOrFail()
    } else {
      leftbar = await topbar.related('leftbarItems').query().where('is_default', true).firstOrFail()
    }

    const routeUrl = {
      repository: project.slug,
      version: version.slug,
      topbar: topbar.slug,
      leftbar: leftbar.slug,
      linkBe: `/projects/${project.slug}/versions/${version.slug}/topbars/${topbar.slug}/leftbars/${leftbar.slug}`,
      linkFe: `${project.slug}/${version.slug}/${topbar.slug}/${leftbar.slug}`,
    }

    return response.ok({
      success: true,
      data: {
        routeUrl,
        leftbar,
        leftbarList: leftbarList,
      },
      message: 'routeUrl fetched successfully',
    })
  }
}
