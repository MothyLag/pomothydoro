import { useEffect, useState } from "react";
import { main } from "../../wailsjs/go/models";
import useClock from "../hooks/useClock";
import useSettings from "../hooks/useSettings";
import { GetLimitTimeByDescription } from "../../wailsjs/go/main/Clock";
import Tasks from "../components/Tasks";
import CustomPanel from "../components/CustomPanel";

export default function Clock() {
    const {
        getTime,
        getSessions,
        startSession,
        stopSession,
        getCurrentCycle,
        getNewTime,
    } = useClock();
    const { getSettings } = useSettings();
    const [isTracking, setIsTracking] = useState<boolean>(false);
    const [leftTime, setLeftTime] = useState<number>(0);
    const [sessions, setSessions] = useState<main.Session[]>([]);
    const [settings, setSettings] = useState<main.Settings>();
    const [currentCycle, setCurrentCycle] = useState<string>("");
    const [timer, setTimer] = useState<number>();
    const [time, setTime] = useState("");
    useEffect(() => {
        const interval = setInterval(async () => {
            const remainingTime = await getTime(leftTime);
            if (isTracking) setTime(remainingTime);
        }, 1000);
        setTimer(interval);

        return () => clearInterval(interval);
    }, [isTracking, leftTime]);
    // populate current sessions
    useEffect(() => {
        const fetchData = async () => {
            const set = await getSettings();
            setSettings(set);

            const ses = await getSessions();
            setSessions(ses);
            setCurrentCycle(set.Cycle[0]);
            const leftTime = await GetLimitTimeByDescription(set.Cycle[0]);
            console.log({ set, leftTime });
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
        clearInterval(timer);
        setIsTracking(true);
    };

    const handleStopSession = async () => {
        await stopSession();
        setIsTracking(false);
        const nextCyc = await getCurrentCycle();
        setCurrentCycle(nextCyc);
        const remainingTime = await GetLimitTimeByDescription(nextCyc);
        const nextLimitTime = await getNewTime(remainingTime);
        setTime(nextLimitTime);
        console.log({ leftTime, currentCycle, nextCyc, nextLimitTime });
    };

    return (
        <div
            className="h-full  w-full text-white flex flex-col items-center justify-center cursor-pointer"
            onClick={() => {
                if (!isTracking) {
                    handleStartSession();
                } else {
                    handleStopSession();
                }
            }}
        >
            <h2 className="text-7xl font-extrabold">{currentCycle}</h2>
            <div className="text-9xl font-bold">{time}</div>
            <CustomPanel>
                <Tasks />
            </CustomPanel>
        </div>
    );
}
