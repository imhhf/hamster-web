// CP相关
export default {
  path: "/roomWeekAct",
  redirect: "/roomWeekAct/roomWeekAct",
  children: [
    {
      path: "roomWeekAct",
      name: "RoomWeekAct",
      meta: {
        title_en: "Room of the Week Awards",
        title_ara: "جوائز غرفة الأسبوع",
      },
      props: (route) => route.query,
      component: () => import("@/views/roomWeekAct/roomWeekAct.vue"),
    },
  ],
};
