import instance from '@/api/instance.js';

export const saveDailyRecord = async (payload) => { 
    const {data} = await instance.put('/daily-record', payload);
    return data;
};