type RunState<S, A> = (s: S) => [A, S];
type Unit = void;

class State<S, A> {

  runState: RunState<S, A>;
  constructor(runState: RunState<S, A>) {
    this.runState = runState;
  }

  map<B>(f: (p: A) => B): State<S, B> {
    const runState: RunState<S, B> = (s: S) => {
      const [a, s1] = this.runState(s);
      const b = f(a);
      return [b, s1];
    }
    return new State(runState);
  }

  static pure<S, A>(a: A): State<S, A> {
    const runState: RunState<S, A> = (s: S) => [a, s];
    return new State(runState);
  }

  ap<B>(fa: State<S, (x: A) => B>) {
    const runState: RunState<S, B> = (s: S) => {
      const [f, s1] = fa.runState(s);
      const [a, s2] = this.runState(s1)
      return [f(a), s2];
    }
    return new State(runState);
  }

  static return = State.pure;

  bind<B>(f: (a: A) => State<S, B>) {
    const runState: RunState<S, B> = (s: S) => {
      const [a, s1] = this.runState(s);
      return f(a).runState(s1);
    }
    return new State(runState);
  }

}

