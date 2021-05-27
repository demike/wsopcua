// promisified setTimeout
export function timeout(duration: number) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}
