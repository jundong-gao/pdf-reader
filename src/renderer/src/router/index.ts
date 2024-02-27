import { RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router'


const routes: RouteRecordRaw[] = [
    {path: '/:pathMatch(.*)*', redirect: '/'},
    {path: '/', component: () => import('@renderer/layout/index.vue'), redirect: '/home', 
        children: [
            {path: '/home', component: () => import('@renderer/views/Home/index.vue')},
            {path: '/preview', component: () => import('@renderer/views/PreviewPdf/index.vue')},
        ]
    },
    {path: '/login', component: () => import('@renderer/views/Login/index.vue')},
]


const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// router.beforeEach((to, from, next) => {
//     return next()
// })


export default router