import { NavItemsTypes } from "@/components/navbar";
import { PerformanceTypes, TopicTypes } from "@/global/enum";
import { filterName } from "@/global/functions";
import {
  additionLearningAdvice,
  contact,
  copyrightNotice,
  feedback,
  gratitude,
  hotTopics,
  legalInfo,
  overview,
  performance,
  supplier,
} from "@/global/string";
import { tokhiruulgaTags } from "./tags";

export const gereltNavValues: NavItemsTypes[] = [
  {
    title: "Гэрэлт Цох Байшин ТББ",
    link: [
      {
        name: "Бидний тухай",
        value: "/about",
      },
    ],
  },
  {
    title: "Хийгдэж буй ажил",
    link: [
      {
        name: "Судалгаа",
        value: "/",
      },
      {
        name: "Төсөл",
        value: "/",
      },
      {
        name: "Сургалт ба зөвлөгөө үйлчилгээ",
        value: "/",
      },
      {
        name: "Зарлагдсан тэтгэлэг ба хандив",
        value: "/",
      },
    ],
  },
  {
    title: "Хийгдсэн ажил",
    link: [
      {
        name: "Судалгаа",
        value: "/work?name=research",
      },
      {
        name: "Төсөл",
        value: "/work?name=project",
      },
      {
        name: "Сургалт ба зөвлөгөө үйлчилгээ",
        value: "/work?name=advice",
      },
      {
        name: "Тэтгэлэг ба хандив",
        value: "/work?name=donation",
      },
    ],
  },
  {
    title: "Холбогдох нэмэлт мэдээлэл ",
    link: [
      {
        name: "Текст мэдээлэл",
        value: "/info?name=text",
      },
      {
        name: "Дуут мэдээлэл",
        value: "/info?name=voice",
      },
    ],
  },
  {
    title: "Нийтлэл",
    link: [
      {
        name: "Нийтлэл",
        value: "/article?name=article",
      },
      {
        name: "Мэдээ",
        value: "/article?name=info",
      },
    ],
  },
];

export const tokhiruulgaNavValues: NavItemsTypes[] = [
  {
    title: "Tokhiruulga.mn",
    link: [
      {
        name: gratitude,
        value: "/tokhiruulga?name=gratitude",
      },
      {
        name: overview,
        value: "/tokhiruulga?name=overview",
      },
      {
        name: copyrightNotice,
        value: "/tokhiruulga?name=notice",
      },
      {
        name: performance,
        value: "/tokhiruulga?name=performance&type=ab",
      },
      {
        name: hotTopics,
        value: "/tokhiruulga?name=topic&type=ab",
      },
      {
        name: legalInfo,
        value: `/tokhiruulga?name=legal&type=law`,
      },
      {
        name: additionLearningAdvice,
        value: "/tokhiruulga?name=advice",
      },
      {
        name: supplier,
        value: "/tokhiruulga?name=supplier",
      },
      {
        name: feedback,
        value: "/tokhiruulga?name=feedback",
      },
      {
        name: contact,
        value: "/tokhiruulga?name=contact",
      },
    ],
    uri: "/",
  },
];

export const adminNavbarValue = [
  {
    title: "Home page удирдах",
    links: [
      {
        title: 'Header',
        uri: "/?route=header",
        link: [],
      },
      {
        title: "Prototype",
        uri: "/?route=prototype",
        link: [],
      },
      {
        title: "Хамтрагчид",
        uri: "/?route=partner",
        link: [],
      },
    ],
    uri: "/",
  },
  {
    title: "Гэрэлт Цох удирдах",
    links: [
      {
        title: "Нэмэлт мэдээллүүд ",
        link: [
          {
            name: "Текст мэдээлэл",
            value: "/?route=info&name=text",
          },
          {
            name: "Дуут мэдээлэл",
            value: "/?route=info&name=voice",
          },
        ],
      },
      {
        title: "Хийгдсэн ажил",
        link: [
          {
            name: "Судалгаа",
            value: "/?route=work&name=research",
          },
          {
            name: "Төсөл",
            value: "/?route=work&name=project",
          },
          {
            name: "Сургалт ба зөвлөгөө үйлчилгээ",
            value: "/?route=work&name=advice",
          },
          {
            name: "Тэтгэлэг ба хандив",
            value: "/?route=work&name=donation",
          },
        ],
      },
      {
        title: "Нийтлэл",
        link: [
          {
            name: "Нийтлэл",
            value: "/?route=article&name=article",
          },
          {
            name: "Мэдээ",
            value: "/?route=article&name=info",
          },
        ],
      },
    ],
  },
  {
    title: "Tokhiruulga.mn удирдах",
    links: [
      {
        title: performance,
        link: [
          {
            name: "Үндсэн мэдээлэл оруулах",
            value: `/?route=performance`,
          },

          {
            name: "Дэлгэрэнгүй мэдээлэл оруулах",
            value: `/?route=performance&name=custom`,
          },
        ],
      },
      {
        title: hotTopics,
        uri: "/?route=topic",
        link: [],
      },
      {
        title: legalInfo,
        link: [
          {
            name: "Хууль",
            value: "/?route=legal&name=law",
          },
          {
            name: "Тогтоол",
            value: "/?route=legal&name=decree",
          },
          {
            name: "Журам",
            value: "/?route=legal&name=regulation",
          },
        ],
      },
      {
        title: feedback,
        link: [
          {
            name: feedback,
            value: "/?route=feedback&name=view",
          },
        ],
      },
      {
        title: contact,
        link: [
          {
            name: contact,
            value: "/?route=contact&name=view",
          },
        ],
      },
    ],
  },
];
