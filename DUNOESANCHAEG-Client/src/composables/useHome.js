import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import instance from '@/api/instance';
import { useAuthStore } from '@/store/auth.js';

// const PREVIEW_MODE = true; 
const PREVIEW_MODE = false;

export function useHome() {
    const router = useRouter();
    const authStore = useAuthStore();

    const isLoading = ref(true);
    const routineData = ref(null);
    const errorMessage = ref('');

    const formattedDate = computed(() => {
        const now = new Date();
        return new Intl.DateTimeFormat('ko-KR', {
            month: 'long',
            day: 'numeric',
            weekday: 'short'
        }).format(now);
    });

    const progress = computed(() => routineData.value?.progressRate ?? 0);

    const message = computed(() => {
        const val = progress.value;
        if (val >= 100) return `🔥 오늘의 루틴을 모두 완료했어요. \n수고했어요!`;
        if (val >= 66) return '🔥 거의 다 왔어요! \n하나만 더 하면 완벽해요!';
        if (val >= 33) return '💪 조금만 더 힘내세요! \n5분이면 충분합니다.';
        return '🙂 아직 루틴을 시작하지 않았어요. \n함께 시작해볼까요?';
    });

    const missions = computed(() => {
        if (!routineData.value) return [];

        const d = routineData.value;

        const gameRouteMap = {
            'ARITHMETIC': 'GameArithmetic',
            'WORD_MEMORY': 'GameWordmemory',
            'DESCARTES_RPS': 'GameDekarterps'
        };

        return [
            {
                title: '미니게임',
                desc: '기억력을 키워요.',
                icon: '🎮',
                link: gameRouteMap[d.assignedGameType] || 'MiniGame',
                isCompleted: d.gameFinished,
                gameFinished: d.gameFinished,
                assignedGameType: d.assignedGameType
            },
            {
                title: '하루 기록',
                desc: '오늘의 기분을 작성해보세요.',
                icon: '📝',
                link: 'DailyRecord',
                isCompleted: d.recordFinished
            },
            {
                title: '개방형 질문',
                desc: '마음에 떠오르는 이야기를 편하게 적어보세요!',
                icon: '❓',
                link: 'OpenQuestion',
                isCompleted: d.questionFinished
            }
        ];
    });


    const username = computed(() => routineData.value?.username || '회원');
    // 
    const initializeHome = async () => {
        isLoading.value = true;
        errorMessage.value = '';

        try {
            // (PREVIEW_MODE = true)
            if (PREVIEW_MODE) {
                console.log("🛠️ 화면 테스트용 데이터를 사용합니다.");


                routineData.value = {
                    progressRate: 66,
                    gameFinished: true,
                    recordFinished: true,
                    questionFinished: false
                };
            }
            // (PREVIEW_MODE = false)
            else {

                if (!authStore.accessToken) {
                    routineData.value = {
                        progressRate: 0,
                        gameFinished: false,
                        recordFinished: false,
                        questionFinished: false
                    };
                    isLoading.value = false;
                    return;
                }

                const res = await instance.get('routines/today');
                routineData.value = res.data.data;
            }
        } catch (error) {
            console.error('Home 로딩 실패:', error);

            if (error.response?.status === 401) {
                authStore.logout();
                router.replace({ name: 'Login' });
            }
            errorMessage.value = '오늘의 루틴을 불러오지 못했습니다.';
        } finally {
            isLoading.value = false;
        }
    };


    onMounted(initializeHome);

    return {
        isLoading,
        routineData,
        errorMessage,
        progress,
        message,
        missions,
        initializeHome,
        username,
        formattedDate
    };
}
