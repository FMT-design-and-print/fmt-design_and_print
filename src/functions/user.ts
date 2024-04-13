export function getChangedDetails2<T>(
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

export function getChangedDetails<T>(obj1: T, obj2: T): Partial<T> {
  const difference: Partial<T> = {};

  for (const key in obj1) {
    if (obj1[key as keyof T] !== obj2[key as keyof T]) {
      difference[key as keyof T] = obj1[key as keyof T];
    }
  }

  for (const key in obj2) {
    if (obj2[key as keyof T] !== obj1[key as keyof T]) {
      difference[key as keyof T] = obj2[key as keyof T];
    }
  }

  return difference;
}
