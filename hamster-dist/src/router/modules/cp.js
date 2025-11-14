// CP相关
export default {
  path: "/cp",
  redirect: "/cp/ranking",
  children: [
    {
      path: "ranking",
      name: "CpRanking",
      meta: {
        title_en: "Weekly CP",
        title_ara: "CP الأسبوعي",
      },
      props: (route) => route.query,
      component: () => import("@/views/cp/Ranking.vue"),
    },
    {
      path: "honor",
      name: "CpHonor",
      meta: {
        title_en: "Honor Hall",
        title_ara: "معبد المجد",
      },
      props: (route) => route.query,
      component: () => import("@/views/cp/Honor.vue"),
    },
  ],
};
