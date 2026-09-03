"use client";

import { useEffect, useState } from "react";
import AdminForm from "./Form";
import AdminDeleteList from "./DeleteList";
import { useToast } from "@chakra-ui/react";

import { Messages, api } from "@/values/values";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter, useSearchParams } from "next/navigation";
import { TopicModel } from "@/model/topic.model";
import { TopicTypes } from "@/global/enum";
export default function AdminTopic() {
  const [data, setData] = useState<TopicModel>({
    title: "",
    text: "",
    _id: "",
  });
  const token = getCookie("token");
  const toast = useToast();
  const router = useRouter();
  const params = useSearchParams();
  const getData = async (id: string) => {
    try {
      await fetch(`${api}topic/${id}`)
        .then((d) => d.json())
        .then((d: TopicModel) =>
          setData((prev) => ({
            ...prev,
            _id: d._id,
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

    submit();
  };
  const submit = async () => {
    try {
      data._id == ""
        ? await axios
            .post(
              `${api}topic/create`,
              {
                title: data.title,
                text: data.text,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then((d) =>
              toast({
                title: "Нэмэгдлээ.",

                status: "success",
                duration: 2000,
                isClosable: true,
              })
            )
        : await axios
            .put(
              `${api}topic/${data._id}`,
              {
                title: data.title,
                text: data.text,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then((d) =>
              toast({
                title: "Нэмэгдлээ.",

                status: "success",
                duration: 2000,
                isClosable: true,
              })
            );
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
    <>
    <AdminDeleteList
      title="Одоо байгаа халуун сэдвүүд"
      fetchUrl={`${api}topic`}
      deleteUrl={(id) => `${api}topic/${id}`}
    />
    <AdminForm
      value={data.title}
      editorText={data.text}
      ph={data.text}
      onTitle={(e) => setData((prev) => ({ ...prev, title: e }))}
      onChange={(e) => setData((prev) => ({ ...prev, text: e }))}
      title={`Халуун сэдэв `}
      text="Гарчиг"
      onSubmit={checker}
    ></AdminForm>
    </>
  );
}
