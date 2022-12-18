
// Todo: replace this garbage…
const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj))

export default deepClone;
