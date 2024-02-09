interface IUserDetails {
  [key: string]: any;
}

export function getChangedUserDetails(
  originalDetails: IUserDetails,
  newDetails: IUserDetails
) {
  const changedValues: IUserDetails = {};

  for (const key in newDetails) {
    if (
      Object.prototype.hasOwnProperty.call(originalDetails, key) &&
      originalDetails[key] !== newDetails[key]
    ) {
      changedValues[key] = newDetails[key];
    }
  }

  return changedValues;
}
