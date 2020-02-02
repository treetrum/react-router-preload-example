import React from "react";

import useMergableState from "./hooks/useMergableState";

export const Context = React.createContext();
export const AppStore = ({ children }) => {
    const [state, setState] = useMergableState({});
    return (
        <Context.Provider value={{ state, setState }}>
            {children}
        </Context.Provider>
    );
};
