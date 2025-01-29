import { useQuoteDetails } from "@/app/(quotes-layout)/QuoteTypeProvider";
import { Button, ButtonProps, Group, Text } from "@mantine/core";
import { ReactElement, ReactNode, cloneElement, useRef } from "react";
import { FaPrint } from "react-icons/fa6";
import { useReactToPrint } from "react-to-print";
import { FMTLogo } from "./FMTLogo";

interface Props {
  children: ReactNode;
  triggerBtn?: ReactElement;
  btnStyles?: ButtonProps;
}

export const Print = ({ children, triggerBtn, btnStyles }: Props) => {
  const { title } = useQuoteDetails();
  const contentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: title,
  });

  return (
    <div>
      <div ref={contentRef} className="printContent">
        <div className="printable-content">
          <div className="print-footer">
            <Group gap="sm" justify="center" align="center">
              <FMTLogo image="https://res.cloudinary.com/dnbmynikp/image/upload/v1703264782/FMT/logo1_tpiges.png" />
              <Text size="xs" c="dimmed">
                •
              </Text>
              <Text size="xs" c="dimmed">
                contact@fmtdesignprint.com
              </Text>
              <Text size="xs" c="dimmed">
                •
              </Text>
              <Text size="xs" c="dimmed">
                +233559617959
              </Text>
            </Group>
          </div>
          {children}
        </div>
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
