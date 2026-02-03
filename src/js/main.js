
import App from './App.js';
import router from './router/index.js';

const { createApp } = Vue;

const app = createApp(App);

app.use(router);

if (window.VueApexCharts) {
    app.use(window.VueApexCharts);
}

app.mount('#app');
