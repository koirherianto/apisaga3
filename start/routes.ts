/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
const LandingController = () => import('#controllers/landing_controller')
import router from '@adonisjs/core/services/router'
// router.on('/').renderInertia('home', { version: 6 })

router.get('/', [LandingController, 'index'])
