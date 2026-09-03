"use client";

import { useState, useEffect } from "react";
import AdminForm from "./Form";
import AdminDeleteList from "./DeleteList";
import {
  Button,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FilterType, filterName } from "@/global/functions";
import { MedicalTypes } from "@/global/enum";
import { api, medicalType } from "@/values/values";
import { getCookie } from "cookies-next";
const Editor = dynamic(() => import("@/components/custom-editor"), {
  ssr: false,
});
import axios from "axios";
import dynamic from "next/dynamic";

export default function AdminPerformance() {
  const [data, setData] = useState({
    title: "",
    text: "",
  });
  const [details, setDetails] = useState<
    {
      type: string;
      details: (string | undefined)[];
    }[]
  >([]);
  const [detail, setDetail] = useState<{
    type: string;
    details: (string | undefined)[];
  }>({
    type: medicalType[0].value,
    details: [],
  });
  const [values, setValues] = useState<(string | undefined)[]>([]);
  const [value, setValue] = useState<string | undefined>();
  const [conditions, setConditions] = useState<string[]>([]);
  const [condition, setCondition] = useState<string>("");
  const [view, setView] = useState(0);
  const [current, setCurrent] = useState<string>("");
  const [getValues, setGetValues] = useState<(CustomType | undefined)[]>([]);
  const token = getCookie("token");
  const toast = useToast();
  const [setup, setSetup] = useState<string | undefined>();
  const submit = async () => {
    try {
      await axios
        .post(
          `${api}medical/create`,
          setup != null && setup != undefined
            ? {
                title: data.title,
                text: data.text,
                setup: [setup],
                details: details,
                condition: conditions,
              }
            : {
                title: data.title,
                text: data.text,

                details: details,
                condition: conditions,
              },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
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
            text: "",
            title: "",
          });
          setDetails([]);
        });
    } catch (error) {}
  };
  const getDetails = async () => {
    try {
      await fetch(`${api}medical/details`, { cache: "no-store" })
        .then((d) => d.json())
        .then((d) => {
          setGetValues(
            d.sort((a: any, b: any) =>
              a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1
            )
          );
        });
    } catch (error) {}
  };
  useEffect(() => {
    getDetails();
  }, []);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const add = () => {
    if (view == 1) {
      if (detail.type == MedicalTypes.SETUP) {
        setSetup(value);
      } else {
        setDetail((prev) => ({ ...prev, details: values }));

        if (details.find((d) => d.type == detail.type) == undefined) {
          setDetails((prev) => [
            ...prev,
            {
              type: detail.type,
              details: values,
            },
          ]);
        }
      }
      setValues([]);
      setDetail({
        type: medicalType[0].value,
        details: [],
      });
    }

    onClose();
  };
  return (
    <>
    <AdminDeleteList
      title="Одоо байгаа гүйцэтгэлийн чадвар алдалтууд"
      fetchUrl={`${api}medical`}
      deleteUrl={(id) => `${api}medical/delete/${id}`}
    />
    <AdminForm
      value={data.title}
      onTitle={(e) => setData((prev) => ({ ...prev, title: e }))}
      onChange={(e) => setData((prev) => ({ ...prev, text: e }))}
      title={`Үйлдэл гүйцэтгэх чадвар алдалт > Мэдээлэл оруулах`}
      text="Үндсэн гарчиг"
      onSubmit={submit}
      editorText={data.text}
    >
      <VStack alignItems={"start"} my={4} gap={3}>
        <Button
          onClick={() => {
            setView(0);
            onOpen();
          }}
        >
          Нөхцөл ба шийдэл
        </Button>

        {details.map((d, i) => {
          return (
            <HStack key={i}>
              <Text>{filterName(d.type, medicalType)}</Text>
              <Button
                onClick={() => {
                  onOpen();

                  setCurrent(d.type);
                }}
                bg={"waterPrime"}
              >
                Харах
              </Button>
              <Button
                onClick={() => {
                  setDetails(details.filter((det) => det != d));
                }}
                bg={"red"}
              >
                Устгах
              </Button>
            </HStack>
          );
        })}
        <HStack>
          <Select
            onChange={(e) => {
              setDetail((prev) => ({ ...prev, type: e.target.value }));
            }}
          >
            {medicalType.map((medical, i) => {
              return (
                <option value={medical.value} key={i}>
                  {medical.name}
                </option>
              );
            })}
          </Select>
          <Button
            onClick={() => {
              onOpen();
              setView(1);
            }}
          >
            Add
          </Button>
        </HStack>
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          size={"4xl"}
          closeOnOverlayClick={false}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {view == 1
                ? filterName(detail.type, medicalType)
                : "Нөхцөл ба шийдэл"}
            </ModalHeader>
            <ModalCloseButton
              onClick={() => {
                add();
              }}
            />
            <ModalBody>
              {current != "" &&
                details
                  .filter((d) => d.type == current)[0]
                  ?.details.map((d, i) => {
                    return (
                      <Select
                        onChange={(e) => {
                          setValues((prev) => [
                            ...prev.slice(0, i),
                            e.target.value,
                            ...prev.slice(i + 1),
                          ]);
                        }}
                        key={i}
                        defaultValue={d}
                      >
                        {getValues.map((v, i) => {
                          return (
                            <option value={v?._id} key={i}>
                              {" "}
                              {`${v?.title}(${v?.detail.length})`}{" "}
                            </option>
                          );
                        })}
                      </Select>
                    );
                  })}

              {current == "" &&
                (view == 1 ? values : conditions).map((v, i) => {
                  return (
                    <HStack key={i}>
                      {view == 1 ? (
                        <Select
                          onChange={(e) => {
                            setValues((prev) => [
                              ...prev.slice(0, i),
                              e.target.value,
                              ...prev.slice(i + 1),
                            ]);
                          }}
                          defaultValue={v}
                        >
                          {getValues.map((v, index) => {
                            return (
                              <option value={v?._id} key={v?._id ?? index}>
                                {" "}
                                {`${v?.title}(${v?.detail.length})`}{" "}
                              </option>
                            );
                          })}
                        </Select>
                      ) : (
                        <Input
                          value={v}
                          onChange={(e) => {
                            setCondition(e.target.value);
                          }}
                        />
                      )}
                      <Button
                        onClick={() => {
                          if (view == 0) {
                            setConditions(conditions.filter((con) => con != v));
                          } else {
                            setValues(values.filter((val) => val != v));
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </HStack>
                  );
                })}
              <HStack>
                {view == 1 ? (
                  detail.type == MedicalTypes.SETUP ? (
                    <Editor
                      initialData={""}
                      onChange={(e) => setValue(e)}
                    />
                  ) : (
                    <Select
                      onChange={(e) => {
                        setValue(e.target.value);
                      }}
                    >
                      <option value="">Сонгох</option>
                      {getValues.map((v, i) => {
                        return (
                          <option value={v?._id} key={i}>
                            {" "}
                            {`${v?.title}(${v?.detail.length})`}{" "}
                          </option>
                        );
                      })}
                    </Select>
                  )
                ) : (
                  <Input
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                  />
                )}
                {detail.type != MedicalTypes.SETUP && (
                  <Button
                    onClick={() => {
                      if (view == 1) {
                        if (!values.includes(value) && value != "") {
                          setValues((prev) => [...prev, value]);

                          setValue(undefined);
                        }
                      } else {
                        if (
                          !conditions.includes(condition) &&
                          condition != ""
                        ) {
                          setConditions((prev) => [...prev, condition]);
                          setCondition("");
                        }
                      }
                    }}
                  >
                    Add
                  </Button>
                )}
              </HStack>

              <Button
                onClick={() => {
                  add();
                }}
              >
                Done
              </Button>
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </AdminForm>
    </>
  );
}
export type CustomDetailType = {
  title: string;
  _id?: string;
  text?: string;
  img?: File;
  imgs?: FileList | null;
  date?: string;
  imgUrl?: string;
};
export type CustomType = {
  _id?: string;
  title: string;
  detail: CustomDetailType[];
};
