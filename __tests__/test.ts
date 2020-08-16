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

it("bind", () => {
  const f = (a: number) => new State<string, boolean>(s => {
    return [Number.parseInt(s) <= 20, s + "1"];
  });
  const state = new State<string, number>(s => {
    return [Number.parseInt(s), s + "0"];
  });

  const [a, s] = state.bind(f).runState("1");
  expect(a).toBe(true);
  expect(s).toBe("101");
})

it("get", () => {
  const f = (num: number) => new State<string, number>(s => {
    return [Number.parseInt(s), s + num.toString()];
  });

  const [a, s] =
    f(1)
      .get()
      .bind(f)
      .runState("1");

  expect(a).toBe(11);
  expect(s).toBe("111");
})

it("put", () => {
  const state = new State<string, number>(s => {
    return [Number.parseInt(s), s + "0"];
  });
  const s = state.put("1").execState("1");
  expect(s).toBe("1");
})

it("modify", () => {
  const state = new State<string, number>(s => {
    return [Number.parseInt(s), s + "0"];
  });
  const s = state.modify(s => s + "0").execState("1");
  expect(s).toBe("1");

})
