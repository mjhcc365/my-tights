// import
import { Button } from "antd";
import { observer } from "mobx-react-lite";
import { action, makeAutoObservable, makeObservable, observable } from "mobx";
import { useEffect, useRef, createContext, useContext } from "react";

class CounterStore {
  // 数值状态
  count = 10;
  constructor() {
    // makeAutoObservable(this) 也好使
    makeObservable(this, {
      count: observable,
      increment: action,
      reset: action,
    });
  }
  // 使数值状态加一
  increment() {
    this.count += 1;
  }
  // 重置数值状态
  reset() {
    this.count = 0;
  }
}

const store = new CounterStore();

const TimerContext = createContext<CounterStore>(null);

const ValueCom = observer(() => {
  const store = useContext(TimerContext);
  return <div>{store.count}</div>;
});

const Option = observer(() => {
  const store = useContext(TimerContext);
  return (
    <div>
      <Button
        onClick={() => {
          store.increment();
        }}
      >
        +
      </Button>
      <Button
        onClick={() => {
          store.reset();
        }}
      >
        reset
      </Button>
    </div>
  );
});

const Counter = observer(() => {
  return (
    <TimerContext.Provider value={store}>
      <ValueCom />
      <Option />
    </TimerContext.Provider>
  );
});

export default Counter;
