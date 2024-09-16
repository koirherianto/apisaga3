import vine from '@vinejs/vine'
import { existRule } from './rules/exist.js'
import { notExistRule } from './rules/not_exist.js'

export const registerValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(4).toLowerCase(),
    email: vine
      .string()
      .trim()
      .email()
      .use(notExistRule({ table: 'users', column: 'email', message: 'Email already taken' })),
    username: vine
      .string()
      .trim()
      .minLength(4)
      .toLowerCase()
      .use(notExistRule({ table: 'users', column: 'username', message: 'Username already taken' })),
    password: vine.string().trim().minLength(6),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .trim()
      .email()
      .use(existRule({ table: 'users', column: 'email', message: 'Email Or Password is wrong' })),
    password: vine.string().trim(),
  })
)

export const updateProfileValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(4).toLowerCase().optional(),
    email: vine.string().trim().email().optional(),
    username: vine.string().trim().minLength(4).toLowerCase().optional(),
    password: vine.string().trim().minLength(6).optional(),
  })
)

export const idValidator = vine.number()
