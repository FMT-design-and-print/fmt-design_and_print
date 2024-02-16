export function getChangedDetails<T>(
  originalDetails: T,
  newDetails: T
): Partial<T> {
  const changedValues: Partial<T> = {};

  for (const key in newDetails) {
    if (
      Object.prototype.hasOwnProperty.call(originalDetails, key) &&
      originalDetails[key as keyof T] !== newDetails[key as keyof T]
    ) {
      changedValues[key as keyof T] = newDetails[key as keyof T];
    }
  }

  return changedValues;
}
