import { useLayoutEffect, useMemo, useRef } from 'react';
import { SmartContext } from '../types/types';

/**
 * This hook creates a smart context value that provides efficient state management and optimization
 * features within a React application. It enables precise control over state updates and re-renders
 * within the context, promoting performance and flexibility.
 * @param state An object containing the state values that can be accessed using selectors.
 * @param setters An object containing functions that update specific parts of the state object.
 * These functions serve as the primary mechanism for state mutations within the context.
 * @returns A `SmartContext` object to be passed to the value prop of your context provider.
 *
 * @example
 * ```typescript
 * import { ReactNode, createContext, useState } from 'react';
 * import { type SmartContext, useSmartContext } from 'smart-context';
 *
 * interface AppContext extends SmartContext {
 *   setCount: React.Dispatch<React.SetStateAction<number>>;
 * }
 *
 * export const appContext = createContext<AppContext>({} as AppContext);
 *
 * interface AppState {
 *   count: number;
 * }
 *
 * export const selectCount = (state: AppState) => state.count;
 *
 * export const AppContextProvider = ({ children }: { children: ReactNode }) => {
 *   const [count, setCount] = useState(0);
 *
 *   const value = useSmartContext({ count }, { setCount });
 *
 *   return <appContext.Provider value={value}>{children}</appContext.Provider>;
 * };
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
