import React from "react";

export const Context = React.createContext();

const useMergableState = initialState => {
    const [state, setState] = React.useState(initialState);
    const _setState = newState => {
        setState(a => ({
            ...a,
            ...newState
        }));
    };
    return [state, _setState];
};

export const AppStore = ({ children }) => {
    const [state, setState] = useMergableState({});
    return (
        <Context.Provider value={{ state, setState }}>
            {children}
        </Context.Provider>
    );
};
