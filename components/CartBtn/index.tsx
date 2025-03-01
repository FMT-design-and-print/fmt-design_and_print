import { Button, ButtonProps, MantineSize } from "@mantine/core";
import React from "react";
import { BsCartPlus, BsCartX } from "react-icons/bs";
import classes from "./Style.module.css";
import { useCart } from "@/store/cart";

interface Props extends ButtonProps {
  handler: () => void;
  productId: string;
  size?: MantineSize;
  showLabel?: boolean;
  disableRemove?: boolean;
  text?: string;
}
export const CartBtn = ({
  handler,
  showLabel = true,
  disableRemove,
  size,
  productId,
  text,
  ...props
}: Props) => {
  const { items, removeItem } = useCart((state) => state);
  const isProductInCart = items.find((item) => item.id === productId);

  const removeFromCart = () => {
    removeItem(productId);
  };

  if (isProductInCart) {
    return (
      <Button
        size={size || "md"}
        className={classes["cart-remove-btn"]}
        leftSection={showLabel ? <BsCartX /> : ""}
        onClick={removeFromCart}
        mx={4}
        title="remove from cart"
        opacity={disableRemove ? 0.3 : 1}
        disabled={disableRemove}
        {...props}
      >
        {showLabel ? "Remove from cart" : <BsCartX />}
      </Button>
    );
  }

  return (
    <Button
      size={size || "md"}
      className={classes["cart-add-btn"]}
      leftSection={showLabel ? <BsCartPlus /> : ""}
      onClick={handler}
      mx={4}
      title="add to cart"
      {...props}
    >
      {showLabel ? text || "Add to cart" : <BsCartPlus />}
    </Button>
  );
};
