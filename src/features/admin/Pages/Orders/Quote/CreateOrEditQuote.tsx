// import { useUpdateOrder } from "@/hooks/admin/useUpdateOrder";
// import { IQuote, IQuoteItem } from "@/types/quote";
// import {
//   ActionIcon,
//   Alert,
//   Button,
//   Card,
//   Divider,
//   Flex,
//   Group,
//   Loader,
//   NumberInput,
//   Stack,
//   Text,
//   TextInput,
// } from "@mantine/core";
// import { IconArrowForward, IconPlus, IconTrash } from "@tabler/icons-react";
// import { Dispatch, SetStateAction, useState } from "react";
// import { v4 as uid } from "uuid";
// import { QuoteFormMode, QuoteModalScreen } from "./types";

// interface Props {
//   mode?: QuoteFormMode;
//   orderId: string;
//   data?: IQuote;
//   setActiveScreen?: Dispatch<SetStateAction<QuoteModalScreen>>;
// }
export function CreateOrEditQuote() {
  return <></>;
}

// export function CreateOrEditQuote({
//   orderId,
//   mode = "create",
//   data,
//   setActiveScreen,
// }: Props) {
//   const { mutate: updateOrder, isPending: isLoading } = useUpdateOrder();

//   // const [error, setError] = useState<string | null>(null);
//   // const [quoteItems, setQuoteItems] = useState<IQuoteItem[]>(
//   //   data?.items || [initialQuoteItem]
//   // );

//   const handleCreateQuote = async () => {
//     console.log(orderId);
//   };

//   const handleUpdateQuote = () => {
//     console.log(orderId);
//   };

//   const handleAddNewQuoteItem = () => {
//     setQuoteItems([...quoteItems, { ...initialQuoteItem, id: uid() }]);
//   };

//   const handleRemoveQuoteItem = (id: string) => {
//     setQuoteItems(quoteItems.filter((item) => item.id !== id));
//   };

//   return (
//     <>
//       <Divider />

//       <TextInput
//         label="Title"
//         placeholder="Give this quote a title"
//         size="xs"
//         mb="sm"
//       />

//       {quoteItems.map((item, index) => (
//         <Card withBorder my="xs" key={item.id} py={8}>
//           <Stack gap={6}>
//             <Group justify="space-between">
//               <Text>Item {index + 1}</Text>
//               {quoteItems.length > 1 && (
//                 <ActionIcon
//                   size="xs"
//                   color="red"
//                   variant="light"
//                   onClick={() => handleRemoveQuoteItem(item.id)}
//                 >
//                   <IconTrash size="1rem" />
//                 </ActionIcon>
//               )}
//             </Group>

//             <TextInput size="xs" placeholder="Item Description" />
//             <Flex direction={{ base: "column", sm: "row" }} gap={8}>
//               <NumberInput size="xs" placeholder="Quantity" min={1} flex={1} />
//               <TextInput size="xs" placeholder="Unit Amount" flex={1} />
//               <TextInput size="xs" placeholder="Total Amount" flex={1} />
//             </Flex>
//           </Stack>
//         </Card>
//       ))}

//       <Button
//         w="100%"
//         leftSection={<IconPlus size="1rem" />}
//         color="gray"
//         variant="light"
//         style={{ border: "1px dashed var(--mantine-color-gray-4)" }}
//         radius={0}
//         onClick={handleAddNewQuoteItem}
//       >
//         Add Item
//       </Button>

//       {/* {error && <Alert color="red" variant="light" title={error} my="xs" />} */}
//       <Group justify="space-between" align="center" w="100%" mt={16}>
//         <Button
//           className="btn"
//           onClick={mode === "create" ? handleCreateQuote : handleUpdateQuote}
//           disabled={isLoading}
//           style={{ opacity: isLoading ? 0.5 : 1 }}
//           size="xs"
//           radius="lg"
//         >
//           {isLoading ? (
//             <>
//               <Loader color="white" size="xs" /> Sending quote...{" "}
//             </>
//           ) : mode === "create" ? (
//             "Save Quote"
//           ) : (
//             "Update Quote"
//           )}
//         </Button>
//         <Button onClick={() => setActiveScreen?.("send")} size="xs" radius="lg">
//           <IconArrowForward size="1rem" />
//           <Text component="span" size="xs" ml="xs">
//             Send quote
//           </Text>
//         </Button>
//       </Group>
//     </>
//   );
// }
