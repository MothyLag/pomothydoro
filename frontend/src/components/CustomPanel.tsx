import { useState } from "react";

interface CustomPanelProps {
    children: React.ReactNode;
}
export default (props: CustomPanelProps) => {
    const [isMaximaized, setIsMaximaized] = useState(false);
    const { children } = props;
    return (
        <div className="absolute left-0 w-1/5 ml-3  h-2/3 z-10">{children}</div>
    );
};
