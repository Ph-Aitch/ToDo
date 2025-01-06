import { projectData, projectId, render } from "./project.js";
import { updateGrid } from "./screen.js";
import { taskData, taskId } from "./task.js";

export function save() {
    localStorage.setItem("projectData", JSON.stringify(projectData))
    localStorage.setItem("projectId", JSON.stringify(projectId))
    localStorage.setItem("taskId", JSON.stringify(taskId))
    const taskDataWithStringDates = taskData.map(task => {
        return { ...task, dueDate: task.dueDate.toISOString() }
    })
    localStorage.setItem('taskData', JSON.stringify(taskDataWithStringDates));
}

export function load() {
    const savedProjectData = localStorage.getItem('projectData')
    const savedProjectId = localStorage.getItem('projectId')
    const savedTaskId = localStorage.getItem('taskId')
    const savedTaskData = localStorage.getItem('taskData')

    if (savedProjectId) {
        projectId.value = JSON.parse(savedProjectId).value
    }

    if (savedTaskId) {
        taskId.value = JSON.parse(savedTaskId).value
    }

    if (savedTaskData) {
        const parsedTaskData = JSON.parse(savedTaskData)
        const taskDataWithDateObjs = parsedTaskData.map(task => { return { ...task, dueDate: new Date(task.dueDate) } })
        taskData.push(...taskDataWithDateObjs)
        updateGrid(document.querySelector(".active"))
    }

    if (savedProjectData) {
        projectData.push(...JSON.parse(savedProjectData))
        projectData.forEach(pro => render(pro))
    }
}