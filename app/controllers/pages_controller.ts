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

  async store({ params, request, response }: HttpContext) {
    const project = await Project.query().where('slug', params.projectSlug).firstOrFail()

    const [version, topbar, pages] = await this.pages(
      project,
      params.versionSlug,
      params.topbarSlug,
      params.pageSlug
    )

    // apakah ada page yang bernama sama
    let lastOrder = 0
    for (const checkPage of pages) {
      if (checkPage.name === request.input('title')) {
        return response.redirect().back()
      }
      if (checkPage.order > lastOrder) {
        lastOrder = checkPage.order
      }
    }

    lastOrder += 1

    const newPage = new Page()
    newPage.name = request.input('title')
    newPage.content = '# Write your content here'
    newPage.isDefault = false
    newPage.order = lastOrder

    await topbar.related('pages').save(newPage)

    return response.redirect().toRoute('pages.editor', {
      projectSlug: project.slug,
      versionSlug: version.slug,
      topbarSlug: topbar.slug,
      pageSlug: newPage.slug,
    })
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

  async update({ params, request, response }: HttpContext) {
    const project = await Project.query().where('slug', params.projectSlug).firstOrFail()

    const [version, topbar, , currentPage] = await this.pages(
      project,
      params.versionSlug,
      params.topbarSlug,
      params.pageSlug
    )

    currentPage.content = request.input('content')

    await currentPage.save()

    return response.redirect().toRoute('pages.index', {
      projectSlug: project.slug,
      versionSlug: version.slug,
      topbarSlug: topbar.slug,
      pageSlug: currentPage.slug,
    })
  }

  private async pages(
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
