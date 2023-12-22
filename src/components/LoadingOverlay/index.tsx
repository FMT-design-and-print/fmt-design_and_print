import { Card } from "@nextui-org/card";
import React from "react";
import styles from "./LoadingOverlay.module.scss";

interface Props {
  visible: boolean;
}

export const LoadingOverlay = ({ visible = false }: Props) => {
  return (
    <div className={visible ? "block" : "hidden"}>
      <Card
        isBlurred
        radius="none"
        className={`flex-center absolute left-0 top-0 z-10 h-full w-full bg-slate-400/30 opacity-95`}
      >
        <div className={styles.loader} />
      </Card>
    </div>
  );
};
