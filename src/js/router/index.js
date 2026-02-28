
const { createRouter, createWebHistory } = VueRouter;
import { useSidebar } from '../composables/useSidebar.js';
import auth from '../auth.js';

const v = window.APP_VERSION;

const router = createRouter({
    history: createWebHistory(),
    scrollBehavior(to, from, savedPosition) {
        return savedPosition || { left: 0, top: 0 }
    },
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: () => import('/src/js/views/Auth/Login.js?v=' + v),
            meta: {
                title: 'Login',
            },
        },
        {
            path: '/Register',
            name: 'Register',
            component: () => import('/src/js/views/Auth/Register.js?v=' + v),
            meta: {
                title: 'Register',
            },
        },
        {
            path: '/Forgot-password',
            name: 'Signup',
            component: () => import('/src/js/views/Auth/forgot-password.js?v=' + v),
            meta: {
                title: 'Forgot-password',
            },
        },
        {
            path: '/',
            meta: { requiresAuth: true },
            children: [
                {
                    path: '',
                    name: 'Ecommerce',
                    component: () => import('/src/js/views/Ecommerce.js?v=' + v),
                    meta: {
                        title: 'eCommerce Dashboard',
                    },
                },
                {
                    path: 'Dashboard',
                    name: 'Dashboard',
                    component: () => import('/src/js/views/Ecommerce.js?v=' + v),
                    meta: {
                        title: 'eCommerce Dashboard',
                    },
                },
                {
                    path: 'calendar',
                    name: 'Calendar',
                    component: () => import('/src/js/views/Others/Calendar.js?v=' + v),
                    meta: {
                        title: 'Calendar',
                    },
                },
                {
                    path: 'profile',
                    name: 'Profile',
                    component: () => import('/src/js/views/Pages/BlankPage.js?v=' + v),
                    meta: {
                        title: 'Profile',
                    },
                },
                {
                    path: 'form-elements',
                    name: 'Form Elements',
                    component: () => import('/src/js/views/Pages/BlankPage.js?v=' + v),
                    meta: {
                        title: 'Form Elements',
                    },
                },
                {
                    path: 'basic-tables',
                    name: 'Basic Tables',
                    component: () => import('/src/js/views/Pages/BlankPage.js?v=' + v),
                    meta: {
                        title: 'Basic Tables',
                    },
                },
                {
                    path: 'line-chart',
                    name: 'Line Chart',
                    component: () => import('/src/js/views/Pages/BlankPage.js?v=' + v),
                },
                {
                    path: 'bar-chart',
                    name: 'Bar Chart',
                    component: () => import('/src/js/views/Pages/BlankPage.js?v=' + v),
                },
                {
                    path: 'alerts',
                    name: 'Alerts',
                    component: () => import('/src/js/views/Pages/BlankPage.js?v=' + v),
                    meta: {
                        title: 'Alerts',
                    },
                },
                {
                    path: 'avatars',
                    name: 'Avatars',
                    component: () => import('/src/js/views/Pages/BlankPage.js?v=' + v),
                    meta: {
                        title: 'Avatars',
                    },
                },
                {
                    path: 'badge',
                    name: 'Badge',
                    component: () => import('/src/js/views/Pages/BlankPage.js?v=' + v),
                    meta: {
                        title: 'Badge',
                    },
                },
                {
                    path: 'buttons',
                    name: 'Buttons',
                    component: () => import('/src/js/views/Pages/BlankPage.js?v=' + v),
                    meta: {
                        title: 'Buttons',
                    },
                },
                {
                    path: 'images',
                    name: 'Images',
                    component: () => import('/src/js/views/Pages/BlankPage.js?v=' + v),
                    meta: {
                        title: 'Images',
                    },
                },
                {
                    path: 'videos',
                    name: 'Videos',
                    component: () => import('/src/js/views/Pages/BlankPage.js?v=' + v),
                    meta: {
                        title: 'Videos',
                    },
                },
                {
                    path: 'blank',
                    name: 'Blank',
                    component: () => import('/src/js/views/Pages/BlankPage.js?v=' + v),
                    meta: {
                        title: 'Blank',
                    },
                },
                {
                    path: 'error-404',
                    name: '404 Error',
                    component: () => import('/src/js/views/Pages/BlankPage.js?v=' + v),
                    meta: {
                        title: '404 Error',
                    },
                },
            ],
        },
    ],
});

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title}`
    
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!auth.isAuthenticated()) {
            next('/login')
        } else {
            next()
        }
    } else {
        next()
    }
});

export default router;
