import { projectData, projectFinish } from "./project.js"
import { save } from "./save&load.js"
import { updateGrid } from "./screen.js"
export const taskData = []
export const taskId = { value: 0 }

export const taskControl = (() => {
    class task {
        constructor(name, project, description, priority, importance, dueDate, id) {
            this.name = name
            this.project = project
            this.description = description
            this.priority = priority
            this.importance = importance
            this.dueDate = dueDate
            this.id = id
            this.finished = false
            this.dlt = `<span class="mdi mdi-delete-outline"></span>`
            this.edit = `<span class="mdi mdi-delete-outline"></span>`
        }
    }

    const addTask = document.querySelector("#add_task")
    const task_dialog = document.querySelector("#dialog")

    addTask.addEventListener("click", () => {
        if (projectData.length === 0) {
            alert("You must create a project first")
            const addPro = document.querySelector("#add_project")
            addPro.click()
        } else {
            task_dialog.innerHTML =
                `<form action="#" class="form" id="form">
            <h1>Create Task</h1>
            <label for="name">Title:</label>
            <input type="text" autocomplete="off" required autofocus id="name" maxlength="20">
            <label for="description">Description:</label>
            <textarea required autocomplete="off" id="description"></textarea>
            <label for="due_date">Due Date:</label>
            <input required type="date" id="due_date">
            <label for="priority">Priority:</label>
            <select required id="priority">
                <option value="" disabled selected>Select Priority</option>
                <option value="none">None</option>
                <option value="low">Low</option>
                <option value="mid">Mid</option>
                <option value="high">High</option>
                <option value="crit">Critical</option>
            </select>
            <label for="task_project">Project:</label>
            <select required id="task_project">
                <option value="" disabled selected>Select Project</option>${projectOptions()}
            </select>
             <label for="importance">Important:</label>
            <input type="checkbox" id="importance">
            <button type="submit">Add Task</button>
            </form>
            <div class="close" id="close_dia"><span class="mdi mdi-close"></span></div>`
            task_dialog.classList.toggle("taskDia", true)
            task_dialog.showModal()

            const close = document.querySelector("#close_dia")
            const task_form = document.querySelector("#form")
            task_dialog.addEventListener("click", (e) => {
                if (e.target === task_dialog) {
                    task_dialog.close()
                    task_dialog.classList.toggle("taskDia", false)
                }
            })
            close.addEventListener("click", () => {
                task_dialog.close()
                task_dialog.classList.toggle("taskDia", false)
            })

            task_form.addEventListener("submit", (e) => {
                e.preventDefault()
                createTask()
                task_form.reset()
                task_dialog.close()
                task_dialog.classList.toggle("taskDia", false)
            })
        }
    })

    function createTask() {
        const taskName = document.querySelector("#name")
        const taskDesc = document.querySelector("#description")
        const taskDate = document.querySelector("#due_date")
        const taskPrio = document.querySelector("#priority")
        const taskProj = document.querySelector("#task_project")
        const taskImpo = document.querySelector("#importance")

        const regex = /^\s*$/g
        const test = taskData.some(task => task.name === taskName.value.trim())
        if (regex.test(taskName.value.trim()) || test) {
            alert("A Task With The Same Name Exists\nOr You Entered An Invalid Name\nPlease Enter Another Name")
            taskName.value = ``
        } else {
            const tsk = new task(taskName.value, taskProj.value, taskDesc.value, taskPrio.value, taskImpo.checked, new Date(taskDate.value), taskId.value)
            taskData.push(tsk)
            taskId.value++
            save()
            updateGrid(document.querySelector(".active"))
            const projects = Array.from(document.querySelectorAll(".project"))
            const pro = projects.find(pro => pro.querySelector("p").textContent === tsk.project)
            projectFinish(pro)
        }
    }
})

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function renderTask(task) {
    const taskContent = document.querySelector("#task_content")
    const taskCard = document.createElement("div")
    taskCard.className = "task-card"
    taskCard.dataset.taskId = task.id
    taskCard.innerHTML =
        `<div class="title">
                    <p>${task.name}</p>
                    <div class="btns">
                        <div class = "task-finished" title = "Finished"><span class="mdi mdi-check-decagram-outline"></span></div>
                        ${task.importance ? `<div class="impo flag">
                            <span class="mdi mdi-star"></span>
                        </div>` : `<div class="impo" id="impo">
                            <span class="mdi mdi-star-outline"></span>
                        </div>` }
                        <div class="edit-task"><span class="mdi mdi-pencil"></span></div>
                        <div class="dlt-task"><span class="mdi mdi-delete-outline"></span></div>
                    </div>
                </div>
                <span>project: ${task.project}</span>
                <div class="task-desc">
                    ${task.description}
                </div>
                <div class="info">
                    <div class="prio ${task.priority}">${task.priority === "crit" ? "Critical" : task.priority}</div>
                    <div class="date">${formatDate(task.dueDate)}</div>
                </div>
                <div class="overlay" ${task.finished ? 'style="display: flex;"' : ''}><span class="mdi mdi-check-decagram"></span></div>`
    const dlt = taskCard.querySelector(".dlt-task")
    dlt.addEventListener("click", () => {
        const confirmation = confirm("do you really want to delete this task?")
        if (confirmation) {
            const remove = taskData.findIndex(task => task.id === Number(taskCard.dataset.taskId))
            taskData.splice(remove, 1)
            save()
            taskCard.remove()
            const projects = Array.from(document.querySelectorAll(".project"))
            const pro = projects.find(pro => pro.querySelector("p").textContent === task.project)
            projectFinish(pro)
        }
    })
    const importance = taskCard.querySelector(".impo")
    importance.addEventListener("click", () => {
        let impo = taskData.find(task => task.id === Number(taskCard.dataset.taskId))
        if (importance.classList.contains("flag")) {
            importance.classList.toggle("flag")
            importance.innerHTML = `<span class="mdi mdi-star-outline"></span>`
            impo.importance = !impo.importance
        } else {
            importance.classList.toggle("flag")
            importance.innerHTML = `<span class="mdi mdi-star"></span>`
            impo.importance = !impo.importance
        }
        save()
        updateGrid(document.querySelector(".active"))
    })
    const finish = taskCard.querySelector(".task-finished")
    finish.addEventListener("click", () => {
        overlay.style.display = "flex"
        task.finished = true
        const projects = Array.from(document.querySelectorAll(".project"))
        const pro = projects.find(pro => pro.querySelector("p").textContent === task.project)
        projectFinish(pro)
        save()
    })
    const overlay = taskCard.querySelector(".overlay")
    overlay.addEventListener("click", () => {
        overlay.style.display = ""
        task.finished = false
        const projects = Array.from(document.querySelectorAll(".project"))
        const pro = projects.find(pro => pro.querySelector("p").textContent === task.project)
        projectFinish(pro)
        save()
    })
    const editTask = taskCard.querySelector(".edit-task")
    editTask.addEventListener("click", editTaskData)
    taskContent.appendChild(taskCard)
}

