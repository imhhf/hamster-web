// 充值相关
export default {
    path: "/reseller",
    redirect: "/reseller/index",
    children: [
      {
        path: "index",
        name: "RechargeIndex",
        meta: {
          title_en: "Recharge",
          title_ara: "شحن",
        },
        props: (route) => route.query,
        component: () => import("@/views/reseller/index.vue"),
      },
      {
        path: "order",
        name: "RechargeOrder",
        meta: {
          title_en: "orser",
          title_ara: "شحن",
        },
        props: (route) => route.query,
        component: () => import("@/views/reseller/order.vue"),
      },
      {
        path: "detail",
        name: "RechargeDetail",
        meta: {
          title_en: "detail",
          title_ara: "شحن",
        },
        props: (route) => route.query,
        component: () => import("@/views/reseller/detail.vue"),
      },
    ],
  };
  