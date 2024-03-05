/**
 * All context values that are passed to React.createContext that intend on using the `useSmartContext`
 * hook are required to extend this interface.
 *
 * @example
 * ```typescript
 * import { createContext } from 'react';
 * import { type SmartContext, useSmartContext } from 'smart-context';
 *
 * interface AppContext extends SmartContext {
 *   setCount: React.Dispatch<React.SetStateAction<number>>;
 * }
 *
 * export const appContext = createContext<AppContext>({} as AppContext);
 *
 * // ... rest of provider setup
 * ```
 */
export interface SmartContext {
    subscribe: Function;
    getState: Function;
}

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
export declare function useSmartContext<T extends object>(
    state: object,
    setters: T
): T & SmartContext;

/**
 * This hook efficiently retrieves a portion of state from a smart context using a selector function.
 * It optimizes component re-renders by only triggering them when the selected value genuinely
 * changes, preventing unnecessary updates and enhancing performance.
 * @param context A React context instance created using `useSmartContext`
 * @param selector A function that takes the context state as input and returns the specific value or slice of state you want to access.
 * @returns The selected state value from the context, as determined by the provided selector function.
 *
 * @example
 * ```javascript
 * import { useContextSelector } from 'smart-context';
 * import { appContext, selectCount } from '../../context/AppContext';
 *
 * export const MyComponent = () => {
 *   // count will be returned with the type 'number' to match
 *   // the return type of the selectCount selector.
 *   const count = useContextSelector(appContext, selectCount);
 *
 *   return <div>Count: {count}</div>;
 * }
 * ```
 */
export declare function useContextSelector<T extends SmartContext, K>(
    context: React.Context<T>,
    selector: (state: any) => K
): K;

/**
 * This hook provides access to the state mutating functions defined on a smart context created
 * with the useSmartContext hook.
 * These functions allow you to update the context state in a way that optimizes re-renders.
 * @param context A React context instance created using `useSmartContext`
 * @returns An object containing all the state mutating functions defined on the provided context.
 *
 * @example
 * ```javascript
 * import { useContextSetters } from 'smart-context';
 * import { appContext } from '../../context/AppContext';
 *
 * export const ExampleComponent = () => {
 *   // setCount will be returned with the exact type that was defined
 *   // in the context's interface that extended 'SmartContext'.
 *   const { setCount } = useContextSetters(appContext);
 *
 *   return (
 *       <button onClick={() => setCount((previous) => previous + 1)}>
 *           Increment
 *       </button>
 *   );
 * };
 * ```
 */
export declare function useContextSetters<T extends SmartContext>(
    context: React.Context<T>
): Omit<T, keyof SmartContext>;
