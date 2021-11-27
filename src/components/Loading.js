import React from "react";
import {
  Spinner,
  HStack,
  Heading,
  Center,
  NativeBaseProvider,
} from "native-base";

export default function Loading() {
  return (
    <NativeBaseProvider>
      <Center flex={1} px="3">
        <HStack space={2} alignItems="center">
          <Spinner
            accessibilityLabel="Loading posts"
            size="lg"
            color="violet.500"
          />
          <Heading color="violet.500" fontSize="xl">
            Loading
          </Heading>
        </HStack>
      </Center>
    </NativeBaseProvider>
  );
}
