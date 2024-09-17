import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, beforeUpdate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import string from '@adonisjs/core/helpers/string'
import Topbar from './topbar.js'
import PageParent from './page_parent.js'

export default class Page extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare topbarId: string

  @column()
  declare pageParentId: string | null

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare order: number

  @column()
  declare isDefault: boolean

  @column()
  declare content?: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static async assignUuid(page: Page) {
    page.id = crypto.randomUUID()
    page.slug = string.slug(page.name, { lower: true })
  }

  @beforeUpdate()
  static async updateSlug(page: Page) {
    page.slug = string.slug(page.name, { lower: true })
    // page.save()
  }

  @belongsTo(() => Topbar)
  declare topBars: BelongsTo<typeof Topbar>

  @belongsTo(() => PageParent, {
    foreignKey: 'pageParentId',
  })
  declare pageParent: BelongsTo<typeof PageParent>
}
