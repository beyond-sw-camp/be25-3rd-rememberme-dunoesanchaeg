// main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// 1. Vant UI 스타일 전체 불러오기
import 'vant/lib/index.css';

// 2. 사용할 컴포넌트들 불러오기
import { Tabbar, TabbarItem, Progress, Tag } from 'vant';

const app = createApp(App);

// 3. 앱에 등록
app.use(Tabbar);
app.use(TabbarItem);
app.use(Progress);
app.use(Tag);

app.use(router);
app.mount('#app');