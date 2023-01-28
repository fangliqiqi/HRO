import HanziToPinyin from "./pinyin";
import Vue from "vue";
export default class Message extends Vue {
  mounted() {
    let hanZi = "你好吗";
    console.log("输出首字母" + HanziToPinyin.instance.initialTreatment(hanZi));
  }
}