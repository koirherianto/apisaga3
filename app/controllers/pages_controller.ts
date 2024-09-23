import Page from '#models/page'
import Project from '#models/project'
import Topbar from '#models/topbar'
import Version from '#models/version'
import { marked } from 'marked'
import type { HttpContext } from '@adonisjs/core/http'

export default class PagesController {
  async index({ params, view }: HttpContext) {
    const project = await Project.query().where('slug', params.projectSlug).firstOrFail()

    const [version, topbar, pages, currentPage] = await this.pages(
      project,
      params.versionSlug,
      params.topbarSlug,
      params.pageSlug
    )

    currentPage.content = await marked.parse(currentPage.content ?? '')

    return view.render('pages/index', { project, version, topbar, pages, currentPage })
  }

  async editor({ params, view }: HttpContext) {
    const project = await Project.query().where('slug', params.projectSlug).firstOrFail()

    const [version, topbar, pages, currentPage] = await this.pages(
      project,
      params.versionSlug,
      params.topbarSlug,
      params.pageSlug
    )

    return view.render('pages/editor', { project, version, topbar, pages, currentPage })
  }

  async pages(
    project: Project,
    versionSlug?: string,
    topbarSlug?: string,
    pageSlug?: string
  ): Promise<[Version, Topbar, Page[], Page]> {
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

    let page
    if (pageSlug) {
      page = await topbar.related('pages').query().where('slug', pageSlug).firstOrFail()
    } else {
      page = await topbar.related('pages').query().where('is_default', true).first()
      if (!page) {
        page = await topbar.related('pages').query().firstOrFail()
      }
    }

    const pages = await topbar.related('pages').query().orderBy('order').exec()

    return [version, topbar, pages, page]
  }
}
