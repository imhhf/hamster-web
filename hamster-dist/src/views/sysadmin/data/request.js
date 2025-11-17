import { ref, defineProps } from "vue";
// import { fashRew2 } from '../ts/data';
import { getUserInfo } from "@/api/sysadmin";
const props = defineProps(["uid"]);

// 获取任务配置
export var userInfoData = ref();
export function UserInfo() {
//   loading.value = true;
  getUserInfo({
    uid: props.uid,
  })
    .then((data) => {
      userInfoData.value = data;
    })
    .catch((err) => {
    //   loading.value = false;
      showToast(err.message);
    });
}

UserInfo();
