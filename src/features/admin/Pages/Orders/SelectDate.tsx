import { areDatesEqual } from "@/functions";
import { getFormattedDaysToFuture } from "@/functions/durations";
import { Badge, Group, Stack } from "@mantine/core";
import { DatePicker, DatePickerInput, DatePickerProps } from "@mantine/dates";
import { Dispatch, SetStateAction } from "react";

const now = new Date();

interface Props {
  value: Date | null;
  setValue: Dispatch<SetStateAction<Date | null>>;
}

export function SelectDate({ value, setValue }: Props) {
  const getDayProps: DatePickerProps["getDayProps"] = (date) => {
    if (areDatesEqual(value!, date)) {
      return {
        style: {
          backgroundColor: "var(--primary-300)",
          color: "var(--mantine-color-white)",
        },
      };
    }

    return {};
  };

  return (
    <Stack>
      <DatePicker
        defaultDate={now}
        value={value}
        onChange={setValue}
        minDate={now}
        getDayProps={getDayProps}
        bg="white"
        style={{ overflowX: "auto" }}
        w="100%"
        size="xs"
      />
      <Group align="center" mt={{ base: "md", sm: "0" }}>
        <DatePickerInput
          miw={200}
          value={value}
          onChange={setValue}
          valueFormat="ddd, MMM DD YYYY"
          placeholder="Selected fulfillment date"
          readOnly
        />
        {value && (
          <Badge variant="light" color="teal">
            {getFormattedDaysToFuture(value)}
          </Badge>
        )}
      </Group>
    </Stack>
  );
}
