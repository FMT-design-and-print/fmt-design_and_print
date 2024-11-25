/* eslint-disable @typescript-eslint/no-unused-vars */
export enum Channels {
  // admin
  AdminOrders = "ADMIN_ORDERS_CHANGES",
  AdminCustomOrders = "ADMIN_CUSTOM_ORDERS_CHANGES",
  OrdersCount = "ORDERS_COUNT_CHANGES",
  CustomOrdersCount = "CUSTOM_ORDERS_COUNT_CHANGES",
  OrdersCountByStatus = "ORDERS_COUNT_BY_STATUS_CHANGES",
  CustomOrdersCountByStatus = "CUSTOM_ORDERS_COUNT_BY_STATUS_CHANGES",

  // use account
  OrdersUpdate = "ORDERS_UPDATE_ACTION",
  CustomOrdersUpdate = "CUSTOM_ORDERS_UPDATE_ACTION",
}
