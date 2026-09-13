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
    newTask.ondragstart = drag;

    const textSpan = document.createElement("span");
    textSpan.innerText = taskText;
    newTask.appendChild(textSpan);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerText = "×";
    deleteBtn.onclick = function(event) {
        event.stopPropagation(); 
        newTask.remove();
    };
    newTask.appendChild(deleteBtn);

    const todoBoard = document.querySelector(".board");
    todoBoard.appendChild(newTask);

    input.value = "";
}