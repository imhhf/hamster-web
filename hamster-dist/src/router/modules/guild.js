// 公会相关
export default {
  path: "/guild",
  children: [
    {
      path: "index",
      name: "GuildIndex",
      meta: {
        title_en: "Agency",
        title_ara: "الوكالة",
      },
      props: (route) => route.query,
      component: () => import("@/views/guild/Index.vue"),
    },
    {
      path: "list",
      name: "GuildList",
      meta: {
        title_en: "Agency",
        title_ara: "الوكالة",
      },
      props: (route) => route.query,
      component: () => import("@/views/guild/List.vue"),
    },
    {
      path: "create",
      name: "GuildCreate",
      meta: {
        title_en: "Agency",
        title_ara: "الوكالة",
      },
      props: (route) => route.query,
      component: () => import("@/views/guild/Create.vue"),
    },
    {
      path: "detail",
      name: "GuildDetail",
      meta: {
        title_en: "Agency",
        title_ara: "الوكالة",
      },
      props: (route) => route.query,
      component: () => import("@/views/guild/Detail.vue"),
    },
    {
      path: "card",
      name: "GuildCard",
      meta: {
        title_en: "Agency Card",
        title_ara: "بطاقة الوكيل",
      },
      props: (route) => route.query,
      component: () => import("@/views/guild/Card.vue"),
    },
    {
      path: "order",
      name: "GuildOrder",
      meta: {
        title_en: "Agency Order",
        title_ara: "طلب الوكالة",
      },
      props: (route) => route.query,
      component: () => import("@/views/guild/Order.vue"),
    },
    {
      path: "data",
      name: "GuildData",
      children: [
        {
          path: "monthly",
          name: "GuildMonthlyData",
          meta: {
            title_en: "Monthly Data",
            title_ara: "البيانات الشهرية",
          },
          props: (route) => route.query,
          component: () => import("@/views/guild/data/Monthly.vue"),
        },
        {
          path: "member",
          name: "GuildMemberData",
          meta: {
            title_en: "Member Data",
            title_ara: "بيانات العضوية"
          },
          props: (route) => route.query,
          component: () => import("@/views/guild/data/Member.vue"),
        },
      ],
    },
  ],
};
