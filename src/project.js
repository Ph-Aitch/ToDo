import { save } from "./save&load.js"
import { updateGrid } from "./screen.js"
import { taskData } from "./task.js"

export const projectData = []
export const projectId = { value: 0 }

export const projectControl = (() => {
    class project {
        constructor(name, id) {
            this.name = name
            this.dlt = `<span class="mdi mdi-delete-outline"></span>`
            this.id = id
            this.finished = false
        }
    }


    const addProject = document.querySelector("#add_project")
    const project_dialog = document.querySelector("#dialog")

    addProject.addEventListener("click", () => {
        project_dialog.innerHTML = `<form action="#" id="form" class="form">
        <h1>Create Project</h1>
        <label for="name">Project Name</label>
        <input type="text" autocomplete="off" required autofocus id="name" maxlength="20">
        <button type="submit">Add Project</button>
        </form>
        <div class="close" id="close_dia"><span class="mdi mdi-close"></span></div>`
        project_dialog.showModal()

        const close = document.querySelector("#close_dia")
        const project_form = document.querySelector("#form")
        project_dialog.addEventListener("click", (e) => {
            if (e.target === project_dialog) {
                project_dialog.close()
            }
        })
        close.addEventListener("click", () => {
            project_dialog.close()
        })

        project_form.addEventListener("submit", (e) => {
            e.preventDefault()
            createProject()
            save()
            project_form.reset()
            project_dialog.close()
        })
    })

    function createProject() {
        const input = document.querySelector("#name")
        const regex = /^\s*$/g
        const test = projectData.some(project => project.name === input.value.trim())
        if (regex.test(input.value.trim()) || test) {
            alert("A Project With The Same Name Exists\nOr You Entered An Invalid Name\nPlease Enter Another Name")
            input.value = ``
        } else {
            const pro = new project(input.value.trim(), projectId.value);
            projectData.push(pro)
            projectId.value++
            save()
            render(pro)
        }
    }

})

export function render(pro) {
    const projectContent = document.querySelector("#project_content")
    const project = document.createElement("div")
    const name = document.createElement("p")
    const dlt = document.createElement("div")
    project.innerHTML +=
        `<svg class="circle" id="pieChart"><circle class="fill"/></svg>`
    project.className = "project"
    project.dataset.projectId = pro.id
    name.textContent = pro.name
    dlt.innerHTML = pro.dlt
    dlt.className = "dlt"
    dlt.addEventListener("click", () => {
        const confirmation = confirm("Do you really want to delete this project?")
        if (confirmation) {
            const confirmation2 = confirm("You will also remove all assosiated TASKs with this project")
            if (confirmation2) {
                const remove = projectData.findIndex(pro => pro.id === Number(project.dataset.projectId))
                projectData.splice(remove, 1)
                const newTaskData = taskData.filter(task => task.project !== project.querySelector("p").textContent)
                taskData.length = 0
                newTaskData.forEach(task => taskData.push(task))
                project.remove()
                projectData.length === 0 ? document.querySelector(".tab").click() : document.querySelector(".project").click()
                updateGrid(document.querySelector(".active"))
                save()
            }
        }
    })
    project.appendChild(name)
    project.appendChild(dlt)
    projectContent.appendChild(project)
    projectFinish(project)
}

export function projectFinish(pro) {
    const tasksCount = taskData.filter(task => task.project === pro.querySelector("p").textContent).length
    const taskFinishedCount = taskData.filter(task => task.project === pro.querySelector("p").textContent && task.finished === true).length
    const project = projectData.find(proj => proj.name === pro.querySelector("p").textContent)
    if (tasksCount === 0) {
        pro.classList.toggle("finished", false)
        project.finished = false
        const circle = pro.querySelector("svg circle")
        const svg = pro.querySelector("svg")
        svg.style.border = ``
        circle.setAttribute("stroke-dashoffset", `55px`)
    } else if (tasksCount > 0 && tasksCount !== taskFinishedCount) {
        project.finished = false
        pro.classList.toggle("finished", false)
        const circle = pro.querySelector("svg circle")
        const svg = pro.querySelector("svg")
        svg.style.border = ``
        const newOffset = `${55 * (1 - taskFinishedCount / tasksCount)}px`
        circle.setAttribute("stroke-dashoffset", newOffset)
    } else if (tasksCount === taskFinishedCount) {
        project.finished = true
        pro.classList.toggle("finished", true)
        const circle = pro.querySelector("svg circle")
        const svg = pro.querySelector("svg")
        circle.setAttribute("stroke-dashoffset", `0px`)
        svg.style.border = `2px solid var(--secondry-bg)`
    } 
}