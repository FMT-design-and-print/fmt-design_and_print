import { Button, ButtonProps } from "@nextui-org/button";
import React, { ReactNode } from "react";

interface Props extends ButtonProps {
  children: ReactNode;
}
export const PrimaryButton = ({ children, ...rest }: Props) => {
  return (
    <Button className="btn rounded-sm" {...rest}>
      {children}
    </Button>
  );
};
