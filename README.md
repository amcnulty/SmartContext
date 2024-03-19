<img src="https://res.cloudinary.com/dz54puaeo/image/upload/v1710877973/logo_m8pmcx.jpg" alt="Smart Context Hooks Logo" width="256px" height="256px" />

# Smart Context Hooks

**Boost performance in your React applications with optimized context management.**

This library provides hooks that **enhance the efficiency of React Context** by minimizing unnecessary re-renders caused by state changes. It's designed to be lightweight and non-intrusive, working seamlessly with your existing React Context setup.

**Key Features:**

-   **Reduced re-renders:** Optimize performance by selectively re-rendering components only when relevant data changes.
-   **Seamless integration:** Works seamlessly with your existing React Context implementation, requiring no major code changes.
-   **TypeScript support:** Provides full type safety for context values, enhancing type checking and code maintainability.
-   **JavaScript compatibility:** Also functions well in pure JavaScript projects.

**Not a replacement, but a valuable enhancement.** This library is not intended to replace React Context or Redux, but rather to **complement your existing state management strategy** by improving its performance.

**Live Demo:**

Check out the live demo app using smart context: [Smart Context Demo](https://amcnulty.github.io/SmartContextDemo/)

## Installation

This module is distributed via npm which is bundled with node and should be installed as one of your project's dependencies:

```bash
npm install --save smart-context-hooks
```

or using **yarn**

```bash
yarn add smart-context-hooks
```

## Usage

Below are examples of how to use the `smart-context-hooks` package in both a TypeScript and JavaScript application.

### Creating smart context

1. **Define your context interface:** (TypeScript only) Create an interface to define the type of your context state. This ensures type safety and improves code readability.

<div style="background-color: #fff3cd; color: #111; padding: 10px; border-radius: 5px;">
    <b>**Important Note:**</b> Only use smart context for state mutating functions. Don't put state values directly in context. State values will be accessed with selectors as described below.
</div>

```typescript
// TypeScript

interface AppContext extends SmartContext {
    setCount: React.Dispatch<React.SetStateAction<number>>;
    // Add other state mutating functions here
}
```

2. **Create a context provider:** Use `React.createContext` to create a context with your defined interface as the type.

```typescript
// TypeScript

export const appContext = React.createContext<AppContext>({} as AppContext);
```

_or using JavaScript_

```javascript
// JavaScript

export const appContext = React.createContext({});
```

3. **Create selectors:** Create selector functions that return specific portions of the state.

<div style="background-color: #fff3cd; color: #111; padding: 10px; border-radius: 5px;">
  <p>
    <b>**Important Note:**</b> Avoid returning the entire state object from your selector function. This can lead to <b>unnecessary re-renders</b> of components that use the selector whenever <b>any</b> part of the state changes, even if the data they rely on hasn't actually been modified.
  </p>
  <p>
    <b>Instead, consider returning only the specific data your component needs from the state.</b> This helps optimize performance and prevents unnecessary re-renders, ultimately improving your application's responsiveness.
  </p>
</div>

```typescript
// TypeScript

interface AppState {
    count: number;
}

export const selectCount = (state: AppState) => state.count;
```

_or using JavaScript_

```javascript
// JavaScript

export const selectCount = (state) => state.count;
```

4. **Create Context Provider Value With `useSmartContext`:** Initialize a context provider as you normally would except use the `useSmartContext` hook to return a value object to set as the provider's context value. The `useSmartContext` hook accepts the context's state as the first argument and the smart context object as the second argument. See more about [useSmartContext](#usesmartcontext) below in the API reference.

```typescript
// TypeScript

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
    const [count, setCount] = useState(0);

    const value = useSmartContext({ count }, { setCount });

    return <appContext.Provider value={value}>{children}</appContext.Provider>;
};
```

_or using JavaScript_

```javascript
// JavaScript

export const AppContextProvider = ({ children }) => {
    const [count, setCount] = useState(0);

    const value = useSmartContext({ count }, { setCount });

    return <appContext.Provider value={value}>{children}</appContext.Provider>;
};
```

**Complete Example**

```typescript
// TypeScript

import { ReactNode, createContext, useState } from 'react';
import { type SmartContext, useSmartContext } from 'smart-context';

interface AppContext extends SmartContext {
    setCount: React.Dispatch<React.SetStateAction<number>>;
}

export const appContext = createContext<AppContext>({} as AppContext);

interface AppState {
    count: number;
}

export const selectCount = (state: AppState) => state.count;

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
    const [count, setCount] = useState(0);

    const value = useSmartContext({ count }, { setCount });

    return <appContext.Provider value={value}>{children}</appContext.Provider>;
};
```

_or using JavaScript_

```javascript
// JavaScript

import { ReactNode, createContext, useState } from 'react';
import { SmartContext, useSmartContext } from 'smart-context';

export const appContext = createContext({});

export const selectCount = (state) => state.count;

export const AppContextProvider = ({ children }) => {
    const [count, setCount] = useState(0);

    const value = useSmartContext({ count }, { setCount });

    return <appContext.Provider value={value}>{children}</appContext.Provider>;
};
```

---

### Accessing State

Use the `useContextSelector` hook to access state data in your components. This has the benefit of only updating your component when the portion of state returned by the hook actually updates. See more about [useContextSelector](#usecontextselector) below in the API reference.

```typescript
// TypeScript or JavaScript

import { useContextSelector } from 'smart-context';
import { appContext, selectCount } from '../../context/AppContext';

export const MyComponent = () => {
    // count will be returned with the type 'number' to match
    // the return type of the selectCount selector.
    const count = useContextSelector(appContext, selectCount);

    return <div>Count: {count}</div>;
};
```

---

### Setting State

Use the `useContextSetters` hook to get any of the state mutating functions defined on the given context. See more about [useContextSetters](#usecontextsetters) below in the API reference.

```typescript
// Typescript or JavaScript

import { useContextSetters } from 'smart-context';
import { appContext } from '../../context/AppContext';

export const ExampleComponent = () => {
    // setCount will be returned with the exact type that was defined
    // in the context's interface that extended 'SmartContext'.
    const { setCount } = useContextSetters(appContext);

    return (
        <button onClick={() => setCount((previous) => previous + 1)}>
            Increment
        </button>
    );
};
```

## Convert Existing React Context To Use Smart Context
Details coming soon

## API Reference

### `useSmartContext`

**Description**

This hook creates a smart context value that provides efficient state management and optimization features within a React application. It enables precise control over state updates and re-renders within the context, promoting performance and flexibility.

**Arguments**

|Name|Type|Description|
|-|-|-|
|`state`|object|An object containing the state values that can be accessed using selectors.|
|`setters`|object|An object containing functions that update specific parts of the state object. These functions serve as the primary mechanism for state mutations within the context.|

**Returns**

A `SmartContext` object to be passed to the value prop of your context provider.

---
### `useContextSelector`

**Description**

This hook efficiently retrieves a portion of state from a smart context using a selector function. It optimizes component re-renders by only triggering them when the selected value genuinely changes, preventing unnecessary updates and enhancing performance.

**Arguments**

|Name|Type|Description|
|-|-|-|
|`context`|T extends `SmartContext`|A React context instance created using `useSmartContext`|
|`selector`|(state: any) => K|A function that takes the context state as input and returns the specific value or slice of state you want to access.|

**Returns**

The selected state value from the context, as determined by the provided selector function.

---
### `useContextSetters`

**Description**

This hook provides access to the state mutating functions defined on a smart context created with the useSmartContext hook. These functions allow you to update the context state in a way that optimizes re-renders.

**Arguments**

|Name|Type|Description|
|-|-|-|
|`context`|T extends `SmartContext`|A React context instance created using `useSmartContext`|

**Returns**

An object containing all the state mutating functions defined on the provided context.
