import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import { createRouter, createWebHashHistory } from 'vue-router'
import { createPinia } from 'pinia'

import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

import VueQuillTextEditor from 'vue-quill-text-editor';
import 'vue-quill-text-editor/dist/vue-quill-text-editor.esm.css';



let routes = [
    {
        path: "/", meta: {
            title: '登录'
        }, component: () => import('./views/Login.vue')
    },
    {
        path: "/main", meta: {
            title: '首页'
        }, component: () => import('./views/Main.vue'), children: [
            {
                path: "/main/page01", meta: {
                    title: '登录'
                }, component: () => import('./views/Page01.vue')
            },
            {
                path: "/main/goodscards", meta: {
                    title: '商品页面'
                }, component: () => import('./views/mainPage/GoodsCards.vue')
            },
            {
                path: "/main/mygoods", meta: {
                    title: '我的商品'
                }, component: () => import('./views/mainPage/MyGoods.vue')
            },
            {
                path: "/main/test", meta: {
                    title: '登录'
                }, component: () => import('./views/mainPage/test.vue')
            },
            {
                path: "/main/message", meta: {
                    title: '信息通知'
                }, component: () => import('./views/mainPage/MessagePage.vue')
            },
            {
                path: "/main/order", meta: {
                    title: '我的订单'
                }, component: () => import('./views/mainPage/MyOrder.vue')
            },
            {
                path: "/main/article", meta: {
                    title: '闲置论坛'
                }, component: () => import('./views/mainPage/Article.vue')
            },
            {
                path: "/main/main", meta: {
                    title: '闲置论坛'
                }, component: () => import('./views/mainPage/Main2.vue')
            },
            {
                path: "/main/hotArticle", meta: {
                    title: '热门帖子'
                }, component: () => import('./views/mainPage/HotArticle.vue')
            },
            {
                path: "/main/Temple", meta: {
                    title: '个人主页'
                }, component: () => import('./views/mainPage/Temple.vue')
            },
        ]
    },

]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// 设置导航守卫，在路由切换之前设置网页标题
router.beforeEach((to, from, next) => {
    // 设置网页标题为路由的 meta.title 或默认值
    document.title = to.meta.title || 'My App';
    next(); // 继续路由导航
});

let app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(router)
app.use(createPinia())
app.use(ElementPlus)
app.use(VueQuillTextEditor);
// 设置基础访问路径
axios.defaults.baseURL = 'http://127.0.0.1:8001/'
app.use(VueAxios, axios)
// app.config.globalProperties.$axios = axios
app.mount('#app')





