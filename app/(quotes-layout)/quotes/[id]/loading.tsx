import { Center, Loader } from "@mantine/core";
import React from "react";

const LoadingPage = () => {
  return (
    <Center py="xl" my="xl">
      <Loader variant="dots" color="pink" size="xl">
        Loading...
      </Loader>
    </Center>
  );
};

export default LoadingPage;
