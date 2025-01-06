import "./styles.css";
import { theme } from "./theme.js";
import { projectControl } from "./project.js";
import { display } from "./screen.js";
import { taskControl } from "./task.js";
import { load } from "./save&load.js";
import { projectData, projectId } from "./project.js";
import { taskData, taskId } from "./task.js";

function init() {
    load()
    theme()
    projectControl()
    display()
    taskControl()
}

init()