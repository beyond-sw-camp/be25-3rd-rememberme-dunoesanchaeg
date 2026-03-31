// main.js
import { createApp } from 'vue';
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/main.css';

import 'vant/lib/index.css';

import {
    NavBar,
    Icon,
    Tabbar,
    TabbarItem,
    Progress,
    Tag,
    Cell,        // 추가
    CellGroup,   // 추가
    Switch,      // 추가
    Image,       // 추가
    Loading      // 추가 (콜백 페이지용)
} from 'vant';

const app = createApp(App);

// 3. [수정] 앱에 등록합니다.
app.use(NavBar);
app.use(Icon);
app.use(Tabbar);
app.use(TabbarItem);
app.use(Progress);
app.use(Tag);
app.use(Cell);      // 추가
app.use(CellGroup); // 추가
app.use(Switch);    // 추가
app.use(Image);     // 추가
app.use(Loading);    // 추가
app.use(pinia)
app.use(router);
app.mount('#app');