import { useState, useRef, useCallback, useEffect } from "react";

interface CustomPanelProps {
    children: React.ReactNode;
}

const MIN_W = 200;
const MAX_W = 400;
const MIN_H = 150;

export default (props: CustomPanelProps) => {
    const { children } = props;
    const panelRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({
        x: 12,
        y: window.innerHeight - 32,
    });
    const [size, setSize] = useState({ w: 280, h: 400 });
    const [dragging, setDragging] = useState(false);
    const [resizing, setResizing] = useState(false);
    const [minimized, setMinimized] = useState(true);
    const [savedPosition, setSavedPosition] = useState({ x: 12, y: 100 });
    const dragOffset = useRef({ x: 0, y: 0 });

    const handleDragStart = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            dragOffset.current = {
                x: e.clientX - position.x,
                y: e.clientY - position.y,
            };
            setDragging(true);
        },
        [position],
    );

    const handleResizeStart = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setResizing(true);
    }, []);

    const toggleMinimize = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setMinimized((prev) => {
                if (!prev) {
                    setSavedPosition(position);
                    setPosition({ x: 12, y: window.innerHeight - 32 });
                } else {
                    setPosition(savedPosition);
                }
                return !prev;
            });
        },
        [position, savedPosition],
    );

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (dragging) {
                const newX = e.clientX - dragOffset.current.x;
                const newY = e.clientY - dragOffset.current.y;
                setPosition({
                    x: Math.max(0, Math.min(newX, window.innerWidth - size.w)),
                    y: Math.max(0, Math.min(newY, window.innerHeight - size.h)),
                });
            }
            if (resizing) {
                const maxW = Math.min(MAX_W, window.innerWidth - position.x);
                const maxH = window.innerHeight - position.y;
                setSize({
                    w: Math.min(maxW, Math.max(MIN_W, e.clientX - position.x)),
                    h: Math.min(maxH, Math.max(MIN_H, e.clientY - position.y)),
                });
            }
        };

        const handleMouseUp = () => {
            setDragging(false);
            setResizing(false);
        };

        if (dragging || resizing) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [dragging, resizing, position, size]);

    return (
        <div
            ref={panelRef}
            className="fixed z-50 rounded-lg overflow-hidden shadow-lg border border-white/10"
            style={{
                left: position.x,
                top: position.y,
                width: size.w,
                height: minimized ? 32 : size.h,
            }}
            onClick={(e) => e.stopPropagation()}
        >
            {/* Barra de titulo - arrastra desde aqui */}
            <div
                className={`h-8 bg-indigo-700/80 flex items-center px-2 select-none justify-between ${minimized ? "cursor-default" : "cursor-move"}`}
                onMouseDown={minimized ? undefined : handleDragStart}
            >
                <span className="text-white text-xs font-semibold">Tasks</span>
                <button
                    onClick={toggleMinimize}
                    className="text-white/70 hover:text-white text-xs px-1"
                >
                    {minimized ? "+" : "-"}
                </button>
            </div>
            {!minimized && (
                <>
                    <div className="h-[calc(100%-2rem)] overflow-auto">
                        {children}
                    </div>
                    <div
                        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-white/20 rounded-tl"
                        onMouseDown={handleResizeStart}
                    />
                </>
            )}
        </div>
    );
};
