<template>
  <el-form label-position="left" label-width="100px" :model="form">
    <el-form-item label="姓名">
      <el-input placeholder="请输入姓名" v-model="form.studentName" />
    </el-form-item>

    <el-form-item label="性别">
      <el-select placeholder="请选择性别" v-model="sexText">
        <el-option value="男"> </el-option>
        <el-option value="女"> </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="出生日期"
      ><el-date-picker
        type="date"
        placeholder="请选择出生日期"
        :default-value="new Date(2000, 0, 1)"
        value-format="YYYY-MM-DD"
        v-model="form.birthday"
      />
    </el-form-item>

    <el-form-item label="住址">
      <el-input placeholder="请输入家庭住址" v-model="form.address" />
    </el-form-item>
    <el-form-item label="民族">
      <el-select placeholder="请选择民族" v-model="form.ethnic">
        <el-option v-for="(item, index) in ethnics" :key="index" :value="item">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="个人简介">
      <el-input type="textarea" :rows="2" v-model="form.information" />
    </el-form-item>

    <el-form-item label="是否为班干部"
      ><el-radio-group size="small" v-model="form.isLeader">
        <el-radio-button label="1" size="large">是</el-radio-button>
        <el-radio-button label="0" size="large">否</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <template #label
        ><el-button type="success" @click="updateStudent">提交</el-button>
        <el-button @click="cancelUpdate">取消</el-button>
      </template>
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup>
import { ref, reactive, computed, inject } from "vue"
import { useStudentsListStore } from "@/stores/studentsList"
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
const axios = inject("axios")
const studentsListStore = useStudentsListStore()
const form = computed(() => studentsListStore.editStudent)
const sexText = ref(form.value.sex == 1 ? "男" : "女")

function updateStudent() {
  axios({
    method: "put",
    url: "/student/upd",
    params: {
      studentNum: form.value.studentNum,
      studentName: form.value.studentName,
      sex: sexText.value === "男" ? 1 : 0,
      birthday: form.value.birthday.slice(0, 10),
      address: form.value.address,
      ethnic: form.value.ethnic,
      information: form.value.information,
      isLeader: form.value.isLeader,
    },
  })
    .then((res) => {
      studentsListStore.refresh(axios)
      let data = res.data
      if (data.code == 1) {
        ElNotification({
          title: "成功",
          type: "success",
          message: data.message,
        })
        studentsListStore.activeStudentCollapseItem = form.value.studentNum
        studentsListStore.isEdit = false
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
        message: "出错了！",
      })
    })
}

function cancelUpdate() {
  studentsListStore.activeStudentCollapseItem = form.value.studentNum
  studentsListStore.isEdit = false
}
</script>
<style></style>
