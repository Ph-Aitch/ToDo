import { projectData } from "./project.js"
import { save } from "./save&load.js"
import { taskData, renderTask } from "./task.js"

export const display = (() => {
    updateNav()
    document.addEventListener("click", (e) => {
        const projects = Array.from(document.querySelectorAll(".project"))
        const tabs = Array.from(document.querySelectorAll(".tab"))
        switch (e.target.className) {
            case "project":
            case "tab":
            case "project finished":
                projects.forEach(pro => pro.classList.toggle("active", false))
                tabs.forEach(tab => tab.classList.toggle("active", false))
                e.target.classList.toggle("active", true)
                updateNav()
                updateGrid(document.querySelector(".active"))
                break;
            default:
                break;
        }
    })
})

export function updateGrid(tab) {
    const content = document.querySelector("#task_content")
    const today = new Date()
    const oneWeekFromNow = new Date();
    const yesterday = new Date()
    switch (tab.id) {
        case "all_tasks":
            content.innerHTML = ``
            taskData.forEach(task => renderTask(task))
            document.querySelector(".active").click()
            break;
        case "today_tasks":
            content.innerHTML = ``
            const todayTasks = taskData.filter(task => task.dueDate.getDate() === today.getDate() && task.dueDate.getMonth() === today.getMonth() && task.dueDate.getFullYear() === today.getFullYear())
            todayTasks.forEach(task => renderTask(task))
            break;
        case "this_week_tasks":
            content.innerHTML = ``
            oneWeekFromNow.setDate(today.getDate() + 7)
            yesterday.setDate(today.getDate()-1)
            const weekTasks = taskData.filter(task => task.dueDate >= yesterday && task.dueDate <= oneWeekFromNow)
            weekTasks.forEach(task => renderTask(task))
            break;
        case "important_tasks":
            content.innerHTML = ``
            const importantTasks = taskData.filter(task => task.importance === true)
            importantTasks.forEach(task => renderTask(task))
            break;
        default:
            break;
    }
    if (tab.classList.contains("project")) {
        content.innerHTML = ``
        const projectTasks = taskData.filter(task => task.project === tab.querySelector("p").textContent)
        projectTasks.forEach(task => renderTask(task))
    }
}

function updateNav() {
    const navbar = document.querySelector("#navbar")
    const Selected = document.querySelector(".active")
    if (Selected.classList.contains("project")) {
        navbar.innerHTML = `<h1><span class="edit mdi mdi-pencil"></span> ${Selected.textContent.trim()}</h1>`
        const editBtn = document.querySelector("#navbar .edit")
        editBtn.addEventListener("click", edit)
    } else if (Selected.classList.contains("tab")) {
        navbar.innerHTML = `<h1>${Selected.textContent.trim()}</h1>`
    } else {
        navbar.innerHTML = ``
    }
}

function edit() {
    const edit_project_dialog = document.querySelector("#dialog")
    edit_project_dialog.innerHTML = `<form action="#" id="form" class="form">
    <h1>Edit Project</h1>
    <label for="name">Edit Name</label>
    <input type="text" autocomplete="off" required autofocus id="name" maxlength="20">
    <button type="submit">Edit Project</button>
    </form>
    <div class="close" id="close_dia"><span class="mdi mdi-close"></span></div>`
    edit_project_dialog.showModal()
    const edit_project_form = document.querySelector("#form")
    const edit_input = document.querySelector("#name")
    const close_edit = document.querySelector("#close_dia")

    edit_project_dialog.addEventListener("click", (e) => {
        if (e.target === edit_project_dialog) {
            edit_project_dialog.close()
        }
    })
    close_edit.addEventListener("click", () => {
        edit_project_dialog.close()
    })

    edit_project_form.onsubmit = (e) => {
        e.preventDefault()
        editSelection(edit_input.value.trim())
        save()
    }
}

function editSelection(newName) {
    const projects = document.querySelector("#project_content")
    const test = projectData.some(pro => pro.name === newName.trim())
    const regex = /^\s*$/

    if (test || regex.test(newName)) {
        alert("A Project With The Same Name Exists\nOr You Entered An Invalid Name\nPlease Enter Another Name")
        document.querySelector("#name").value = ``
    } else {
        const project = projects.querySelector(".active")
        const pro = projectData.find(pro => pro.id === Number(project.dataset.projectId))
        pro.name = String(newName.trim())
        const tsk = taskData.forEach(task => task.project === project.querySelector("p").textContent ? task.project = String(newName.trim()): task)
        project.querySelector("p").textContent = newName.trim()
        document.querySelector("#form").reset()
        document.querySelector("#dialog").close()
        save()
        updateNav()
        updateGrid(document.querySelector(".active"))
    }
}