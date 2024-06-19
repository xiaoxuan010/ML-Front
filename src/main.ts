import "mdui";
import "mdui/mdui.css";
import "/src/assets/base.css";
import "/src/assets/icon.css";

import { setColorScheme } from "mdui";
import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(router);

// Pinia
const pinia = createPinia();
app.use(pinia);

setColorScheme("#1F77B4");

app.mount("#app");
