import { Button, ButtonProps } from "@nextui-org/button";
import React, { ReactNode } from "react";

interface Props extends ButtonProps {
  children: ReactNode;
}
export const PrimaryButton = ({ children, className, ...rest }: Props) => {
  return (
    <Button disableRipple className="btn w-full rounded-sm" {...rest}>
      {children}
    </Button>
  );
};
