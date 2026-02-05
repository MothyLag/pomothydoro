import { useEffect } from "react";

export default function Menu() {
    return (
        <div className=" text-white h-full w-full flex items-center justify-start p-2.5">
            <ul className="flex flex-row gap-2 text-lg font-bold">
                <li className="text-lg font-bold">Clock</li>
                <li className="">Item 1</li>
                <li className="">Item 2</li>
                <li className="">Item 3</li>
            </ul>
        </div>
    );
}
