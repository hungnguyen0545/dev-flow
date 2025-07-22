## State Management

<h3>What’s State Management</h3>

- It is like keeping track of everything happening in your application.

- For instance: Imagine you're playing a game and need to remember your score, level, and items collected. State management is like having a scoreboard and inventory list to `track all this information` so you can play smoothly. It's about `organizing and updating data` so your app knows what's happening and can react accordingly.

<h3>When use it?</h3>

- Before using any state management libary such as: [Redux-toolkit](https://redux-toolkit.js.org/) or [Zustand](https://zustand.docs.pmnd.rs/). You need to answer some questions for yourself:
  - Do we even need state management? (WHY)

  - What kind of data are we displaying in this application? (Your answer here)

  - What kind of data is repeated on different pages? (Your answer here)

  - Is there any specific data being used across the entire application? (Your answer here)

<h3>Types</h3>

<b>Local State Management</b>

- It typically involves `managing the data within a single` component or module of an application.

- It is `specific` to that component and is `not directly accessible `or modifiable `by other parts `of the application `unless explicitly passed down as props` or through other means.

For Example:

```jsx
import React, { useState } from "react";

const Counter = () => {
  // Local state variable 'count'
  const [count, setCount] = useState(0);

  // Update local state 'count'
  const increment = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
};

export default Counter;
```

<b>Global State Management</b>

- It involves `managing data` that needs to be `accessed and modified by multiple components` across the application.

- This global state is typically `stored in a centralized location`, such as a `global store` or `context`

An example of global state management using `Context API`

```jsx
// CunterProvider.jsx

import React, { createContext, useContext, useState } from "react";

// Create a global context
const CounterContext = createContext();

// Create a provider to manage global state
const CounterProvider = ({ children }) => {
  // Global state variable 'count'
  const [count, setCount] = useState(0);

  // Update global state 'count'
  const increment = () => {
    setCount(count + 1);
  };

  return (
    <CounterContext.Provider value={{ count, increment }}>
      {children}
    </CounterContext.Provider>
  );
};

// Custom hook to access global state and updater
const useCounter = () => {
  return useContext(CounterContext);
};

export { CounterProvider, useCounter };
```

```jsx
// App.jsx

import Counter from "./Counter";
import { CounterProvider } from "./CounterProvider";

const App = () => {
  return (
    <CounterProvider>
      <div className="App">
        <h1>Counter App</h1>
        <Counter />
      </div>
    </CounterProvider>
  );
};

export default App;
```

```jsx
// Counter.jsx

import { useCounter } from "./CounterProvider";

// Component using global state
const Counter = () => {
  // Access global state and updater
  const { count, increment } = useCounter();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
};
```

<h3>Top Global State Management Libraries</h3>

- [Context API](https://react.dev/learn/passing-data-deeply-with-context): Context API `shares data across` your app without needing extra libraries.

- [Redux](https://redux-toolkit.js.org/): Redux helps `organize` your app's data in one place `using actions and reducers`.

- [Zustand](https://zustand.docs.pmnd.rs/): Zustand is a `simple way` to handle your app's data `using React hooks`.

- [Recoil](https://recoiljs.org/): Recoil makes `managing data` in React easier with a`toms and derived states`.

- [MobX](https://mobx.js.org/README.html): MobX makes it easy to watch and update your data without extra setup.

Note: It's important to understand that there `isn't a single "best" library` among the others. Each one `offers` a `unique approach` to state management and` addresses different problems` more effectively.

<h3>State Management in Next</h3>
