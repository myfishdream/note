import DefaultTheme from 'vitepress/theme'
import NewLayout from './components/NewLayout.vue'
import Archives from './components/Archives.vue'
import Category from './components/Category.vue'
import Tags from './components/Tags.vue'
import Page from './components/Page.vue'

import './style.css'
import './custom.css'

export default {
    ...DefaultTheme,
    Layout: NewLayout,  
    enhanceApp({ app }) {
        // register global compoment
        app.component('Tags', Tags)
        app.component('Category', Category)
        app.component('Archives', Archives)
        app.component('Page', Page)
    }
}
