"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  HStack,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { getCookie } from "cookies-next";

type Item = { _id: string; [key: string]: any };

type Props = {
  title: string;
  fetchUrl: string;
  fetchBody?: any;
  method?: "post" | "get";
  deleteUrl: (id: string) => string;
  getLabel?: (item: Item) => string;
};

export default function AdminDeleteList({
  title,
  fetchUrl,
  fetchBody,
  method = "post",
  deleteUrl,
  getLabel,
}: Props) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const token = getCookie("token");
  const toast = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const res =
        method === "post"
          ? await axios.post(fetchUrl, fetchBody ?? { limit: 200, page: 0 })
          : await axios.get(fetchUrl);
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.data ?? [];
      setItems(data);
    } catch (error) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchUrl]);

  const onDelete = async (id: string) => {
    if (typeof window !== "undefined" && !window.confirm("Устгахдаа итгэлтэй байна уу?")) {
      return;
    }
    try {
      await axios.delete(deleteUrl(id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast({
        title: "Устгалаа.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      setItems((prev) => prev.filter((it) => it._id !== id));
    } catch (error) {
      toast({
        title: "Устгах үед алдаа гарлаа.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  if (!token) return null;

  return (
    <Box w={"full"} mb={8} p={4} borderWidth={1} borderRadius={8}>
      <Text fontWeight={"bold"} mb={3}>
        {title} ({items.length})
      </Text>
      {loading && <Text>Ачааллаж байна...</Text>}
      <VStack
        w={"full"}
        alignItems={"start"}
        gap={2}
        maxH={"400px"}
        overflowY={"auto"}
      >
        {items.map((it) => (
          <HStack key={it._id} w={"full"} justifyContent={"space-between"}>
            <Text noOfLines={1}>{getLabel ? getLabel(it) : it.title}</Text>
            <Button
              size={"sm"}
              bg={"red"}
              color={"white"}
              onClick={() => onDelete(it._id)}
            >
              Устгах
            </Button>
          </HStack>
        ))}
        {!loading && items.length === 0 && (
          <Text color={"gray.500"}>Мэдээлэл алга.</Text>
        )}
      </VStack>
    </Box>
  );
}
