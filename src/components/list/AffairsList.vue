<template>
  <div>
    <el-collapse accordion>
      <el-collapse-item
        :name="item.id"
        v-for="(item, index) in affairsList"
        :key="item.id"
      >
        <template #title>
          <span class="text">{{ item.affairName }}</span>
        </template>

        <div>
          <el-descriptions :column="1" class="description">
            <template
              #extra
              v-if="
                user.role == 1 || (user.role == 2 && studentStore.student.isLeader == 1)
              "
            >
              <el-button type="primary" class="edit-button" @click="editAffair(item)"
                >编辑</el-button
              >
              <el-button type="danger" class="edit-button" @click="deleteAffair(item.id)"
                >删除</el-button
              >
            </template>
            <el-descriptions-item>
              <template #label>
                <el-tag>日期</el-tag>
              </template>
              {{ item.affairDate.slice(0, 10) }}</el-descriptions-item
            >
            <el-descriptions-item>
              <template #label>
                <el-tag>详细情况</el-tag>
              </template>
              {{ item.information }}</el-descriptions-item
            >
            <el-descriptions-item>
              <template #label>
                <el-tag>结果</el-tag>
              </template>
              {{ item.result }}</el-descriptions-item
            >
          </el-descriptions>
        </div>
      </el-collapse-item>
    </el-collapse>
    <div class="paginationContainer">
      <el-pagination
        layout="prev, pager, next"
        :total="total"
        class="pagination"
        v-model:current-page="affairsListStore.currentPage"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, inject, computed } from "vue"
import { useAffairsListStore } from "@/stores/affairsList"
import { useUserStore } from "@/stores/user"
import { useStudentStore } from "@/stores/student"

const axios = inject("axios")
const affairsListStore = useAffairsListStore()
const affairsList = computed(() => affairsListStore.affairsList)
affairsListStore.refresh(axios, affairsListStore.currentPage)
const studentStore = useStudentStore()

const total = ref(0)
getTotal()

const user = computed(() => useUserStore().user)
function getTotal() {
  axios({
    method: "get",
    url: "/affair/count",
  }).then((res) => {
    let data = res.data
    if (data.code == 1) {
      total.value = data.data
    } else {
      ElNotification({
        title: "提示",
        message: data.message,
        type: "info",
      })
    }
  })
}
function handleCurrentChange() {
  affairsListStore.refresh(axios, affairsListStore.currentPage)
}
function editAffair(affair) {
  affairsListStore.editAffair = JSON.parse(JSON.stringify(affair))
}
function deleteAffair(id) {
  console.log(id)
  axios({
    method: "delete",
    url: "/affair/delete",
    params: {
      id,
    },
  })
    .then((res) => {
      let data = res.data
      if (data.code == 1) {
        affairsListStore.refresh(axios, affairsListStore.currentPage)
        ElNotification({
          title: "成功",
          message: data.message,
          type: "success",
        })
      } else {
        ElNotification({
          title: "错误",
          message: data.message,
          type: "error",
        })
      }
    })
    .catch((res) => {
      ElNotification({
        title: "错误",
        message: "出错了！",
        type: "error",
      })
    })
}
</script>
<style scoped>
.text {
  position: relative;
  left: 15px;
}
.paginationContainer {
  display: flex;
  flex-direction: column;
}
.pagination {
  align-self: center;
}
.description {
  position: relative;
  left: 15px;
}
.edit-button {
  position: relative;
  right: 30px;
}
</style>
