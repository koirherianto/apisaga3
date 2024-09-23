import { Project } from './project'

export type User = {
  id: string
  name: string
  email: string
  username: string
  password: string
  createdAt: string
  updatedAt: string | null
  projects?: Project[]
}
