export const DATE_PRESETS = {
  today: {
    label: "Today",
    getValue: () => {
      const today = new Date();
      return [today, today] as [Date, Date];
    },
  },
  threeDays: {
    label: "Last 3 Days",
    getValue: () => {
      const today = new Date();
      const threeDaysAgo = new Date(today);
      threeDaysAgo.setDate(today.getDate() - 3);
      return [threeDaysAgo, today] as [Date, Date];
    },
  },
  thisWeek: {
    label: "This Week",
    getValue: () => {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      return [startOfWeek, today] as [Date, Date];
    },
  },
  last30Days: {
    label: "Last 30 Days",
    getValue: () => {
      const today = new Date();
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);
      return [thirtyDaysAgo, today] as [Date, Date];
    },
  },
  thisMonth: {
    label: "This Month",
    getValue: () => {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      return [startOfMonth, today] as [Date, Date];
    },
  },
  previousMonth: {
    label: "Previous Month",
    getValue: () => {
      const today = new Date();
      const startOfPrevMonth = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1
      );
      const endOfPrevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      return [startOfPrevMonth, endOfPrevMonth] as [Date, Date];
    },
  },
  thisYear: {
    label: "This Year",
    getValue: () => {
      const today = new Date();
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      return [startOfYear, today] as [Date, Date];
    },
  },
  lastYear: {
    label: "Last Year",
    getValue: () => {
      const startOfLastYear = new Date(new Date().getFullYear() - 1, 0, 1);
      const endOfLastYear = new Date(new Date().getFullYear() - 1, 11, 31);
      return [startOfLastYear, endOfLastYear] as [Date, Date];
    },
  },
  allTime: {
    label: "All Time",
    getValue: () => {
      return [new Date(2020, 0, 1), new Date()] as [Date, Date];
    },
  },
};
