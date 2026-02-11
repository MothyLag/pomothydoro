import ClockBox from "./components/ClockBox";
import Menu from "./components/Menu";
import Clock from "./pages/Clock";

function App() {
    return (
        <div className="h-screen w-screen grid grid-rows-[10%_90%]">
            <Menu />
            <Clock />
        </div>
    );
}

export default App;
