"use client";

import { useEffect, useState } from "react";
import AdminForm from "./Form";
import { Box, HStack, Image, Input, Text, useToast } from "@chakra-ui/react";
import { FilterType, filterName } from "@/global/functions";
import { WorkTypes } from "@/global/enum";
import { getCookie } from "cookies-next";
import { Messages, api } from "@/values/values";
import axios from "axios";
import { CustomDetailType } from "./Performance";
import { useRouter, useSearchParams } from "next/navigation";
import { uploader } from "./Info";
const workType: FilterType[] = [
  {
    value: WorkTypes.research,
    name: "Судалгаа",
  },
  {
    value: WorkTypes.project,
    name: "Төсөл",
  },
  {
    value: WorkTypes.advice,
    name: "Сургалт ба зөвлөгөө үйлчилгээ",
  },
  {
    value: WorkTypes.donation,
    name: "Тэтгэлэг ба хандив",
  },
];
export default function AdminWork({ route }: { route: { type: string } }) {
  const [data, setData] = useState<CustomDetailType>({
    title: "",
    text: "",
    img: undefined,
    date: "",
    imgUrl: "",
    _id: "",
  });
  const params = useSearchParams();
  const token = getCookie("token");
  const toast = useToast();
  const router = useRouter();
  const getData = async (id: string) => {
    try {
      await fetch(`${api}work/${id}`)
        .then((d) => d.json())
        .then((d) => {
          setData((prev) => ({
            ...prev,
            title: d.title,
            _id: d._id,
            date: d.postDate,
            imgUrl: d.img,
            text: d.text,
          }));
        });
    } catch (error) {}
  };

  useEffect(() => {
    const id = params.get("id");
    if (id) getData(id);
  }, []);
  const warning = (value: string) => {
    toast({
      title: value,
      status: "warning",
      duration: 2000,
      isClosable: true,
    });
    return;
  };
  const checker = () => {
    if (token == "" || token == undefined) {
      router.push("/login");
      return;
    }
    const type = route.type.toUpperCase();
    // if (data.img == undefined) {
    //   warning(Messages.requiredFile);
    //   return;
    // }
    submit(type);
  };
  const submit = async (type: string) => {
    try {
      let img: string | undefined = undefined;

      if (data.img) {
        img = await uploader(data.img!, token!);
      }
      // if (!img) {
      //   warning(Messages.occured);
      //   return;
      // }
      const body = {
        title: data.title,
        img: img,
        text: data.text,
        types: type,
        postDate: data.date,
      };
      data._id == ""
        ? await axios
            .post(`${api}work/create`, body, {
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
                date: "",
                imgUrl: "",
                _id: "",
                img: undefined,
              });
            })
        : await axios
            .put(`${api}work/${data._id}`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then(() =>
              toast({
                title: "Заслаа.",
                status: "success",
                duration: 2000,
                isClosable: true,
              })
            )
            .then(() => {
              setData({
                title: "",
                text: "",
                date: "",
                imgUrl: "",
                _id: "",
                img: undefined,
              });
            });
    } catch (error) {
      console.log(error);
      warning(Messages.occured);
    }
  };

  return (
    <AdminForm
      value={data.title}
      onTitle={(e) => setData((prev) => ({ ...prev, title: e }))}
      onChange={(e) => setData((prev) => ({ ...prev, text: e }))}
      title={`Хийгдсэн ажлууд > ${filterName(route.type, workType)}`}
      text="Гарчиг"
      ph={data.text}
      editorText={data.text}
      onSubmit={checker}
    >
      <Box w={"full"}>
        {data.imgUrl && (
          <>
            {" "}
            <Text mt={5}>Оруулсан зураг:</Text>{" "}
            <Image w={400} src={`${api}${data.imgUrl}`} />
          </>
        )}
        <HStack my={4}>
          <Text>Огноо:</Text>{" "}
          <Input
            border={"none"}
            type="date"
            maxW={200}
            value={data.date}
            onChange={(e) =>
              setData((prev) => ({ ...prev, date: e.target.value }))
            }
          />
        </HStack>
        <HStack my={4}>
          <Text>Зураг:</Text>{" "}
          <Input
            accept="image/*"
            border={"none"}
            type="file"
            width={"auto"}
            height={"auto"}
            onChange={(e) =>
              setData((prev) => ({ ...prev, img: e.target.files?.[0] }))
            }
          />
        </HStack>
      </Box>
    </AdminForm>
  );
}
