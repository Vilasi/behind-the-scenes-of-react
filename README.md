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

Remember that when a function is defined inside of a component function, when that component rerenders, a "new" function is created in memory. Though the contents and appearance of this function are identical to us, it is still different in terms of strict memory equality under the hood.

So, say if a parent component defines a function a child needs, and that child is running memo to prevent unnecessary rerenders, that parent's rerender will make a "new" function in memory - thereby triggering memo to say "Oh hey there's a new prop/a prop changed," and so the child will rerender. The way to avoid this is to wrap that function (in the parent component) in the useCallback builtin React method. This makes it so that the new memory slot isn't created for the "new" function when the parent component rerenders.

Its syntax looks like this:

```
>>The original function<<
  function handleDecrement() {
    setCounter((prevCounter) => prevCounter - 1);
  }

 const handleDecrement = useCallback(function handleDecrement() {
    setCounter((prevCounter) => prevCounter - 1);
  }, []);
```

## Avoiding unnecessary non-component function executions

Inside of our react component files, often there wil be functions performing calculations given state, or some other changing value. These functions, as one might imagine, can be quite computationally expensive - things which could bog down the application if the component file is being reexecuted a lot. If this function is something that only really needs to be reevaluated when its input values change, we can memoize it with another react hook: `useMemo`. This way, our helper functions will only rerun when their input values change.

Remember: `memo` is wrapped around component functions. `useMemo` is wrapped around normal functions

`useMemo` should only really be used if you have a rather complex function that you want to prevent from reexecuting all that time.

Example:

```
>>Original function call inside the component<<

const initialCountIsPrime = isPrime(initialCount);

>>Function wrapped with useMemo:<<
const initialCountIsPrime = useMemo(() => isPrime(initialCount), [initialCount]);
```

useMemo, like many other react hooks, wraps our function in useMemo and passes an anonymous function - therein calling our wrapped function. It then has a dependencies array, in which we place any of our values to compare. useMemo will only reexecute the wrapped function if any of the dependencies being used/looked at change.

Don't overuse this constantly, because the extra check does take up some performance. Use it more when you have more complex/expensive code that doesn't need to be constantly reexecuted.

## The Virtual DOM vs the Actual DOM

React creates a sleak copy of the actual HTML DOM, called the virtual DOM. Through whatever coding magic they have going on behind the scenes, whenever changes to components are made - rerenders, etc - React will create a virtual DOM copy, compare it with the previous one, and then only update the actual DOM in such a way as to minimize what actually gets touched/changed - allowing greater efficiency.

It's for this reason why it's best to never reach out and work directly with the actual DOM (through JS means) when working with React. Doing so will always be less efficient than working with React's declarative virtual DOM.

That way, even though a component function may be reexecuted, its JSX being reevaluated/created, etc, that doesn't mean that all of that JSX is recreated and reinserted into the actual DOM. ONLY things that have changed are updated to the actual DOM. That virtualDOM snapshot, created when a component rerenders, state changes, etc, is compared with the previous virtualDOM snapshot, and any changes are then implemented into the actual DOM - saving a ton of performance and working as efficiently as possible.

Because, apparently, actual DOM updates are really performance/computationally intensive.

## React Keys - the independent nature of react components

When a component is created in which some state is being created/managed, that state is unique to that instance of the component. That is, if I reuse that component - multiple times - each one of those individual instances will have its own state, even despite the state being named the same thing/managing the same conceptual code inside fo that component. That is, each component is an island unto itself - only connecting with other components through the component tree, and the other means we've looked at like context.

PSYKE THAT'S A LIE!!

Partially. React also tracts state through positioning of the component within the component tree. This means that when determining which component is to receive which info, which state, it is not only the uniqueness of the component, but also its indexed position within the component tree. Usually, you won't see this coming up or being a problem, BUT when we're working with things like dynamically generated lists/components, it can be a big problem. Because, if you have a bunch of components being generated, each with its own state, and the generated list can change, the position of a specific component can change - move down the tree - and the state that would belong to it will now belong to the component which now holds its previous position.

This is why React includes the Key prop - which must be unique to each component. It allows React to more precisely keep track of which component is which - which component receives what state. This is where doing things like keeping track of state through objects with unique IDs is handy, similar to the concept of them in Databases.
Hell, most of the time our data will actually be coming from a database, so we can just use those IDs for the key - obviously lol

Another reason using these unique keys is a good idea is regarding that virtualDOM we mentioned earlier. Therein, when we're just using something that changes like an index, the new virtualDOM snapshot will look at the new keys for the whole index list and see that it's changed, thereby updating the entire dynamically generated content to the real DOM. This is inefficient. Giving each of the dynamically generated items their own unique key will ensure that each virtualDOM snapshot matches from render to render - only updating or adding to the real DOM when a new unique value is generated.

### Using keys to reset components

Keys can also be used to reset components. If we have a child component which sets a state based on the value of a prop being passed to it, that state value will only be set on the initial render of the child component. That is, if the parent component then passes a new value to the prop, the state of the child - set initially from that original prop value - will not be automatically updated. The state will still hold the value it was originally set with at the outset. Sometimes, we want the behavior to be such that the state is updated with the updated prop value when it is sent from the parent.

This can be accomplished using the Key.

When a components key changes - any component - this will force a rerender of the component. If you will, it is as though React throws away the old component (with the old key value) and renders a whole new component as though it were updated/set for the first time. This way, we can use the key to force the child component's state to reflect the new prop value.

## State updating, and multiple state updates being batched together

In react, state updates are scheduled. Meaning, when you call a state update in one line, and then try to instantly use that state value in the next line, it won't yet have that updated value. That's why it's necessary to use the state updating callback function method as we've used, which receives as an argument the most up-to-date state snapshot.

An important thing to remember regarding updating the state multiple times within a single component: Though triggering state update does indeed trigger the component to rerender, calling multiple state updating functions will not cause the component to rerender multiple times. Instead, the state updates are batched together, and all run together. That is, despite multiple state updates, even those that update the same state value, the component will still only reexecute once - reflecting the results of all of the state updating functions.
