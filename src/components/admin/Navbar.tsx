"use client";

import { imgLogo } from "@/global/assets";
import { adminNavbarValue } from "@/values/navbar.value";
import {
  Box,
  BoxProps,
  Button,
  Flex,
  FlexProps,
  Image,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { NavItemType, NavItemsTypes } from "../navbar";
import { ReactNode, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { deleteCookie } from "cookies-next";

interface SidebarProps extends BoxProps {
  current: number;
  setCurrent: (value: number) => void;
}

const SidebarContent = ({ current, setCurrent, ...rest }: SidebarProps) => {
  const router = useRouter();
  return (
    <Box
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      overflowY={"scroll"}
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Image src={imgLogo} alt="logo" />
      </Flex>
      {adminNavbarValue.map((link, index) => (
        <NavItem
          my={4}
          key={index}
          onClick={() => {
            setCurrent(index);
            if (link.links.length > 0) {
              router.push(link.links[0].link[0].value);
            } else {
              router.push(link.uri ?? "/");
            }
          }}
          active={current == index}
          list={link.links}
        >
          <Box w={"full"}>{link.title} </Box>
        </NavItem>
      ))}
      <Box mx="auto" px={4}>
        <Button
          w="full"
          onClick={() => {
            deleteCookie("token");
            router.push("/login");
          }}
        >
          Гарах
        </Button>
      </Box>
    </Box>
  );
};
interface NavItemProps extends FlexProps {
  children: ReactNode;
  active: boolean;
  onClick: () => void;
  list?: NavItemsTypes[];
  child?: NavItemType[];
}
const NavItem = ({
  active,
  onClick,
  list,
  children,
  child,
  ...rest
}: NavItemProps) => {
  const [current, setCurrent] = useState<number>(0);
  const router = useRouter();

  return (
    <Box w={"full"}>
      <Box
        as="a"
        href="#"
        style={{ textDecoration: "none" }}
        _focus={{ boxShadow: "none" }}
      >
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          _hover={{
            bg: "prime.default",
            color: "white !important",
          }}
          cursor="pointer"
          bg={active ? "prime.default" : "white"}
          onClick={onClick}
          color={!active ? "black" : "white"}
          {...rest}
          justifyContent={"space-between"}
        >
          {children}
          {!active &&
            ((list != undefined && list.length > 0) ||
              (child != undefined && child.length > 0)) && <ChevronDownIcon />}
          {active &&
            ((list != undefined && list.length > 0) ||
              (child != undefined && child.length > 0)) && <ChevronUpIcon />}
        </Flex>
      </Box>
      {active && child != undefined && child?.length > 0 && (
        <VStack w={"full"} alignItems={"start"} my={4}>
          {child?.map((l, index) => {
            return (
              <NavItem
                active={current == index}
                onClick={() => {
                  setCurrent(index);
                  console.log(l.value);
                  router.replace(l.value, {
                    scroll: false,
                  });
                }}
                key={index}
                ml={12}
                fontSize={"13px"}
              >
                {l.name ?? ""}
              </NavItem>
            );
          })}
        </VStack>
      )}
      {active && list != undefined && list?.length > 0 && (
        <VStack w={"full"} alignItems={"start"} my={4}>
          {list?.map((l, index) => {
            return (
              <NavItem
                active={current == index}
                child={l.link}
                onClick={() => {
                  setCurrent(index);
                  router.push(
                    l.link.length > 0 ? l.link[0].value : (l.uri ?? "/")
                  );
                }}
                key={index}
                ml={8}
                fontSize={"13px"}
              >
                {l.title ?? ""}
              </NavItem>
            );
          })}
        </VStack>
      )}
    </Box>
  );
};

export default SidebarContent;
