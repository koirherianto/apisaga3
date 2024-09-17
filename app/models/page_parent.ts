import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import string from '@adonisjs/core/helpers/string'
import Topbar from './topbar.js'
import Page from './page.js'

export default class PageParent extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare topbarId: string

  @column()
  declare name: string

  @column()
  declare slug: String

  @column()
  declare order: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static async assignUuid(pageParent: PageParent) {
    pageParent.id = crypto.randomUUID()

    if (pageParent.name) {
      const baseSlug = string.slug(pageParent.name, { lower: true })
      let slug = baseSlug
      let count = 1

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const existingSeparator = await PageParent.query().where('slug', slug).first()
        if (!existingSeparator || existingSeparator.id === pageParent.id) {
          break
        }
        slug = `${baseSlug}-${count}`
        count++
      }

      pageParent.slug = slug
    }
  }

  @belongsTo(() => Topbar)
  declare topbars: BelongsTo<typeof Topbar>

  @hasMany(() => Page)
  declare pages: HasMany<typeof Page>
}
