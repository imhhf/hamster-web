// 公会相关
export default {
    path: "/sysadmin",
    children: [
        {
            path: "index",
            name: "SysadminIndex",
            meta: {
                title_en: "sysadmin",
                title_ara: "الوكالة",
            },
            props: (route) => route.query,
            component: () => import("@/views/sysadmin/index.vue"),
        },
        {
            path: "userInformation",
            name: "UserInformation",
            meta: {
                title_en: "userInformation",
                title_ara: "الوكالة",
            },
            props: (route) => route.query,
            component: () => import("@/views/sysadmin/userInformation.vue"),
        },
        {
            path: "banList",
            name: "BanList",
            meta: {
                title_en: "banList",
                title_ara: "الوكالة",
            },
            props: (route) => route.query,
            component: () => import("@/views/sysadmin/banList.vue"),
        },
        {
            path: "roomInformation",
            name: "RoomInformation",
            meta: {
                title_en: "roomInformation",
                title_ara: "الوكالة",
            },
            props: (route) => route.query,
            component: () => import("@/views/sysadmin/roomInformation.vue"),
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
        {
            path: "dataBD",
            name: "DataBD",
            meta: {
                title_en: "dataBD",
                title_ara: "الوكالة",
            },
            props: (route) => route.query,
            component: () => import("@/views/sysadmin/dataBD.vue"),
        },
    ],
};
