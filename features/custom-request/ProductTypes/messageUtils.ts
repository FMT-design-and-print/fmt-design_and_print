export const createOrderMessage = (orderId: string) => {
  const subject = `Custom Order Request (${orderId})`;
  const content = `Custom order with reference number ${orderId} has been requested.`;

  return { subject, content };
};
