import {
    StartSession,
    StopSession,
    GetTime,
    GetSessions,
    GetCurrentCycle,
    GetNewTime,
    PauseSession,
    ResumeSession,
    GetRemainingMs,
    GetNextCycleAndAdvance,
} from "../../wailsjs/go/clock/Clock";

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

const pauseSession = async (limitTime: number) => {
    return await PauseSession(limitTime);
};

const resumeSession = async (limitTime: number) => {
    return await ResumeSession(limitTime);
};

const getRemainingMs = async (limitTime: number) => {
    return await GetRemainingMs(limitTime);
};

const getNextCycleAndAdvance = async () => {
    return await GetNextCycleAndAdvance();
};

export default () => {
    return {
        startSession,
        stopSession,
        getTime,
        getSessions,
        getCurrentCycle,
        getNewTime,
        pauseSession,
        resumeSession,
        getRemainingMs,
        getNextCycleAndAdvance,
    };
};
