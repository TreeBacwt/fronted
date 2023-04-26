<template>
  <el-card class="box-card" shadow="hover">
    <template #header>
      <div class="card-header">
        <span>编辑班级事务</span>
        <el-button type="primary" class="button" text @click="updateAffair"
          >提交</el-button
        >
      </div>
    </template>

    <el-form label-position="left" label-width="100px" :model="form">
      <el-form-item label="事务名称">
        <el-input v-model="form.affairName" placeholder="请输入事务名称" />
      </el-form-item>

      <el-form-item label="事务日期"
        ><el-date-picker
          v-model="form.affairDate"
          type="date"
          placeholder="请选择事务日期"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>

      <el-form-item label="详细情况">
        <el-input
          v-model="form.information"
          type="textarea"
          :rows="2"
          placeholder="记录事务详细经过"
        />
      </el-form-item>

      <el-form-item label="结果">
        <el-input
          v-model="form.result"
          type="textarea"
          :rows="2"
          placeholder="记录事务最终结果"
        />
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script lang="ts" setup>
import { reactive, ref, inject, computed } from "vue"
import { useAffairsListStore } from "@/stores/affairsList"

const axios = inject("axios")
const affairsListStore = useAffairsListStore()

const form = computed(() => affairsListStore.editAffair)

function updateAffair() {
  if (
    form.affairName === "" ||
    form.affairDate === "" ||
    form.information === "" ||
    form.result === ""
  ) {
    ElNotification({
      title: "警告",
      type: "warning",
      message: "事务信息不能为空",
    })
  } else {
    axios({
      method: "put",
      url: "/affair/upd",
      params: {
        id: form.value.id,
        affairName: form.value.affairName,
        affairDate: form.value.affairDate.slice(0, 10),
        information: form.value.information,
        result: form.value.result,
      },
    })
      .then((res) => {
        let data = res.data
        if (data.code == 1) {
          //重置form
          affairsListStore.editAffair = {}
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
        affairsListStore.refresh(axios, affairsListStore.currentPage) //刷新事务列表
      })
      .catch((res) => {
        ElNotification({
          title: "错误",
          type: "error",
          message: "出错了！",
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
