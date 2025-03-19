import "./App.css";
import Counter from "@/components/Counter.tsx";

function App() {
    return (
        <div>
            <Counter initialValue={ 10 } />
        </div>
    );
}

export default App;
