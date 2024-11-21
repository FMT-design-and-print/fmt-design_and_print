import { Badge, UnstyledButton } from "@mantine/core";
import classes from "./Navbar.module.css";
import { ILink } from "./types";
import Link from "next/link";

interface Props {
  links: ILink[];
}
export const RenderLinks = ({ links }: Props) =>
  links.map(
    (link) =>
      link.isVisible && (
        <UnstyledButton
          component={Link}
          href={link.link}
          key={link.label}
          className={classes.mainLink}
        >
          <div className={classes.mainLinkInner}>
            <span className={classes.mainLinkIcon}>{link.icon}</span>
            <span>{link.label}</span>
          </div>
          {link.notifications && (
            <Badge
              size="xs"
              variant="filled"
              color="pink"
              className={classes.mainLinkBadge}
            >
              {link.notifications}
            </Badge>
          )}
        </UnstyledButton>
      )
  );
