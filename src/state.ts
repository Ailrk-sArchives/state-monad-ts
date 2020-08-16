export type RunState<S, A> = (s: S) => [A, S];
export type Unit = null;
export const unit: Unit = null;

export class State<S, A> implements PromiseLike<A> {

  readonly [Symbol.toStringTag] = "StateMoand";

  runState: RunState<S, A>;
  execState: (s: S) => S;
  evalState: (s: S) => A;
  constructor(runState: RunState<S, A>) {
    this.runState = runState;
    this.execState = (s: S) => this.runState(s)[1];
    this.evalState = (s: S) => this.runState(s)[0];
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

  then = this.bind;

  get() {
    return this;
  }

  put(s: S) {
    return new State(() => [unit, s]);
  }

  modify(f: (s: S) => S) {
    return new State<S, Unit>(s => [unit, f(s)]);
  }
}
