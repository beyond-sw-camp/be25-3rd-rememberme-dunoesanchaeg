import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';

// 전역 스타일 설정
import './assets/main.css';
import 'vant/lib/index.css';

// 사용할 Vant 컴포넌트 임포트
import {
    NavBar,
    Icon,
    Tabbar,
    TabbarItem,
    Progress,
    Tag,
    Cell,
    CellGroup,
    Switch,
    Image,
    Loading
} from 'vant';

// 앱 생성
const app = createApp(App);

/* 2. [가장 중요] Pinia 인스턴스를 실제로 생성합니다! */
const pinia = createPinia();

// 3. Vant 컴포넌트 등록
app.use(NavBar);
app.use(Icon);
app.use(Tabbar);
app.use(TabbarItem);
app.use(Progress);
app.use(Tag);
app.use(Cell);
app.use(CellGroup);
app.use(Switch);
app.use(Image);
app.use(Loading);

// 4. 플러그인 등록 (순서: Pinia -> Router)
// Pinia를 먼저 등록해야 라우터 가드에서 스토어를 안전하게 쓸 수 있습니다.
app.use(pinia);
app.use(router);

// 5. 마운트
app.mount('#app');