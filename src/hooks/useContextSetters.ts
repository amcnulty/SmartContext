import React, { useMemo } from 'react';
import { SmartContext } from '../types/types';

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
export const useContextSetters = <T extends SmartContext>(
    context: React.Context<T>
) => {
    const store: any = React.useContext(context);
    if (!store.getState()) {
        throw new Error(
            'The context provided to useContextSelector must be from within the appropriate provider. Check to make sure you wrapped your component in a Provider tag for the context which you are trying to use.'
        );
    }

    return useMemo(() => {
        const { getState, subscribe, ...rest } = store;
        return rest as Omit<T, keyof SmartContext>;
    }, [store]);
};
