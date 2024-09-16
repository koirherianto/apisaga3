import { Exception } from '@adonisjs/core/exceptions'

export default class ResponseErrorException extends Exception {
  static status = 500
}
