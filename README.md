# The order in which react renders components

React, fundamentally, just translates its code - its JSX code - into vanilla JavaScript code. Everything React does could be done with Vanilla JS.

First, in the main.jsx file, a series of methods are called which start by rendering the App component to the screen - to the DOM. This renders the returned JSX of the App component to the screen. In doing so, React will render things line by line. When it encounters a custom component, it will stop executing the JSX in the App component, and go down a level to execute the JSX inside the custom component.

If the custom component has a prop (which is just a value), React will forward that prop down to the child component, which will then be used during the rendering/processing/translating of that component's JSX code into Vanilla JS.

In the React developer tools, the Profiler can be used to get a picture of which components were rendered in which order when the application is interacted with.

When a component is executed (say, in the event of a state changing) all of its child components will also be reexecuted.

## Avoiding unnecessary component executions

There is a way to avoid unnecessary reexecutions of child components in React.

This is by means of the builtin `memo` function

This lets us bypass component reexecution when a component's props are unchanged
