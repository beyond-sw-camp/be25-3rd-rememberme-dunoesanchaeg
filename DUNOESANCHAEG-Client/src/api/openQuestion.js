import instance from '@/api/instance';

export const startOpenQuestion = async () => {
    const res = await instance.post(
        '/open-questions/start'
    );
    return res.data.data;
};

export const completeOpenQuestion = async (dailyQuestionLogId, responseSecond) => {
    const res = await instance.patch(
        `/open-questions/${dailyQuestionLogId}`,
        { responseSecond }
    );
    return res.data.data;
};

export const exitOpenQuestion = async (dailyQuestionLogId) => {
    const res = await instance.delete(
        `/open-questions/${dailyQuestionLogId}`
    );
    return res.data.data;
};