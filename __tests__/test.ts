import {State} from '../src/state';

it("map", () => {
  const s = "1";
  const state = new State<string, number>(s => {
    return [Number.parseInt(s), s + "1"];
  });

  state.map(s => s + 1);

  expect(state.execState(s)).toBe("11");
});

it("pure", () => {
  const a = 1;
  const state = State.pure<string, number>(a);
  expect(state.evalState("")).toBe(1);
})

it("ap", () => {
  const fstate = new State<string, (a: number) => boolean>(s => {
    const s1 = s + "0";
    const f = (a: number) => a > 10;
    return [f, s1];
  });
  const state = new State<string, number>(s => {
    return [Number.parseInt(s), s + "1"];
  });

  const [a, s] = state.ap(fstate).runState("1");
  expect(s).toBe("101");
  expect(a).toBe(false);
})

