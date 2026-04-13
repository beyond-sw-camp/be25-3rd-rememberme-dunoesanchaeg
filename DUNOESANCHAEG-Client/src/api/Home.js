import instance from './instance';

export const routineApi = {
    // 오늘 루틴 가져오기
    getTodayRoutine: () => instance.get('/api/v1/routines/today')
};