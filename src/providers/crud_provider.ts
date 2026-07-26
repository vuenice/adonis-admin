import type { ApplicationService } from '@adonisjs/core/types'

export default class CrudProvider {
  constructor(protected app: ApplicationService) {}

  register() {}

  async boot() {}
}
