import User from '#models/user'
import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'

/**
 * Options accepted by the unique rule
 */
type Options = {
  email: string
  password: string
}

/**
 * Implementation
 */
async function verify(value: unknown, options: Options, field: FieldContext) {
  /**
   * We do not want to deal with non-string
   * values. The "string" rule will handle the
   * the validation.
   */
  if (typeof value !== 'string') {
    return
  }

  const user = await User.verifyCredentials(options.email, options.password)
  if (user) {
    // field.report('The {{ field }} field is not unique', 'unique', field)
    field.report('Email or password is wrong', 'unique', field)
  }
}

/**
 * Converting a function to a VineJS rule
 */
export const verifyUser = vine.createRule(verify)
