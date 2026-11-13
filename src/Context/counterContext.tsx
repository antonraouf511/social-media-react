import { createContext, useState } from 'react';
import React from 'react';

export const counterContext = createContext<any>({});

export default function CounterContextProvider({ children }: { children: React.ReactNode }) {
    const [counter, setCounter] = useState(0);

    function sayHello() {
    }

    return (
        <counterContext.Provider value={{ counter, setCounter, sayHello }}>
            {children}
        </counterContext.Provider>
    );
}
