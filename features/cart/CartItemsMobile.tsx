import { useCart } from "@/store/cart";
import { useCheckout } from "@/store/checkout";
import { ICartItem } from "@/types";
import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Group,
  NumberInput,
  Text,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { useArtworkCount } from "@/hooks/useArtworkCount";

interface Props {
  cartItems: ICartItem[];
}
export const CartItemsMobile = ({ cartItems }: Props) => {
  return (
    <Box hiddenFrom="sm">
      {cartItems.map((item) => (
        <CartItem key={item.id} cartItem={item} />
      ))}
    </Box>
  );
};

interface ICartItemProps {
  cartItem: ICartItem;
}

const CartItem = ({ cartItem }: ICartItemProps) => {
  const { push } = useRouter();
  const { removeItem, increaseQuantity, decreaseQuantity } = useCart(
    (state) => state
  );
  const { setItems } = useCheckout((state) => state);
  const artworkCount = useArtworkCount(cartItem);

  const handleCheckout = () => {
    setItems([cartItem]);
    return push("/checkout");
  };

  return (
    <Card withBorder my="sm">
      <Group gap="sm" wrap="nowrap">
        <Avatar size="lg" src={cartItem.image} radius="xs" />

        <div>
          <Text fz="sm" fw={500} lineClamp={2} mb="5px">
            {cartItem.title}
          </Text>

          <Group gap="xs">
            {cartItem.color && (
              <Group gap="5px">
                <Text fz="xs" c="dimmed">
                  Color:
                </Text>
                <Avatar src={cartItem.color?.image} size="xs" />
              </Group>
            )}
            {cartItem.size && (
              <Text fz="xs" c="dimmed">
                Size: {cartItem.size}
              </Text>
            )}
            {cartItem.isCustomizable &&
              (cartItem.hasArtworkFiles || cartItem.hasArtworkFilesMap) && (
                <Text fz="xs" c="dimmed">
                  Artworks: {artworkCount}
                </Text>
              )}
            <Group>
              <Text fz="xs" c="dimmed">
                Price:
              </Text>
              <Text fz="xs" fw={500}>
                GHS {cartItem.price * cartItem.quantity}
              </Text>
            </Group>
          </Group>
        </div>
      </Group>

      <Divider />
      <Group justify="space-between" pt="xs">
        <Group>
          <Button
            onClick={() => decreaseQuantity(cartItem.id)}
            variant="light"
            color="gray"
            size="xs"
          >
            -
          </Button>
          <NumberInput
            w={40}
            placeholder="1"
            value={cartItem.quantity}
            min={1}
            hideControls
            size="xs"
          />
          <Button
            onClick={() => increaseQuantity(cartItem.id)}
            variant="light"
            color="gray"
            size="xs"
          >
            +
          </Button>
        </Group>

        <Group justify="flex-end">
          <Button
            onClick={() => removeItem(cartItem.id)}
            variant="outline"
            color="gray"
            size="compact-sm"
          >
            <Text size="xs" component="span">
              Remove
            </Text>
          </Button>
          <Button onClick={handleCheckout} className="btn" size="compact-sm">
            <Text size="xs" component="span">
              Buy Now
            </Text>
          </Button>
        </Group>
      </Group>
    </Card>
  );
};
