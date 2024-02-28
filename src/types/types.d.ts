export interface SmartContext {
    subscribe: Function;
    getState: Function;
}

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
export declare function useSmartContext<T extends object>(
    state: object,
    setters: T
): T & SmartContext;

/**
 * Selects portions of state from a given context by using a selector function.
 * This hook is optimized to only rerender a component if the value returned by the selector has actually updated.
 * @param context React context to select values from.
 * @param selector The selector function used to find the state data from the given context.
 * @returns The state data from the given context for the provided selector.
 */
export declare function useContextSelector<T extends SmartContext, K>(
    context: React.Context<T>,
    selector: (state: any) => K
): K;

export declare function useContextSetters<T extends SmartContext>(
    context: React.Context<T>
): Omit<T, keyof SmartContext>;
