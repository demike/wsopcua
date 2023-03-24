export function stringIsValidUrl(s: string) {
  try {
    new URL(s);
    return true;
  } catch (err) {
    return false;
  }
}
