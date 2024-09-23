import { User } from './user'

export type Page = {
  id: string
  topbarId: string
  pageParentId: string | null
  name: string
  slug: string
  order: number
  isDefault: boolean
  content?: string | null
  createdAt: string
  updatedAt: string
  user?: User
}
