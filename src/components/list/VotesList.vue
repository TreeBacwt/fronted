<template>
  <div>
    <el-collapse accordion v-model="activeName">
      <el-collapse-item v-for="(vote, index) in voteStore.votesList" :key="index">
        <template #title>
          <span class="text">{{ vote.voteName }}</span>
          <span class="start-date">
            开始时间
            <el-tag class="date-tag">
              {{ vote.voteDate.slice(0, 10) }}
            </el-tag>
          </span>
          <span class="over-date">
            结束时间
            <el-tag class="date-tag" type="info">
              {{ vote.overDate.slice(0, 10) }}
            </el-tag>
          </span>
        </template>
      </el-collapse-item>
    </el-collapse>
    <div class="paginationContainer">
      <el-pagination
        layout="prev, pager, next"
        class="pagination"
        v-model:current-page="voteStore.currentPage"
        :total="voteStore.total"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, inject, onMounted } from "vue"
import { useVoteStore } from "@/stores/vote"

const activeName = ref("")
const voteStore = useVoteStore()
const axios = inject("axios")

onMounted(() => {
  voteStore.refreshVotesList(axios)
  voteStore.getTotal(axios)
})

function handleCurrentChange() {
  voteStore.refreshVotesList(axios, voteStore.currentPage)
}
</script>
<style scoped>
.text {
  position: relative;
  left: 15px;
}
.start-date {
  position: relative;
  left: 25px;
}
.over-date {
  position: relative;
  left: 50px;
}
.date-tag {
  position: relative;
  left: 10px;
}
.paginationContainer {
  display: flex;
  flex-direction: column;
}
.pagination {
  align-self: center;
}
</style>
