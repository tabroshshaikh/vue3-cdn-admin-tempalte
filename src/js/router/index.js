
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
                    path: 'profile',
                    name: 'Profile',
                    component: () => import('/src/js/views/Profile.js?v=' + v),
                    meta: {
                        title: 'Store Profile',
                    },
                },
                {
                    path: 'profile2',
                    name: 'Profile2',
                    component: () => import('/src/js/views/Profile2.js?v=' + v),
                    meta: {
                        title: 'Store Profile',
                    },
                },
                {
                    path: 'form-elements',
                    name: 'FormElements',
                    component: () => import('/src/js/views/FormElements.js?v=' + v),
                    meta: {
                        title: 'Form Elements',
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
