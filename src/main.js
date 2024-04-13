import "@/style/index.scss";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import global from "./utils/global";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(global);

app.mount("#app");
