import Page from '#models/page'
import Project from '#models/project'
import Topbar from '#models/topbar'
import Version from '#models/version'
import type { HttpContext } from '@adonisjs/core/http'

export default class PagesController {
  async index({ inertia, params }: HttpContext) {
    const project = await Project.query().where('slug', params.projectSlug).firstOrFail()

    const [version, topbar, pages] = await this.pages(
      project,
      params.versionSlug,
      params.topbarSlug
    )

    return inertia.render('pages/index', { project, version, topbar, pages })
  }

  async pages(
    project: Project,
    versionSlug?: string,
    topbarSlug?: string
  ): Promise<[Version, Topbar, Page[]]> {
    let version
    if (versionSlug) {
      version = await project.related('versions').query().where('slug', versionSlug).firstOrFail()
    } else {
      version = await project.related('versions').query().where('is_default', true).first()

      if (!version) {
        version = await project.related('versions').query().firstOrFail()
      }
    }

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

    const pages = await topbar.related('pages').query().orderBy('order').exec()

    return [version, topbar, pages]
  }
}
