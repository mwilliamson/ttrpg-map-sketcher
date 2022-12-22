export default function slidingPairs<T>(values: ReadonlyArray<T>): ReadonlyArray<[T, T]> {
  const result: Array<[T, T]> = new Array(Math.max(0, values.length - 1));

  for (let index = 0; index + 1 < values.length; index++) {
    result[index] = [values[index], values[index + 1]];
  }

  return result;
}
