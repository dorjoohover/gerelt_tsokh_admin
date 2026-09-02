"use client";

import { useEffect, useState } from "react";
import AdminForm from "./Form";
import { Box, HStack, Image, Input, Text, useToast } from "@chakra-ui/react";
import { FilterType, filterName } from "@/global/functions";
import { ArticleTypes } from "@/global/enum";
import axios from "axios";
import { Messages, api } from "@/values/values";
import { getCookie } from "cookies-next";
import { CustomDetailType } from "./Performance";
import { useRouter, useSearchParams } from "next/navigation";
import { uploader } from "./Info";
import { Work } from "@/model/work.model";
const articleType: FilterType[] = [
  {
    value: ArticleTypes.article,
    name: "Нийтлэл",
  },
  {
    value: ArticleTypes.info,
    name: "Мэдээ",
  },
];

export default function AdminArticle({ route }: { route: { type: string } }) {
  const [data, setData] = useState<CustomDetailType>({
    title: "",
    text: "",
    img: undefined,
    date: "",
    _id: "",
  });
  const token = getCookie("token");
  const toast = useToast();
  const router = useRouter();
  const params = useSearchParams();
  const warning = (value: string) => {
    toast({
      title: value,
      status: "warning",
      duration: 2000,
      isClosable: true,
    });
    return;
  };
  const getData = async (id: string) => {
    try {
      await fetch(`${api}work/${id}`)
        .then((d) => d.json())
        .then((d: Work) =>
          setData((prev) => ({
            ...prev,
            _id: d._id,
            date: d.postDate,
            imgUrl: d.img,
            text: d.text,
            title: d.title,
          }))
        );
    } catch (error) {}
  };
  useEffect(() => {
    const id = params.get("id");
    if (id != undefined) {
      getData(id);
    }
  }, []);
  const checker = () => {
    if (token == "" || token == undefined) {
      router.push("/login");
      return;
    }
    const type = route.type.toUpperCase();
    if (data.date == undefined || data.date == "") {
      warning(Messages.requiredDate);
      return;
    }
    submit(type);
  };
  const submit = async (type: string) => {
    try {
      let img: undefined | string = undefined;
      if (data.img && data.img != undefined) {
        img = await uploader(data.img!, token!);
      }

      let body = {
        title: data.title,
        img: img,
        text: data.text,
        types: type,
        postDate: data.date,
      };
      data._id == ""
        ? await axios
            .post(`${api}article/create`, body, {
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
              setData({ title: "", text: "", img: undefined });
            })
        : await axios
            .put(`${api}article/${data._id}`, body, {
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
              setData({ title: "", text: "", img: undefined, _id: "" });
            });
    } catch (error) {
      console.log(error);
      warning(Messages.occured);
    }
  };

  return (
    <AdminForm
      onTitle={(e) => setData((prev) => ({ ...prev, title: e }))}
      onChange={(e) => setData((prev) => ({ ...prev, text: e }))}
      title={`Нийтлэл > ${filterName(route.type, articleType)}`}
      text="Гарчиг"
      onSubmit={checker}
      ph={data.text}
      value={data.title}
      editorText={data.text}
    >
      <Box w={"full"}>
        {data.imgUrl && (
          <>
            <Text>Оруулсан зураг:</Text> <Image src={data.imgUrl} maxW={500} />
          </>
        )}

        <HStack my={4}>
          <Text>Зураг:</Text>{" "}
          <Input
            border={"none"}
            type="file"
            width={"auto"}
            accept="image/*"
            height={"auto"}
            onChange={(e) =>
              setData((prev) => ({ ...prev, img: e.target.files?.[0] }))
            }
          />
        </HStack>
        <HStack my={4}>
          <Text>Оруулсан огноо:</Text>{" "}
          <Input
            border={"none"}
            type="date"
            width={"auto"}
            height={"auto"}
            value={data.date}
            onChange={(e) =>
              setData((prev) => ({ ...prev, date: e.target.value }))
            }
          />
        </HStack>
      </Box>
    </AdminForm>
  );
}
