import { config } from 'dotenv'
config()

import Fastify from 'fastify'
import AutoLoad from 'fastify-autoload'
import { join } from 'desm'
import amqp from './plugins/amqp.js'

const server = Fastify({
  logger: false
})

export const app = async () => {
  try {
    // auto register all config
    await server.register(AutoLoad, {
      dir: join(import.meta.url, 'config')
    })

    // auto register all plugins
    // await server.register(AutoLoad, {
    //   dir: join(import.meta.url, 'plugins')
    // })
    await server.register(amqp)

    // auto register all services
    await server.register(AutoLoad, {
      dir: join(import.meta.url, 'services')
    })

    // auto register all routes
    await server.register(AutoLoad, {
      dir: join(import.meta.url, 'routes')
    })

    // start server
    await server.listen(server.config.port, server.config.host)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}
