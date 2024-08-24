import { PaymentDetailsCard } from "@/components/PaymentDetails/PaymentDetailsCard";
import { ShippingAddress } from "@/components/ShippingAddress";
import { shippingFeeByRegion } from "@/constants/gh-regions";
import { IShippingAddress } from "@/types";
import { Card, Title } from "@mantine/core";
import React, { useState } from "react";

interface Props {
  quoteId: string;
  subTotal: number;
  clientName?: string;
  contact?: string;
  email?: string;
}

const initialAddress: IShippingAddress = {
  contactName: "",
  phone1: "",
  phone2: "",
  email: "",
  address: "",
  town: "",
  region: "",
  country: "Ghana",
};

export const QuotePayment = ({
  quoteId,
  subTotal,
  clientName,
  contact,
  email,
}: Props) => {
  const [shippingAddress, setShippingAddress] = useState<IShippingAddress>({
    ...initialAddress,
    contactName: clientName || initialAddress.contactName,
    email: email || initialAddress.email,
    phone1: contact || initialAddress.phone1,
  });
  const [note, setNote] = useState("");
  const handleOnPaymentSuccess = (ref: any) => {
    console.log(quoteId);
    console.log("ref", ref);
  };

  return (
    <div>
      <Title order={2} py="sm">
        Make Payment
      </Title>
      <PaymentDetailsCard
        subTotal={subTotal}
        deliveryFee={shippingFeeByRegion[shippingAddress.region]}
        note={note}
        isLoading={false}
        shippingAddress={{
          contactName: shippingAddress.contactName,
          phone1: shippingAddress.phone1,
          country: shippingAddress.country,
          address: shippingAddress.address,
          region: shippingAddress.region,
        }}
        onPaySuccess={handleOnPaymentSuccess}
        setNote={setNote}
        style={{ bg: "gray.1" }}
      />
      <Card withBorder my="md">
        <Title order={3}>Shipping Address</Title>
        <ShippingAddress
          contactName={shippingAddress.contactName}
          phone1={shippingAddress.phone1}
          phone2={shippingAddress.phone2}
          email={shippingAddress.email}
          address={shippingAddress.address}
          town={shippingAddress.town}
          region={shippingAddress.region}
          update={(key, value) =>
            setShippingAddress((prev) => ({ ...prev, [key]: value }))
          }
        />
      </Card>
    </div>
  );
};
