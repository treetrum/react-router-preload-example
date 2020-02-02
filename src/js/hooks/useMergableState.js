import React from "react";

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

export default useMergableState;
