export const sendResetEmail = async (email: string) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  };

  const res = await fetch(
    `${location.origin}/api/reset-password`,
    requestOptions
  );
  const json = await res.json();
  return json;
};
