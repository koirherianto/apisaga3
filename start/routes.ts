/* eslint-disable prettier/prettier */

const LandingController = () => import('#controllers/landing_controller')
const AuthController = () => import('#controllers/auth_controller')
const ProjectsController = () => import('#controllers/projects_controller')
const ProfilesController = () => import('#controllers/profiles_controller')
const PagesController = () => import('#controllers/pages_controller')
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
    router.delete('/logout', [AuthController, 'logout']) // no csrf
    
    router.get('/u/projects', [ProjectsController, 'index']).as('projects.index')
    router.get('/u/projects/create', [ProjectsController, 'create']).as('projects.create')
    router.post('/u/projects', [ProjectsController, 'store']).as('projects.store')
    router.get('/u/projects/:projectSlug/edit', [ProjectsController, 'edit']).as('projects.edit')
    router.put('/u/projects/:projectSlug', [ProjectsController, 'update']).as('projects.update')
    
    router.get('/u/profile', [ProfilesController, 'edit']).as('profiles.edit')
    router.put('/u/profile', [ProfilesController, 'update']).as('profiles.update')

    router.post(':projectSlug/:versionSlug/:topbarSlug/:pageSlug', [PagesController, 'store']).as('pages.store')
    router.get(':projectSlug/:versionSlug/:topbarSlug/:pageSlug/editor', [PagesController, 'editor']).as('pages.editor')
    router.put('/api/:projectSlug/:versionSlug/:topbarSlug/:pageSlug', [PagesController, 'update']).as('pages.update') // no csrf
    // router.delete('/api/:projectSlug/:versionSlug/:topbarSlug/:pageSlug', [PagesController, 'destroy']).as('pages.destroy') // no csrf
    
}).middleware(middleware.auth())

router.get('/u/:username', [ProfilesController, 'show']).as('profiles.show')
router.get(':projectSlug/:versionSlug/:topbarSlug/:pageSlug', [PagesController, 'index']).as('pages.index')
