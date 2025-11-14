export default {
    path: "/ramadan",
    redirect: "/ramadan/ramadan",
    children: [
        {
            path: "ramadan",
            name: "Ramadan",
            meta: {
                title_en: "The auspicious Month of Ramadan",
                title_ara: "الشهر الميمون شهر رمضان المبارك",
            },
            props: (route) => route.query,
            component: () => import("@/views/ramadan/ramadan.vue"),
        },
    ],
};
