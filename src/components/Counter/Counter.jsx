import { useState, memo, useCallback, useMemo } from 'react';

import IconButton from '../UI/IconButton.jsx';
import MinusIcon from '../UI/Icons/MinusIcon.jsx';
import PlusIcon from '../UI/Icons/PlusIcon.jsx';
import CounterOutput from './CounterOutput.jsx';
import CounterHistory from './CounterHistory.jsx';
import { log } from '../../log.js';

function isPrime(number) {
  log('Calculating if is prime number', 2, 'other');

  if (number <= 1) {
    return false;
  }

  const limit = Math.sqrt(number);

  for (let i = 2; i <= limit; i++) {
    if (number % i === 0) {
      return false;
    }
  }

  return true;
}

const Counter = memo(function Counter({ initialCount }) {
  log('<Counter /> rendered', 1);

  const initialCountIsPrime = useMemo(
    () => isPrime(initialCount),
    [initialCount]
  );

  // const [counter, setCounter] = useState(initialCount);

  const [counterChanges, setCounterChanges] = useState([
    { value: initialCount, id: Math.random * 100 },
  ]);

  const currentCounter = counterChanges.reduce((prevCounter, counterChange) => {
    console.log(prevCounter, counterChange.value);
    return prevCounter + counterChange.value;
  }, 0);

  // Note that this useCallback method - which stores this function as its own memory, preventing new functions being created in memory
  //  needs a dependencies array, in which we would put any states or prop that are being used inside the function
  const handleDecrement = useCallback(function handleDecrement() {
    // setCounter((prevCounter) => prevCounter - 1);
    setCounterChanges((prevCounterChanges) => [
      { value: -1, id: Math.random() * 100 },
      ...prevCounterChanges,
    ]);
  }, []);

  const handleIncrement = useCallback(function handleIncrement() {
    // setCounter((prevCounter) => prevCounter + 1);
    setCounterChanges((prevCounterChanges) => [
      { value: 1, id: Math.random() * 100 },
      ...prevCounterChanges,
    ]);
  }, []);

  return (
    <section className="counter">
      <p className="counter-info">
        The initial counter value was <strong>{initialCount}</strong>. It{' '}
        <strong>is {initialCountIsPrime ? 'a' : 'not a'}</strong> prime number.
      </p>
      <p>
        <IconButton icon={MinusIcon} onClick={handleDecrement}>
          Decrement
        </IconButton>
        <CounterOutput value={currentCounter} />
        <IconButton icon={PlusIcon} onClick={handleIncrement}>
          Increment
        </IconButton>
      </p>

      <div>
        <CounterHistory history={counterChanges} />
      </div>
    </section>
  );
});

export default Counter;
