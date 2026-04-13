import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import instance from '@/api/instance';
import { useAuthStore } from '@/store/auth.js';

/**
 * 💡 모드 설정 (이것만 바꾸면 됩니다!)
 * true  : 로그인/서버 무관하게 화면 UI 테스트용 가짜 데이터 사용
 * false : 실제 백엔드 서버 연동 (로그인 필수)
 */
const PREVIEW_MODE = true; 
// const PREVIEW_MODE = false; 

export function useHome() {
    const router = useRouter();
    const authStore = useAuthStore();

    const isLoading = ref(true);
    const routineData = ref(null);
    const errorMessage = ref('');

    // --- [1. 가공된 데이터 (화면에서 쓸 것들)] ---
    const progress = computed(() => routineData.value?.progressRate ?? 0);

    const message = computed(() => {
        const val = progress.value;
        if (val >= 100) return '🔥 오늘의 루틴을 모두 완료했어요. 수고했어요!';
        if (val >= 66) return '🔥 거의 다 왔어요! 하나만 더 하면 완벽해요!';
        if (val >= 33) return '💪 조금만 더 힘내세요! 5분이면 충분합니다.';
        return '🙂 아직 루틴을 시작하지 않았어요. 함께 시작해볼까요?';
    });

    const games = computed(() => {
        if (!routineData.value) return [];
        return [
            {
                title: '미니게임',
                desc: '기억력을 키워요.',
                icon: '🎮',
                link: 'GameDekarterps',
                isCompleted: !!routineData.value.gameFinished
            },
            {
                title: '하루 기록',
                desc: '오늘의 기분을 작성해보세요.',
                icon: '📝',
                link: 'GameArithmetic',
                isCompleted: !!routineData.value.recordFinished
            },
            {
                title: '질문',
                desc: '오늘의 질문에 답해보세요.',
                icon: '❓',
                link: 'GameWordmemory',
                isCompleted: !!routineData.value.questionFinished
            }
        ];
    });


// 추가 할 말 할 말.... //
    const userName = computed(() => authStore.userName || '회원');

    const formattedDate = computed(() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const date = now.getDate();
        const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
        const dayOfWeek = weekDays[now.getDay()];

        return `${year}년 ${month}월 ${date}일 (${dayOfWeek})`;
    });

    // --- [2. 데이터 로드 함수] ---
    const initializeHome = async () => {
        isLoading.value = true;
        errorMessage.value = '';

        try {
            // [A] 화면 테스트 모드 (PREVIEW_MODE = true)
            if (PREVIEW_MODE) {
                console.log("🛠️ 화면 테스트용 데이터를 사용합니다.");

                if(!authStore.userName) authStore.userName = '웅콕';

                routineData.value = {
                    progressRate: 66,
                    gameFinished: true,
                    recordFinished: true,
                    questionFinished: false
                };
            } 
            // [B] 실제 서버 연동 모드 (PREVIEW_MODE = false)
            else {
                // (주석 처리됨 - 연동 시 해제)
                
                if (!authStore.accessToken) {
                    if (router.hasRoute('Login')) router.replace({ name: 'Login' });
                    return;
                }
                const res = await instance.get('/api/v1/routines/today');
                routineData.value = res.data.data;
                
            }
        } catch (error) {
            console.error('Home 로딩 실패:', error);
            errorMessage.value = '데이터를 가져오지 못했습니다.';
        } finally {
            isLoading.value = false;
        }
    };




    onMounted(initializeHome);

    return {
// 논의 필요 !!!!
        userName,
        formattedDate,
// 추가 할 말 할 말 

        isLoading,
        routineData,
        errorMessage,
        progress,
        message,
        games,
        initializeHome
    };
}


// TODO: 로그인 하지 않은 상태에서 페이지 이동 시 조건문 검사 필요 (로그인이 필요합니다. 문구 필요)