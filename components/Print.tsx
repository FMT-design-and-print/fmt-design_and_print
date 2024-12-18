import { Button, ButtonProps } from "@mantine/core";
import { ReactElement, ReactNode, cloneElement, useRef } from "react";
import { FaPrint } from "react-icons/fa6";
import { useReactToPrint } from "react-to-print";

interface Props {
  children: ReactNode;
  triggerBtn?: ReactElement;
  btnStyles?: ButtonProps;
}

export const Print = ({ children, triggerBtn, btnStyles }: Props) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ contentRef });

  return (
    <div>
      <div ref={contentRef} className="printable-content">
        {children}
      </div>

      {triggerBtn ? (
        cloneElement(triggerBtn, { onClick: handlePrint })
      ) : (
        <Button
          size="xs"
          variant="outline"
          color="gray"
          rightSection={<FaPrint />}
          onClick={() => handlePrint()}
          {...btnStyles}
        >
          Print
        </Button>
      )}
    </div>
  );
};
