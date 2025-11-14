// 月充相关
export default {
  path: "/charge",
  redirect: "/charge/index",
  children: [
    {
      path: "index",
      name: "ChargeIndex",
      meta: {
        title_en: "Charge",
        title_ara: "شحن",
      },
      props: (route) => route.query,
      component: () => import("@/views/charge/Index.vue"),
    },
    {
      path: "certificate",
      name: "ChargeCertificate",
      meta: {
        title_en: "Certificate",
        title_ara: "شهادة",
      },
      props: (route) => route.query,
      component: () => import("@/views/charge/Certificate.vue"),
    },
  ],
};
