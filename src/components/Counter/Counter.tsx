import React from "react";

interface CounterProps {
    initialValue?: number;
}

interface CounterState {
    count: number;
}

class Counter extends React.Component<CounterProps, CounterState> {
    state: CounterState = {
        count: this.props.initialValue ?? 0,
    };

    increment = () => {
        this.setState((prevState: CounterState) => ({
            count: prevState.count + 1,
        }));
    };

    decrement = () => {
        this.setState((prevState: CounterState) => ({
            count: prevState.count - 1,
        }));
    };

    render() {
        const isDecrementDisabled = this.state.count <= 0;

        return React.createElement(
            "div",
            { className: "p-4 flex items-center justify-center gap-4" },
            React.createElement(
                "button",
                {
                    className: `bg-[var(--color-primary)] hover:brightness-80 active:brightness-60 w-[40px] h-[40px] 
                    text-xl font-bold py-2 px-4 rounded-full cursor-pointer
                    ${ isDecrementDisabled ? "opacity-50 cursor-not-allowed" : "" }`,
                    onClick: this.decrement,
                    disabled: isDecrementDisabled,
                },
                "-",
            ),
            React.createElement(
                "div",
                {
                    className:
                        "flex items-center justify-center text-3xl font-bold min-w-[30px]",
                },
                this.state.count,
            ),
            React.createElement(
                "button",
                {
                    className: `bg-[var(--color-primary)] hover:brightness-80 active:brightness-60 w-[40px] h-[40px]
                    text-xl font-bold py-2 px-4 rounded-full cursor-pointer`,
                    onClick: this.increment,
                },
                "+",
            ),
        );
    }
}

export default Counter;
