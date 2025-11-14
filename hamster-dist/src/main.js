import "./assets/main.css";
import "amfe-flexible";
import "./assets/fonts/index.css";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import NavBars from "./components/NavBars.vue";
import Loading from "./components/Loading.vue";
import "vant/lib/index.css";
import i18n from "./i18n";
import selfI18n from "./i18n/self";
import Vconsole from "vconsole";

import Varlet from '@varlet/ui'
import '@varlet/ui/es/style'
import { Locale } from '@varlet/ui'

// 设置 Varlet 组件语言为英语
Locale.use('en-US')

const app = createApp(App);

if (import.meta.env.MODE !== "production") {
  new Vconsole();
}

app.component("Loading", Loading).component("NavBars", NavBars);

app.use(router).use(i18n).use(selfI18n);

app.mount("#app");
