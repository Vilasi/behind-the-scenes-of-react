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

This can be used by importing `memo` from React, and then just wrap our component function with the memo function - passing the component function as a callback function to memo. This works best if we store it all as a constant variable, like `const Component = memo(function Component({...}))`

Then export it at the bottom.

When a parent to this memoized component renders, memo takes a look at the memoized children's props. If those props are the same, then those respective children components will not be reexecuted. Memo only prevents component executions that would be triggered by the parent component's execution

It is better to not overuse this as it does cost a bit of performance. Instead, wrap memo around a component that's high up in the component tree - thereby preventing its children from rerendering. Think this through when considering how the state updates in your application.

Another, more classic approach is to just move the state down into a component that needs it so that its siblings don't get rerendered when something it changes triggers a state update in the parent which was previous managing the state.

### Avoiding unnecessary component executions due to "new" function props

Remember that when a function is defined inside of a component function, when that component rerenders, a "new" function is created in memory. Though the contents and appearance of this function is identical to us, it is still different in terms of strict memory equality under the hood.

So, say if a parent component defines a function a child needs, and that child is running memo to prevent unnecessary rerenders, that parent's rerender will make a "new" function in memory - thereby triggering memo to say "Oh hey there's a new prop/a prop changed," and so the child will rerender. The way to avoid this is to wrap that function (in the parent component) in the useCallback builtin React method. It makes it so that the new memory slot isn't created for the "new" function when the parent component rerenders.

Its syntax looks like this:

```
>>The original function
  function handleDecrement() {
    setCounter((prevCounter) => prevCounter - 1);
  }

 const handleDecrement = useCallback(function handleDecrement() {
    setCounter((prevCounter) => prevCounter - 1);
  }, []);
```
