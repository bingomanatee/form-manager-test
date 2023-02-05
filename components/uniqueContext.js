
const usedContexts = new Map();

export default (name) => {
  if (usedContexts.has(name)) {
    let n = 2;
    do {
      const ctx = `${name}.${n}`;
      if (!usedContexts.has(ctx)) {
        return ctx;
      }
      n += 1;
    } while(true);
  }
  return name;
}
