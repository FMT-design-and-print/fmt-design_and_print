import { LoadingOverlay as MLoadingOverlay } from "@mantine/core";

interface Props {
  visible: boolean;
}

export const LoadingOverlay = ({ visible }: Props) => {
  return (
    <MLoadingOverlay
      color="pink"
      visible={visible}
      overlayProps={{ radius: "sm", blur: 2 }}
      loaderProps={{ color: "pink", type: "dots" }}
    />
  );
};
