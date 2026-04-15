import instance from './instance';

export const saveCognitiveGameResult = async (payload) => {
    const { data } = await instance.post('/cognitive-games/result', payload);
    return data;
};
