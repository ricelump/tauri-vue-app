import { createApp } from 'vue'
import App from './App.vue'
import ui from '@nuxt/ui/vue-plugin'
import { createRouter, createWebHistory } from 'vue-router'

import './assets/main.css'

const router = createRouter({
	routes: [],
	history: createWebHistory(),
})

createApp(App).use(ui).use(router).mount('#app')
