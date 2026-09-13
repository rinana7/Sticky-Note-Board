let taskIdCounter = 1;

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    event.currentTarget.appendChild(document.getElementById(data));
}

function createTask() {
    const input = document.getElementById("task-input");
    const taskText = input.value.trim();

    if (taskText === "") return;

    const newTask = document.createElement("div");
    newTask.className = "task";
    newTask.id = "task-" + taskIdCounter++;
    newTask.draggable = true;
    newTask.innerText = taskText;

    newTask.ondragstart = drag;

    const todoBoard = document.querySelector(".board");
    todoBoard.appendChild(newTask);

    input.value = "";
}