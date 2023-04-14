<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <span>添加学生账户</span>
        <el-button type="primary" class="button" text @click="addStudent">提交</el-button>
      </div>
    </template>

    <el-form label-position="left" label-width="100px" :model="form">
      <el-form-item label="账户名">
        <el-input v-model="form.account" @input="handleAccountInputChange" />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="form.studentName" />
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="sexText" placeholder="请选择性别">
          <el-option value="男"> </el-option>
          <el-option value="女"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="出生日期"
        ><el-date-picker
          v-model="form.birthday"
          type="date"
          placeholder="请选择出生日期"
          :default-value="new Date(2000, 0, 1)"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="住址">
        <el-input v-model="form.address" />
      </el-form-item>
      <el-form-item label="民族">
        <el-select v-model="form.ethnic" placeholder="请选择民族">
          <el-option v-for="(item, index) in ethnics" :key="index" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="个人简介">
        <el-input v-model="form.information" type="textarea" :rows="2" />
      </el-form-item>
      <el-form-item label="是否为班干部"
        ><el-radio-group v-model="form.isLeader" size="small">
          <el-radio-button label="1" size="large">是</el-radio-button>
          <el-radio-button label="0" size="large">否</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script lang="ts" setup>
import { reactive, ref, inject, computed } from "vue"
import { useUserStore } from "@/stores/user"
import { useRouter } from "vue-router"

const user = computed(() => useUserStore().user)
const axios = inject("axios")
const router = useRouter()

const sexText = ref("")
const sex = computed(() => (sexText.value === "男" ? 1 : 0))
const ethnics = [
  "汉族",
  "壮族",
  "满族",
  "回族",
  "苗族",
  "维吾尔族",
  "土家族",
  "彝族",
  "蒙古族",
  "藏族",
  "布依族",
  "侗族",
  "瑶族",
  "朝鲜族",
  "白族",
  "哈尼族",
  "哈萨克族",
  "黎族",
  "傣族",
  "畲族",
  "傈傈族",
  "仡佬族",
  "东乡族",
  "高山族",
  "拉祜族",
  "水族",
  "佤族",
  "纳西族",
  "羌族",
  "土族",
  "仫佬族",
  "锡伯族",
  "柯尔克孜族",
  "达斡尔族",
  "景颇族",
  "毛南族",
  "撒拉族",
  "布朗族",
  "塔吉克族",
  "阿昌族",
  "普米族",
  "鄂温克族",
  "怒族",
  "京族",
  "基诺族",
  "德昂族",
  "保安族",
  "俄罗斯族",
  "裕固族",
  "乌孜别克族",
  "门巴族",
  "鄂伦春族",
  "独龙族",
  "塔塔尔族",
  "赫哲族",
  "珞巴族",
]

const form = reactive({
  account: "",
  studentName: "",
  sex,
  birthday: "",
  address: "",
  ethnic: "",
  information: "这个人很懒，什么都没留下",
  isLeader: 0,
})

function addStudent() {
  axios({
    method: "post",
    url: "/user/register/stu",
    params: form,
  })
    .then((res) => {
      let data = res.data
      if (data.code == 1) {
        //重置数据
        form.account = ""
        form.studentName = ""
        sexText.value = ""
        form.birthday = ""
        form.address = ""
        form.ethnic = ""
        form.information = "这个人很懒，什么都没留下"
        form.isLeader = 0
        ElNotification({
          title: "成功",
          type: "success",
          message: data.message,
        })
      } else {
        ElNotification({
          title: "错误",
          type: "error",
          message: data.message,
        })
      }
    })
    .catch((res) =>
      ElNotification({
        title: "错误",
        type: "error",
        message: "出错了！",
      })
    )
}

function handleAccountInputChange() {
  if (form.account !== "") {
    axios({
      method: "get",
      url: "/user/checkAccount/" + form.account,
    })
      .then((res) => {
        let data = res.data
        if (data.code == 1) {
          ElNotification({
            title: "成功",
            type: "success",
            message: data.message,
          })
        } else {
          ElNotification({
            title: "错误",
            type: "error",
            message: data.message,
          })
        }
      })
      .catch((res) => {
        ElNotification({
          title: "错误",
          type: "error",
          message: res.data,
        })
      })
  }
}
</script>
<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
}

.text {
  font-size: 20px;
}

.item {
  display: flex;
  margin-bottom: 18px;
  text-align: left;
  height: 30px;
  align-items: center;
}
.card-body {
  display: flex;
}
</style>
