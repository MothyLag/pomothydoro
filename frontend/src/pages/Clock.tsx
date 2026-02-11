import { useEffect, useState } from "react";
import useClock from "../hooks/useClock";
import useSettings from "../hooks/useSettings";
import useTasks from "../hooks/useTasks";
import { GetLimitTimeByDescription } from "../../wailsjs/go/clock/Clock";
import Tasks from "../components/Tasks";
import CustomPanel from "../components/CustomPanel";
import { clock, settings } from "../../wailsjs/go/models";
import ClockBox from "../components/ClockBox";

export default function Clock() {
    const {
        getTime,
        getSessions,
        startSession,
        getCurrentCycle,
        getNewTime,
        pauseSession,
        resumeSession,
        getRemainingMs,
        getNextCycleAndAdvance,
    } = useClock();
    const { getSettings } = useSettings();
    const { incrementSession, getActiveTask } = useTasks();
    const [clockState, setClockState] = useState<"idle" | "running" | "paused">(
        "idle",
    );
    const [leftTime, setLeftTime] = useState<number>(0);
    const [sessions, setSessions] = useState<clock.Session[]>([]);
    const [settings, setSettings] = useState<settings.Settings>();
    const [currentCycle, setCurrentCycle] = useState<string>("");
    const [time, setTime] = useState("");

    // Timer polling: solo corre cuando clockState === 'running'
    useEffect(() => {
        if (clockState !== "running") return;

        const interval = setInterval(async () => {
            const remainingMs = await getRemainingMs(leftTime);

            if (remainingMs <= 0) {
                clearInterval(interval);
                setTime("00:00");

                // Incrementar sesion en la tarea activa
                const activeId = await getActiveTask();
                if (activeId > 0) {
                    await incrementSession(activeId, currentCycle);
                }

                const nextCyc = await getNextCycleAndAdvance();
                setCurrentCycle(nextCyc);
                const nextLimit = await GetLimitTimeByDescription(nextCyc);
                setLeftTime(nextLimit);
                const nextTime = await getNewTime(nextLimit);
                setTime(nextTime);
                setClockState("idle");
                return;
            }

            const remainingTime = await getTime(leftTime);
            setTime(remainingTime);
        }, 1000);

        return () => clearInterval(interval);
    }, [clockState, leftTime]);

    // Populate initial data
    useEffect(() => {
        const fetchData = async () => {
            const set = await getSettings();
            setSettings(set);
            const ses = await getSessions();
            setSessions(ses);
            setCurrentCycle(set.Cycle[0]);
            const leftTime = await GetLimitTimeByDescription(set.Cycle[0]);
            setLeftTime(leftTime);
            const newTime = await getTime(leftTime);
            setTime(newTime);
        };
        fetchData();
    }, []);

    const handleStartSession = async () => {
        const currCyc = await getCurrentCycle();
        const limitTime = await startSession(currCyc);
        setLeftTime(limitTime);
        const ses = await getSessions();
        setSessions(ses);
        setCurrentCycle(currCyc);
        const remainingTime = await getTime(limitTime);
        setTime(remainingTime);
        setClockState("running");
    };

    const handlePauseSession = async () => {
        await pauseSession(leftTime);
        setClockState("paused");
    };

    const handleResumeSession = async () => {
        await resumeSession(leftTime);
        setClockState("running");
    };

    const handleSkipSession = async (e: React.MouseEvent) => {
        e.stopPropagation();

        // Incrementar sesion en la tarea activa antes de saltar
        const activeId = await getActiveTask();
        if (activeId > 0) {
            await incrementSession(activeId, currentCycle);
        }

        const nextCyc = await getNextCycleAndAdvance();
        setCurrentCycle(nextCyc);
        const nextLimit = await GetLimitTimeByDescription(nextCyc);
        setLeftTime(nextLimit);
        const nextTime = await getNewTime(nextLimit);
        setTime(nextTime);
        setClockState("idle");
    };

    return (
        <>
            <div
                className="h-full w-full text-white flex flex-col items-center justify-center cursor-pointer"
                onClick={() => {
                    if (clockState === "idle") handleStartSession();
                    else if (clockState === "running") handlePauseSession();
                    else handleResumeSession();
                }}
            >
                <div
                    className={`${clockState === "paused" ? "text-gray-400" : ""} w-full h-full grid grid-rows-3`}
                >
                    <div className="flex justify-center">
                        {" "}
                        {clockState === "paused" && (
                            <span className="text-sm text-white/50">
                                paused
                            </span>
                        )}
                    </div>
                    <ClockBox time={time} title={currentCycle} />
                    <div className="flex justify-center">
                        {" "}
                        {clockState !== "idle" && (
                            <button
                                onClick={handleSkipSession}
                                className="mt-4 text-white/50 hover:text-white text-sm px-4 py-1 rounded border border-white/20 hover:border-white/40"
                            >
                                Saltar sesion
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <CustomPanel>
                <Tasks />
            </CustomPanel>
        </>
    );
}
