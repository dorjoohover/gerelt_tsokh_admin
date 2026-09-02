"use client";

import { useState, useEffect } from "react";
import AdminForm from "./Form";
import { Box, HStack, Input, Text, useToast } from "@chakra-ui/react";
import { FilterType, filterName } from "@/global/functions";
import { Messages, api } from "@/values/values";
import { getCookie } from "cookies-next";
import axios from "axios";
import { InfoTypes } from "@/global/enum";
import { useRouter, useSearchParams } from "next/navigation";
const infoType: FilterType[] = [
  {
    value: "text",
    name: "Текст мэдээлэл",
  },
  {
    value: "voice",
    name: "Дуут мэдээлэл",
  },
];

type CustomDetailType = {
  title: string;
  text?: string;
  voice?: File;
};
export const uploader = async (data: File | string, token: string) => {
  try {
    let file = new FormData();
    file.set("file", data);
    const res = await fetch(`${api}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: file,
      cache: "no-store",
    }).then((d) => d.json());
    return res.file as string;
  } catch (error) {
    console.log(error);
  }
};

const AdminInfo = () => {
  const [data, setData] = useState<CustomDetailType>({
    title: "",
    text: "",
    voice: undefined,
  });
  const token = getCookie("token");
  const toast = useToast();
  const router = useRouter();
  const params = useSearchParams();
  const [type, setType] = useState<string>("");
  useEffect(() => {
    if (params.get("name") != null) {
      setType(params.get("name")?.toString() ?? "");
    }
  }, [params]);
  const checker = () => {
    if (token == "" || token == undefined) {
      router.push("/login");
      return;
    }

    if (params.get("name") == null) {
      router.push("/login");
      return;
    }

    if (data.voice == undefined && type == InfoTypes.voice) {
      toast({
        title: Messages.requiredFile,
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    submit();
  };

  const submit = async () => {
    try {
      let voice: string | undefined = undefined;

      if (data.voice != undefined) {
        await uploader(data.voice, token!).then((d) => (voice = d));
      }

      const body = {
        title: data.title,
        voice: voice,
        text: data.text,
        types: type.toUpperCase(),
      };
      await axios
        .post(`${api}info/create`, body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() =>
          toast({
            title: "Нэмэгдлээ.",

            status: "success",
            duration: 2000,
            isClosable: true,
          })
        )
        .then(() => {
          setData({
            title: "",
            text: "",
            voice: undefined,
          });
        });
    } catch (error) {
      toast({
        title: "Алдаа гарлаа.",

        status: "error",
        duration: 2000,
        isClosable: true,
      });
      console.log(error);
    }
  };

  return (
    <AdminForm
      value={data.title}
      onTitle={(e) => setData((prev) => ({ ...prev, title: e }))}
      onChange={(e) => setData((prev) => ({ ...prev, text: e }))}
      title={`Нэмэлт нэдээллүүд > ${filterName(params.get("name")!, infoType)}`}
      text="Гарчиг"
      editorText={data.text}
      onSubmit={checker}
    >
      <Box w={"full"}>
        {params.get("name") == "voice" && (
          <HStack my={4}>
            <Text>Дуу:</Text>{" "}
            <Input
              type="file"
              accept="audio/mp3, audio/wav, audio/ogg"
              height={"auto"}
              border={"none"}
              width={"auto"}
              onChange={(e: any) =>
                setData((prev) => ({ ...prev, voice: e.target.files?.[0] }))
              }
            />
          </HStack>
        )}
      </Box>
    </AdminForm>
  );
};

export default AdminInfo;
