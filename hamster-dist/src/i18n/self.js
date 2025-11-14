import { createI18n } from "vue-i18n";
import { getLang } from "../utils";
import AR from "./lang/ar.js";
import EN from "./lang/en";

function i18n(lang) {
  return createI18n({
    locale: lang ? lang : getLang(), // 设置当前语言类型
    legacy: false, // 如果要支持compositionAPI，此项必须设置为false;
    globalInjection: true, // 全局注册$t方法
    messages: {
      ara: {
        ...AR,
      },
      en: {
        ...EN,
      },
    },
  });
}

export default i18n;
