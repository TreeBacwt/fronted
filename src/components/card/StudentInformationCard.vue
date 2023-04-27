<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>个人信息</span>
        <el-button type="primary" text @click="handleEditButton">
          {{ isEdit ? "提交" : "编辑" }}</el-button
        >
        <el-button type="info" text @click="isEdit = !isEdit" v-if="isEdit"
          >取消</el-button
        >
      </div>
    </template>
    <div v-if="!isEdit">
      <div class="text item">姓名：{{ studentStore.student.studentName }}</div>
      <div class="text item">学号：{{ studentStore.student.studentNum }}</div>
      <div class="text item">性别：{{ studentStore.student.sex == 1 ? "男" : "女" }}</div>
      <div class="text item">生日：{{ studentStore.student.birthday.slice(0, 10) }}</div>
      <div class="text item">住址：{{ studentStore.student.address }}</div>
      <div class="text item">民族：{{ studentStore.student.ethnic }}</div>
      <div class="text item">
        是否为班干部：{{ studentStore.student.isLeader == 1 ? "是" : "否" }}
      </div>
      <div class="text item">个人简介：{{ studentStore.student.information }}</div>
    </div>

    <div v-else>
      <div class="text item">
        姓名：
        <el-input class="information-input" v-model="editStudent.studentName" />
      </div>
      <div class="text item">学号：{{ studentStore.student.studentNum }}</div>
      <div class="text item">
        性别：
        <el-radio-group v-model="editStudent.sex">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="0">女</el-radio>
        </el-radio-group>
      </div>
      <div class="text item">
        生日：
        <el-date-picker
          v-model="editStudent.birthday"
          type="date"
          placeholder="请选择出生日期"
          :default-value="new Date(2000, 0, 1)"
          value-format="YYYY-MM-DD"
        />
      </div>
      <div class="text item">
        住址：
        <el-input class="information-input" v-model="editStudent.address" />
      </div>
      <div class="text item">
        民族：
        <el-select placeholder="请选择民族" v-model="editStudent.ethnic">
          <el-option v-for="(item, index) in ethnics" :key="index" :value="item">
          </el-option>
        </el-select>
      </div>
      <div class="text item">
        是否为班干部：{{ studentStore.student.isLeader == 1 ? "是" : "否" }}
      </div>
      <div class="text item">
        个人简介：
        <el-input
          class="information-input"
          type="textarea"
          v-model="editStudent.information"
        />
      </div>
    </div>
  </el-card>
</template>
<script lang="ts" setup>
import { reactive, ref, inject, computed, onMounted } from "vue"
import { useUserStore } from "@/stores/user"
import { useStudentStore } from "@/stores/student"

const axios = inject("axios")
const userStore = useUserStore()
const user = computed(() => userStore.user)
const studentStore = useStudentStore()

onMounted(() => {
  studentStore.refreshStudent(axios, user.value.id)
})

const isEdit = ref(false)

const editStudent = ref()
function handleEditButton() {
  if (isEdit.value) {
    //提交
    if (
      editStudent.value.studentName !== "" &&
      editStudent.value.address !== "" &&
      editStudent.value.information !== ""
    ) {
      axios({
        method: "put",
        url: "/student/upd",
        params: editStudent.value,
      })
        .then((res) => {
          let data = res.data
          if (data.code == 1) {
            ElNotification({
              title: "成功",
              type: "success",
              message: data.message,
            })
            isEdit.value = false
            studentStore.refreshStudent(axios, user.value.id)
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
    } else {
      ElNotification({
        title: "警告",
        type: "warning",
        message: "输入信息不能为空！",
      })
    }
  } else {
    //进入编辑
    isEdit.value = !isEdit.value
    editStudent.value = {
      studentNum: studentStore.student.studentNum,
      studentName: studentStore.student.studentName,
      sex: studentStore.student.sex,
      birthday: studentStore.student.birthday.slice(0, 10),
      address: studentStore.student.address,
      ethnic: studentStore.student.ethnic,
      isLeader: studentStore.student.isLeader,
      information: studentStore.student.information,
    }
  }
}

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
.information-input {
  width: 40%;
}
</style>