function editTaskData(e) {
    const task_dialog = document.querySelector("#dialog")
    const taskCard = e.target.closest(".task-card")
    const task = taskData.find(task => task.id === Number(taskCard.dataset.taskId))
    const formattedDueDate = task.dueDate.toISOString().split('T')[0]
    task_dialog.innerHTML =
        `<form action="#" class="form" id="form">
            <h1>Edit Task</h1>
            <label for="name">Title:</label>
            <input type="text" autocomplete="off" required autofocus id="name" maxlength="20" value="${task.name}">
            <label for="description">Description:</label>
            <textarea required autocomplete="off" id="description" >${task.description}</textarea>
            <label for="due_date">Due Date:</label>
            <input required type="date" id="due_date" value="${formattedDueDate}">
            <label for="priority">Priority:</label>
            <select required id="priority">
                <option value="" disabled >Select Priority</option>
                <option value="none" ${task.priority === "none" ? "selected" : ""} >None</option>
                <option value="low" ${task.priority === "low" ? "selected" : ""}>Low</option>
                <option value="mid" ${task.priority === "mid" ? "selected" : ""}>Mid</option>
                <option value="high" ${task.priority === "high" ? "selected" : ""}>High</option>
                <option value="crit" ${task.priority === "crit" ? "selected" : ""}>Critical</option>
            </select>
            <label for="task_project">Project:</label>
            <select required id="task_project">
                <option value="" disabled selected>Select Project</option>${projectOptions()}
            </select>
             <label for="importance">Important:</label>
            <input type="checkbox" id="importance" ${task.importance ? 'checked' : ''}>
            <button type="submit">Edit Task</button>
            </form>
            <div class="close" id="close_dia"><span class="mdi mdi-close"></span></div>`
    task_dialog.classList.toggle("taskDia", true)
    task_dialog.showModal()

    const close = document.querySelector("#close_dia")
    const task_form = document.querySelector("#form")
    const edit_input = document.querySelector("#name")
    task_dialog.addEventListener("click", (e) => {
        if (e.target === task_dialog) {
            task_dialog.close()
            task_dialog.classList.toggle("taskDia", false)
        }
    })
    close.addEventListener("click", () => {
        task_dialog.close()
        task_dialog.classList.toggle("taskDia", false)
    })

    task_form.addEventListener("submit", (e) => {
        e.preventDefault()
        editTaskSelected(edit_input.value.trim(), taskCard, task)
        task_form.reset()
        task_dialog.close()
        task_dialog.classList.toggle("taskDia", false)
    })
}

