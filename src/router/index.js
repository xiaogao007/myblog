import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/post/:id',
      component: () => import('../views/Post.vue')
    },
    {
      path: '/about',
      component: () => import('../views/About.vue')
    },
    {
      path: '/edit',
      component: () => import('../views/EditPost.vue')
    },
    {
      path: '/edit/:id',
      component: () => import('../views/EditPost.vue')
    },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('../views/Admin.vue')
    }
  ]
})

export default router