import {
    StartSession,
    StopSession,
    GetTime,
    GetSessions,
    GetCurrentCycle,
    GetNewTime,
} from "../../wailsjs/go/main/Clock";

const stopSession = async () => {
    StopSession();
};

const startSession = async (description: string): Promise<number> => {
    const limitTime = await StartSession(description);
    return limitTime;
};

const getTime = async (timeLimit: number) => {
    return await GetTime(timeLimit);
};

const getSessions = async () => {
    return await GetSessions();
};

const getCurrentCycle = async () => {
    return await GetCurrentCycle();
};

const getNewTime = async (limitTime: number) => {
    return await GetNewTime(limitTime);
};

export default () => {
    return {
        startSession,
        stopSession,
        getTime,
        getSessions,
        getCurrentCycle,
        getNewTime,
    };
};
