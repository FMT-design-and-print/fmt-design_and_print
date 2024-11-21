import { Container, Text, Title } from "@mantine/core";
import { ReactNode } from "react";
import classes from "./Styles.module.css";

interface Props {
  title: string;
  description?: string;
  children?: ReactNode;
}

export const PageHero = ({ title, description, children }: Props) => {
  return (
    <div className={classes.wrapper}>
      <Container size={800} className={classes.inner}>
        <Title>{title}</Title>

        {description && (
          <>
            <Text size="lg" c="dimmed" mt="md" visibleFrom="sm">
              {description}
            </Text>

            <Text size="sm" c="dimmed" mt="md" hiddenFrom="sm">
              {description}
            </Text>
          </>
        )}

        {children}
      </Container>
    </div>
  );
};
