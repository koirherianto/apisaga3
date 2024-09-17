import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Version from './version.js'
import string from '@adonisjs/core/helpers/string'
import Page from './page.js'
import PageParent from './page_parent.js'

export default class Topbar extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare versionId: string

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare isDefault: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Version)
  declare version: BelongsTo<typeof Version>

  @hasMany(() => Page)
  declare pages: HasMany<typeof Page>

  @hasMany(() => PageParent)
  declare pageParents: HasMany<typeof PageParent>

  @beforeCreate()
  static async assignUuid(topbar: Topbar) {
    topbar.id = crypto.randomUUID()
    if (topbar.slug === '' || topbar.slug === null) {
      topbar.slug = string.slug(topbar.name, { lower: true })
    }
  }
}
