import { defineStore } from "pinia"
import { ref } from "vue"
import { useStudentsListStore } from "./studentsList"

export const useSubjectsListStore = defineStore('subjectsList', () => {
    const subjectsList = ref([])
    let updateScore = {}//更新单次学生成绩
    const examinationForm = ref([])//新增考试所用Form
    const studentsListStore = useStudentsListStore()
    function refresh(axios) {
        axios({
            method: "get",
            url: "/subject/all",
        }).then((res) => {
            let data = res.data
            if (data.code == 1) {
                subjectsList.value = data.data
                subjectsList.value.forEach(element => {
                    element["isEdit"] = false
                });
                data.data.forEach((subject) => {
                    //初始化编辑分数
                    updateScore[subject.id.toString()] = 0
                })
                //初始化新建考试Form
                axios({
                    method: "get",
                    url: "/student/all",
                }).then((res) => {
                    let data = res.data
                    if (data.code == 1) {
                        studentsListStore.studentsList = data.data
                        examinationForm.value = []
                        studentsListStore.studentsList.forEach(student => {
                            //console.log(student)
                            let item = {
                                studentName: student.studentName,
                                studentNum: student.studentNum
                            }
                            subjectsList.value.forEach((subject) => {
                                item[subject.id.toString()] = 0
                            })
                            examinationForm.value.push(item)
                        })
                    } else {
                        ElMessage.error(data.message)
                    }

                })
            } else {
                ElMessage.info(data.message)
            }
        })
    }
    return { subjectsList, refresh, updateScore, examinationForm }
})