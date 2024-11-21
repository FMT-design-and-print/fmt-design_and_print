import { useFavorites } from "@/store/favorites";
import { ActionIcon } from "@mantine/core";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import classes from "./ProductCard.module.css";

interface Props {
  productId: string;
  title: string;
  image: string;
  price: number;
}

export const FavoriteBtn = ({ productId, title, image, price }: Props) => {
  const { items, addItem, removeItem } = useFavorites();

  const isFavorite = items.some((item) => item.id === productId);

  return (
    <div>
      {isFavorite ? (
        <ActionIcon
          onClick={() => removeItem(productId)}
          className={classes.favIcon}
          size={36}
          variant="transparent"
          aria-label="Remove from favorites"
        >
          <IconHeartFilled />
        </ActionIcon>
      ) : (
        <ActionIcon
          variant="transparent"
          aria-label="Add to favorites"
          className={classes.favIcon}
          size={36}
          onClick={() =>
            addItem({
              id: productId,
              title,
              image,
              price,
            })
          }
        >
          <IconHeart />
        </ActionIcon>
      )}
    </div>
  );
};