function editTaskSelected(newName, taskCard, task) {
    const taskName = document.querySelector("#name")
    const taskDesc = document.querySelector("#description")
    const taskDate = document.querySelector("#due_date")
    const taskPrio = document.querySelector("#priority")
    const taskProj = document.querySelector("#task_project")
    const taskImpo = document.querySelector("#importance")

    const test = taskData.some(task => task.name === newName.trim())
    const regex = /^\s*$/

    if (test || regex.test(newName)) {
        alert("A Project With The Same Name Exists\nOr You Entered An Invalid Name\nPlease Enter Another Name")
        document.querySelector("#name").value = ``
    } else {
        task.name = taskName.value.trim()
        task.importance = taskImpo.checked
        task.project = taskProj.value.trim()
        task.description = taskDesc.value.trim()
        task.priority = taskPrio.value
        task.date = new Date(taskDate.value)
        save()
        taskCard.innerHTML =
            `<div class="title">
                    <p>${task.name}</p>
                    <div class="btns">
                        <div class = "task-finished" title = "Finished"><span class="mdi mdi-check-decagram-outline"></span></div>
                        ${task.importance ? `<div class="impo flag">
                            <span class="mdi mdi-star"></span>
                        </div>` : `<div class="impo" id="impo">
                            <span class="mdi mdi-star-outline"></span>
                        </div>` }
                        <div class="edit-task"><span class="mdi mdi-pencil"></span></div>
                        <div class="dlt-task"><span class="mdi mdi-delete-outline"></span></div>
                    </div>
                </div>
                <span>project: ${task.project}</span>
                <div class="task-desc">
                    ${task.description}
                </div>
                <div class="info">
                    <div class="prio ${task.priority}">${task.priority === "crit" ? "Critical" : task.priority}</div>
                    <div class="date">${formatDate(task.dueDate)}</div>
                </div>
                <div class="overlay" ${task.finished ? 'style="display: flex;"' : ''}><span class="mdi mdi-check-decagram"></span></div>`
        const dlt = taskCard.querySelector(".dlt-task")
        dlt.addEventListener("click", () => {
            const confirmation = confirm("do you really want to delete this task?")
            if (confirmation) {
                const remove = taskData.findIndex(task => task.id === Number(taskCard.dataset.taskId))
                taskData.splice(remove, 1)
                save()
                taskCard.remove()
            }
        })
        const importance = taskCard.querySelector(".impo")
        importance.addEventListener("click", () => {
            let impo = taskData.find(task => task.id === Number(taskCard.dataset.taskId))
            if (importance.classList.contains("flag")) {
                importance.classList.toggle("flag")
                importance.innerHTML = `<span class="mdi mdi-star-outline"></span>`
                impo.importance = !impo.importance
            } else {
                importance.classList.toggle("flag")
                importance.innerHTML = `<span class="mdi mdi-star"></span>`
                impo.importance = !impo.importance
            }
            save()
            updateGrid(document.querySelector(".active"))
        })
        const finish = taskCard.querySelector(".task-finished")
        finish.addEventListener("click", () => {
            overlay.style.display = "flex"
            task.finished = true
            const projects = Array.from(document.querySelectorAll(".project"))
            const pro = projects.find(pro => pro.querySelector("p").textContent === task.project)
            projectFinish(pro)
            save()
        })
        const overlay = taskCard.querySelector(".overlay")
        overlay.addEventListener("click", () => {
            overlay.style.display = ""
            task.finished = false
            const projects = Array.from(document.querySelectorAll(".project"))
            const pro = projects.find(pro => pro.querySelector("p").textContent === task.project)
            projectFinish(pro)
            save()
        })
        const editTask = taskCard.querySelector(".edit-task")
        editTask.addEventListener("click", editTaskData)
        document.querySelector("#form").reset()
        document.querySelector("#dialog").close()
        updateGrid(document.querySelector(".active"))
    }
}

const projectOptions = function turnProjectsIntoOptions() {
    const options = projectData.map(pro => `<option value="${pro.name}">${pro.name}</option>`)
    return options.join("")
}