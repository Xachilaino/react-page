import { createApp } from "vue";
import App from "./App.vue";

// Element Plus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

// Vue Router
import router from "./router";

// Axios
import axios from "axios";

// 用 proxy，所以 baseURL 設 "/"
axios.defaults.baseURL = "/";

const app = createApp(App);

app.use(ElementPlus);
app.use(router);
app.mount("#app");
