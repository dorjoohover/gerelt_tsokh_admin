"use client";
import { Info } from "@/model/info.model";
import { api } from "@/values/values";
import {
  Box,
  Button,
  HStack,
  Heading,
  Icon,
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
import { FaPlay } from "react-icons/fa";
type InfoType = {
  data: Info;
};
export const TextLine: FC<InfoType> = ({ data }) => {
  const toast = useToast();
  const token = getCookie("token");
  const router = useRouter();
  const deleteInfo = async () => {
    try {
      await axios
        .delete(`${api}info/${data._id}`, {
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
  return (
    <VStack w={"full"} alignItems={"start"}>
      <Heading
        fontSize={{
          md: "22px",
          base: "16px",
        }}
        variant={"title"}
        color={"text"}
      >
        {data.title}
      </Heading>
      {/* <HStack
        w={"full"}
        justifyContent={"space-between"}
        mb={{ md: 8, base: 4 }}
      >
        <Text
          variant={"normal"}
          display={{ md: "inline-block", base: "none" }}
        >{`${data.date} | ${data.duration} мин`}</Text>
      </HStack> */}
      <Box
        w={"full"}
        mb={{ md: 0, base: 4 }}
        // noOfLines={{ md: 3, base: 4 }}
        dangerouslySetInnerHTML={{
          __html: data?.text?.replaceAll('"', "") ?? "",
        }}
      ></Box>
      {/* <Text
        variant={"normal"}
        display={{ base: "inline-block", md: "none" }}
      >{`${data.date} | ${data.duration} мин`}</Text> */}
      {token && token != "" && data._id != "" && (
        <HStack gap={4}>
          <Button onClick={deleteInfo}>Устгах</Button>
          <Button
            onClick={() => {
              router.push(`/?route=info&id=${data._id}`);
            }}
          >
            Засах
          </Button>
        </HStack>
      )}
    </VStack>
  );
};
export const VoiceLine = ({
  data,
  play,
}: {
  data: Info;
  play: (title: string, value: string) => void;
}) => {
  const toast = useToast();
  const token = getCookie("token");
  const deleteInfo = async () => {
    try {
      await axios
        .delete(`${api}info/${data._id}`, {
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
    <HStack alignItems={"start"} w={"full"}>
      <Button
        p={3}
        borderRadius={100}
        h={"auto"}
        bg={"transparent"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        border={"1px solid gray"}
        mr={2}
        onClick={() => {
          play(data.title, data.voice!);
        }}
      >
        <Icon as={FaPlay} color={"text"} />
      </Button>
      <VStack w={"full"} alignItems={"start"}>
        <Heading
          fontSize={{
            md: "22px",
            base: "16px",
          }}
          variant={"title"}
          color={"text"}
        >
          {data.title}
        </Heading>
        {/* <HStack
          w={"full"}
          justifyContent={"space-between"}
          mb={{ md: 8, base: 4 }}
        >
          <Text
            variant={"normal"}
            display={{ md: "inline-block", base: "none" }}
          >{`${data.date} | ${data.duration} мин`}</Text>
        </HStack> */}
        <Box
          mb={{ md: 0, base: 4 }}
          w={"full"}
          // noOfLines={{ md: 3, base: 4 }}
          dangerouslySetInnerHTML={{
            __html: data?.text?.replaceAll('"', "") ?? "",
          }}
        ></Box>
        {/* <Text mb={{ md: 0, base: 4 }}>{data.text}</Text> */}
        {/* <Text
          variant={"normal"}
          display={{ base: "inline-block", md: "none" }}
        >{`${data.date} | ${data.duration} мин`}</Text> */}
        {token && token != "" && data._id != "" && (
          <HStack gap={4}>
            <Button onClick={deleteInfo} background={"red"}>
              Устгах
            </Button>
            <Button
              onClick={() => {
                router.push(`/?route=info&name=text&id=${data._id}`);
              }}
            >
              Засах
            </Button>
          </HStack>
        )}
      </VStack>
    </HStack>
  );
};
// export const VideoLine: FC<InfoType> = ({ data }) => {
//   return (
//     <VStack w={"full"} gap={{ md: 4.5, base: 4 }} alignItems={"start"}>
//       <Box pos={"relative"} w={"full"}>
//         <Image src={data.thumbnail} alt={""} w={"full"} />
//         <Link href={data.uri ?? "www.google.com"} target="_blank">
//           <Box
//             pos={"absolute"}
//             zIndex={5}
//             top={"50%"}
//             left={"50%"}
//             transform={"translate(-50%, -50%)"}
//             display={"flex"}
//             bg={"red"}
//             borderRadius={"100%"}
//             justifyContent={"center"}
//             alignItems={"center"}
//             w={16}
//             h={16}
//           >
//             <Icon as={FaPlay} boxSize={25} color={"white"} />
//           </Box>
//         </Link>
//       </Box>
//       <Heading fontSize={"20px"} variant={"smallTitle"} color={"text"}>
//         {data.title}
//       </Heading>

//       <Text>{data.date}</Text>
//     </VStack>
//   );
// };
