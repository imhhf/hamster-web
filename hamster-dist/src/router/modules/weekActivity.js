// CP相关
export default {
    path: "/weekActivity",
    redirect: "/weekActivity/weekActivity",
    children: [
        {
            path: "weekActivity",
            name: "WeekActivity",
            meta: {
                title_en: "weekActivity",
                title_ara: "جوائز غرفة الأسبوع",
            },
            props: (route) => route.query,
            component: () => import("@/views/weekActivity/weekActivity.vue"),
        },
    ],
};
