"use client";

import { useEffect, useState } from "react";
import AdminForm from "./Form";
import { Box, HStack, Input, Text, useToast } from "@chakra-ui/react";
import { FilterType, filterName } from "@/global/functions";
import { ArticleTypes, LegalTypes } from "@/global/enum";
import { tokhiruulgaTags } from "@/values/tags";
import { Messages, api } from "@/values/values";
import { getCookie } from "cookies-next";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { LegalModel } from "@/model/legal.model";
export default function AdminLegal({ route }: { route: { type: string } }) {
  const [data, setData] = useState<LegalModel>({
    title: "",
    text: "",
    _id: "",
    type: LegalTypes.law,
  });
  const toast = useToast();
  const token = getCookie("token");
  const router = useRouter();
  const params = useSearchParams();
  const checker = () => {
    if (token == "" || token == undefined) {
      router.push("/login");
      return;
    }
    const type = route.type.toUpperCase();

    submit(type);
  };
  const getData = async (id: string) => {
    try {
      await fetch(`${api}legal/${id}`)
        .then((d) => d.json())
        .then((d: LegalModel) => {
          setData((prev) => ({
            ...prev,
            id: d._id,
            text: d.text,
            title: d.title,
            type: d.type,
          }));
        });
    } catch (error) {}
  };
  useEffect(() => {
    const id = params.get("id");
    if (id != undefined) {
      getData(id);
    }
  }, []);
  const submit = async (type: string) => {
    try {
      data._id != ""
        ? await axios
            .put(
              `${api}legal/${data._id}`,
              {
                title: data.title,
                text: data.text,
                types: type,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then(() => {
              toast({
                title: "Заслаа.",
                status: "success",
                duration: 2000,
                isClosable: true,
              });
              setData({
                title: "",
                text: "",
                _id: "",
                type: LegalTypes.law,
              });
            })
        : await axios
            .post(
              `${api}legal/create`,
              {
                title: data.title,
                text: data.text,
                types: type,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then(() => {
              toast({
                title: "Нэмэгдлээ.",
                status: "success",
                duration: 2000,
                isClosable: true,
              });
              setData({
                title: "",
                text: "",
                _id: "",
                type: LegalTypes.law,
              });
            });
    } catch (error) {
      console.log(error);
      toast({
        title: Messages.occured,
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <AdminForm
      value={data.title}
      onTitle={(e) => setData((prev) => ({ ...prev, title: e }))}
      onChange={(e) => setData((prev) => ({ ...prev, text: e }))}
      title={`Хуулийн мэдээллийн булан > ${filterName(
        route.type,
        tokhiruulgaTags[5].sub!
      )}`}
      ph={data.text}
      text="Гарчиг"
      onSubmit={checker}
      editorText={data.text}
    ></AdminForm>
  );
}
