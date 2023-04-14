<template>
  <div>
    <el-collapse>
      <el-collapse-item :name="index" v-for="(item, index) in affairsList" :key="index">
        <template #title>
          <span class="text">{{ item.affairName }}</span>
        </template>

        <div>
          <el-descriptions :column="1" class="description">
            <template #extra>
              <el-button type="primary" class="edit-button" @click="editAffair"
                >编辑</el-button
              >
              <el-button type="danger" class="edit-button" @click="deleteAffair"
                >删除</el-button
              >
            </template>
            <el-descriptions-item label="日期">{{
              item.affairDate.slice(0, 10)
            }}</el-descriptions-item>
            <el-descriptions-item label="详细情况">{{
              item.information
            }}</el-descriptions-item>
            <el-descriptions-item label="结果">{{ item.result }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </el-collapse-item>
    </el-collapse>
    <div class="paginationContainer">
      <el-pagination
        layout="prev, pager, next"
        :total="total"
        class="pagination"
        v-model:current-page="currentPage"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, inject, computed } from "vue"
import { useAffairsListStore } from "@/stores/affairsList"

const axios = inject("axios")
const affairsListStore = useAffairsListStore()
const affairsList = computed(() => affairsListStore.affairsList)
affairsListStore.refresh(axios, 1)

const total = ref(0)
const currentPage = ref(1)
getTotal()

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
  affairsListStore.refresh(axios, currentPage.value)
}
function editAffair() {
  ElMessage.info("功能尚未完成")
}
function deleteAffair() {
  ElMessage.info("功能尚未完成")
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
