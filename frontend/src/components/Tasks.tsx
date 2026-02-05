export default () => {
    const handleTaskClick = (e: any) => {
        e.stopPropagation();
    };

    return (
        <div
            className="w-full h-full  backdrop-blur-2xl bg-indigo-500 cursor-default"
            onClick={handleTaskClick}
        >
            <h1>Tasks</h1>
        </div>
    );
};
