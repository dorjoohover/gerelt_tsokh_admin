"use client";
import { api } from "@/values/values";
import {
  Box,
  Button,
  HStack,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function AdminLoginPage() {
  const router = useRouter();
  const [payload, setPayload] = useState({
    username: "",
    password: "",
  });
  const login = async () => {
    try {
      let res = await fetch(`${api}auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: payload.username.toLowerCase(),
          password: payload.password,
        }),
         cache: 'no-store' 
      });
      let data = await res.json();
      if (data["access_token"] != null) {
        setCookie("token", data["access_token"]);
        router.push('/');
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <HStack w={"full"} h={"100vh"}>
      <VStack flexGrow={1} w={"full"}>
        <VStack alignItems={"start"} maxW={"400px"} px={4} w={"full"}>
          <Heading>Нэвтрэх</Heading>
          <Box h={4} />
          <Input
            placeholder="Нэр"
            onChange={(e) =>
              setPayload((prev) => ({ ...prev, username: e.target.value }))
            }
          />
          <Box h={2} />
          <Input
            placeholder="Нууц үг"
            type="password"
            onChange={(e) =>
              setPayload((prev) => ({ ...prev, password: e.target.value }))
            }
          />
          <Box h={4} />
          <Button w={"full"} onClick={login}>
            Нэвтрэх
          </Button>
        </VStack>
      </VStack>
      <Box flexGrow={1} bg={"prime.12"} w={"full"} h={"full"}></Box>
    </HStack>
  );
}
