import instance from '@/api/instance.js';

export const saveDailyRecord = async (payload) => { 
    const {data} = await instance.put('/api/v1/daily-record', payload);
    return data;
};