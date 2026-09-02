"use client";

import "./globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "@/theme/theme";
import Fonts from "@/theme/fonts";
import Head from "next/head";
import { imgMiniLogo } from "@/global/assets";
import { usePathname } from "next/navigation";

import { findTitle } from "@/global/functions";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="shortcut icon" type="image/x-icon" href={imgMiniLogo} />

        <title>{findTitle(pathname)}</title>
      </head>
      <body>
        <ChakraProvider theme={theme}>
          <Fonts />
          <Suspense fallback={<></>}>
          {children}
          </Suspense>
        </ChakraProvider>
      </body>
    </html>
  );
}
