import { useLayoutEffect, useMemo, useRef } from 'react';
import { SmartContext } from '../types/types';

/**
 * Creates and returns a SmartContext value to be passed to your context provider.
 * @param state The state object which contains all accessable values that can be returned by your selectors
 * @param setters An object containing all of the state mutating functions that update portions of the state object.
 * @returns SmartContext to be passed to the value prop of your context provider.
 *
 * @example
 * ```javascript
 * import { createContext, useState } from 'react';
 * import { useSmartContext } from './path/to/useSmartContext';
 *
 * const MyContext = createContext();
 *
 * function MyProvider({ children }) {
 *   const [count, setCount] = useState(0);
 *   const [user, setUser] = useState({ username: 'example user' });
 *
 *   const value = useSmartContext({
 *     count,
 *     user,
 *   }, {
 *     setCount,
 *     setUser,
 *   });
 *
 *   return (
 *     <MyContext.Provider value={value}>
 *       {children}
 *     </MyContext.Provider>
 *   );
 * }
 * ```
 */
export const useSmartContext = <T extends object>(
    state: object,
    setters: T
): T & SmartContext => {
    const prevStateRef = useRef({});
    const storeRef = useRef(state);
    storeRef.current = state;

    const subscribersRef = useRef<Function[]>([]);

    useLayoutEffect(() => {
        // Check if the object changed by comparing references
        if (prevStateRef.current !== state) {
            // Call the subscribers if object is different
            subscribersRef.current.forEach((sub) => sub());
            // Update the reference for the next comparison
            prevStateRef.current = state;
        }
    }, [state]);

    const value = useMemo(
        () => ({
            ...setters,
            subscribe: (cb: Function) => {
                subscribersRef.current.push(cb);
                return () => {
                    subscribersRef.current = subscribersRef.current.filter(
                        (sub) => sub !== cb
                    );
                };
            },
            getState: () => storeRef.current
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    return value;
};
