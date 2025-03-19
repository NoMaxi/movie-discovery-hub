import React from "react";

interface CounterProps {
    initialValue?: number;
}

interface CounterState {
    count: number;
}

class Counter extends React.Component<CounterProps, CounterState> {
    constructor(props: CounterProps) {
        super(props);
        this.state = {
            count: props.initialValue || 0,
        };
        this.increment = this.increment.bind(this);
        this.decrement = this.decrement.bind(this);
    }

    increment() {
        this.setState((prevState: CounterState) => ({
            count: prevState.count + 1,
        }));
    }

    decrement() {
        this.setState((prevState: CounterState) => ({
            count: prevState.count - 1,
        }));
    }

    render() {
        const isDecrementDisabled = this.state.count <= 0;

        return React.createElement(
            "div",
            { className: "bg-gray-800 p-4 flex items-center justify-center gap-4" },
            React.createElement(
                "button",
                {
                    className: `bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer ${ isDecrementDisabled ? "opacity-50 cursor-not-allowed" : ""
                    }`,
                    onClick: this.decrement,
                    disabled: isDecrementDisabled,
                },
                "-"
            ),
            React.createElement("span", { className: "text-white text-xl font-bold" }, this.state.count),
            React.createElement(
                "button",
                {
                    className: "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer",
                    onClick: this.increment,
                },
                "+"
            )
        );
    }
}

export default Counter;
