import '@/css/main.css';

import { createApp } from 'vue';

import App from './App.vue';

import i18n from '@/i18n';
import store from '@/stores';

createApp(App).use(i18n).use(store).mount('#app');
