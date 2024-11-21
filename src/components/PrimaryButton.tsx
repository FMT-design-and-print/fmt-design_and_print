import { Button, ButtonProps } from "@mantine/core";
import React, { ReactNode } from "react";

interface Props extends ButtonProps {
  children: ReactNode;
  type?: "button" | "submit" | "reset" | undefined;
}
export const PrimaryButton = ({
  children,
  type = "button",
  ...rest
}: Props) => {
  return (
    <Button className="btn" type={type} {...rest}>
      {children}
    </Button>
  );
};
