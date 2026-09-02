"use client";
import { Box, HStack, Input, Text, useColorModeValue } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, ReactNode, useState } from "react";

import { getCookie } from "cookies-next";

import SidebarContent from "@/components/admin/Navbar";

import AdminInfo from "@/components/admin/Info";
import AdminWork from "@/components/admin/Work";
import AdminArticle from "@/components/admin/Article";
import AdminPerformance from "@/components/admin/Performance";
import AdminTopic from "@/components/admin/Topic";
import AdminLegal from "@/components/admin/Legal";
import AdminPerformanceCustom from "@/components/admin/Custom";
import PartnerWidget from "@/components/admin/Partner";
import PrototypeWidget from "@/components/admin/Prototype";
import HeaderWidget from "@/components/admin/Header";

function Page() {
  const token = getCookie("token");
  const router = useRouter();
  const [current, setCurrent] = useState<number>(0);
  const params = useSearchParams();
  const [route, setRoute] = useState({
    value: "",
    type: "",
  });

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token]);
  useEffect(() => {
    setRoute((prev) => ({
      ...prev,
      value: params.get("route") ?? "",
      type: params.get("name") ?? "",
    }));
  }, [params]);

  const View = (): ReactNode => {
    switch (route.value) {
      case "partner":
        return <PartnerWidget />;
      case "prototype":
        return <PrototypeWidget />;
      case "header":
        return <HeaderWidget />;
      case "info":
        return <AdminInfo />;
      case "work":
        return <AdminWork route={{ type: route.type }} />;
      case "article":
        return <AdminArticle route={{ type: route.type }} />;
      case "performance":
        if (route.type != "custom") {
          return <AdminPerformance />;
        } else {
          return <AdminPerformanceCustom />;
        }
      case "topic":
        return <AdminTopic />;
      case "feedback":
        return <AdminWork route={{ type: route.type }} />;
      case "contact":
        return <AdminWork route={{ type: route.type }} />;
      case "legal":
        return <AdminLegal route={{ type: route.type }} />;
    }
  };

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        display={{ base: "none", md: "block" }}
        current={current}
        setCurrent={(value) => setCurrent(value)}
      />

      <Box ml={{ base: 0, md: 60 }} p="4">
        {View()}
      </Box>
    </Box>
  );
}

export default Page;
