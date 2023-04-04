const map = (x: number, a: number, b: number, c: number, d: number) =>
    (x - a) * (d - c) / (b - a) + c;

export default map;
