// 充值相关
// export default {
//   path: "/recharge",
//   redirect: "/recharge/index",
//   children: [
//     {
//       path: "index",
//       name: "RechargeIndex",
//       meta: {
//         title_en: "Recharge",
//         title_ara: "شحن",
//       },
//       props: (route) => route.query,
//       component: () => import("@/views/recharge/Index.vue"),
//     },
//   ],
// };
// 月充相关
export default {
  path: "/recharge",
  redirect: "/recharge/index",
  children: [
    {
      path: "index",
      name: "Recharge",
      meta: {
        title_en: "Recharge",
        title_ara: "شحن",
      },
      props: (route) => route.query,
      component: () => import("@/views/recharge/Index.vue"),
    },
  ],
};
