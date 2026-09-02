"use client";
import { detail, more } from "@/global/string";

import { api } from "@/values/values";
import {
  Box,
  Button,
  HStack,
  Heading,
  Image,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC } from "react";

type LineWidgetType = {
  img: string;
  title: string;
  text: string;
  id: string;
  type: string;
  semiTitle?: string;
};
type LineWidgetDetailType = {
  img?: string;
  title: string;
  text: string;
  id?: string;
  semiTitle?: string;
  type?: string;
};
export const LineWidget: FC<LineWidgetType> = ({
  img,
  type,
  title,
  semiTitle,
  text,
  id,
}) => {
  return (
    <HStack
      w={"full"}
      gap={6}
      alignItems={"start"}
      flexDir={{ md: "row", base: "column" }}
    >
      <Box flex={1}>
        <Image
          src={`${api}${img}`}
          alt={id}
          height={"auto"}
          maxH={200}
          objectFit={"cover"}
          w={"full"}
        />
      </Box>

      <VStack
        w={"full"}
        alignItems={{ base: "start" }}
        gap={{ md: 4 }}
        flex={2}
      >
        <Heading
          fontSize={{
            md: "22px",
            base: "16px",
          }}
          variant={"title"}
          color={"text"}
        >
          {title}
        </Heading>
        {/* {semiTitle && (
          <Heading fontSize={"20px"} fontStyle={"italic"} color={"text"}>
            {semiTitle}
          </Heading>
        )} */}

        <Box
          mb={{ md: 0, base: 4 }}
          noOfLines={{ md: 3, base: 4 }}
          dangerouslySetInnerHTML={{
            __html: text?.replaceAll('"', "") ?? "",
          }}
        ></Box>
        <Link href={`/${type}?id=${id}`}>
          <Text textDecor={"underline"}>{more}</Text>
        </Link>
      </VStack>
    </HStack>
  );
};
export const LineWidgetDetail: FC<LineWidgetDetailType> = ({
  img,
  title,
  id,
  text,
  semiTitle,
  type,
}) => {
  const toast = useToast();
  const token = getCookie("token");
  const deleteItem = async () => {
    try {
      await axios
        .delete(`${api}${type}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((d) => {
          toast({
            title: "Устгалаа.",
          });
        });
    } catch (error) {}
  };
  const router = useRouter();
  return (
    <VStack alignItems={"start"} w={"full"} gap={5}>
      <Heading variant={"title"}>{title}</Heading>
      {semiTitle && (
        <Text fontStyle={"italic"} color={"text"}>
          {semiTitle}
        </Text>
      )}
      <Image
        src={`${api}${img}`}
        w={"full"}
        maxH={400}
        objectFit={"cover"}
        alt={id ?? ""}
      />
      <VStack w={"full"} alignItems={"start"}>
        <Box
          mb={{ md: 0, base: 4 }}
          noOfLines={{ md: 3, base: 4 }}
          dangerouslySetInnerHTML={{
            __html: text?.replaceAll('"', "") ?? "",
          }}
        ></Box>
      </VStack>
      {token && id != "" && (
        <HStack gap={4}>
          <Button onClick={deleteItem} bg={'red'}>Устгах</Button>
          <Button
            onClick={() => {
              router.push(`/?route=work&name=${type}&id=${id}`);
            }}
          >
            Засах
          </Button>
        </HStack>
      )}
    </VStack>
  );
};
