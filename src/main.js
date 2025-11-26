import { createApp } from 'vue';
import { createPinia } from 'pinia';

import '@/style/index.scss';
import '@/utils/rem';
import '@/utils/axios';
import App from './App.vue';
import router from './router';
import global from './utils/global';
import lazyLoad from './directives/lazyLoad';

const app = createApp(App);

app.directive('lazy', lazyLoad);
app.use(createPinia());
app.use(router);
app.use(global);

app.mount('#app');
