// BD系统
export default {
    path: "/bdCenter",
    children: [
        {
            path: "index",
            name: "Index",
            meta: {
                title_en: "bdCenter",
                title_ara: "bdCenter",
            },
            props: (route) => route.query,
            component: () => import("@/views/bdCenter/index.vue"),
        },
        {
            path: "createBD",
            name: "CreateBD",
            meta: {
                title_en: "createBD",
                title_ara: "الوكالة",
            },
            props: (route) => route.query,
            component: () => import("@/views/sysadmin/createBD.vue"),
        },
    ],
};
