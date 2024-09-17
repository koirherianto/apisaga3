/* eslint-disable prettier/prettier */

const LandingController = () => import('#controllers/landing_controller')
const AuthController = () => import('#controllers/auth_controller')
const ProjectsController = () => import('#controllers/projects_controller')
import { middleware } from './kernel.js'
import router from '@adonisjs/core/services/router'
// router.on('/').renderInertia('home', { version: 6 })

router.get('/', [LandingController, 'index'])

router.group(() => {
    router.get('/register', [AuthController, 'registerPage'])
    router.post('/register', [AuthController, 'register'])

    router.get('/login', [AuthController, 'loginpage'])
    router.post('/login', [AuthController, 'login'])
}).middleware(middleware.guest())

router.group(() => {
    router.delete('/logout', [AuthController, 'logout'])
    router.get('/u/:username/project', [ProjectsController, 'index']).as('projects')
    router.get('/u/:username/project/create', [ProjectsController, 'create']).as('projects.create')
    router.post('/u/:username/project', [ProjectsController, 'store']).as('projects.store')
}).middleware(middleware.auth())
