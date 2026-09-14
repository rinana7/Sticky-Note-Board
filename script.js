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
    const dateInput = document.getElementById("task-date");
    
    const taskText = input.value.trim();
    const taskDueDate = dateInput.value;

    const priorityInput = document.getElementById("task-priority");
    const priority = priorityInput.value;

    if (taskText === "") return;

    const newTask = document.createElement("div");
    newTask.className = `task priority-${priority}`;
    const randomRotation = (Math.random() * 4 - 2).toFixed(1);
    newTask.style.setProperty("--note-rotation", `${randomRotation}deg`);
    newTask.id = "task-" + taskIdCounter++;
    newTask.draggable = true;
    newTask.ondragstart = drag;

    const contentDiv = document.createElement("div");
    contentDiv.className = "task-content";

    const textSpan = document.createElement("span");
    textSpan.className = "task-title";
    textSpan.innerText = taskText;
    contentDiv.appendChild(textSpan);

    if (taskDueDate) {
        const dateSpan = document.createElement("span");
        dateSpan.className = "task-date-badge";
        dateSpan.innerText = "Due: " + taskDueDate;
        contentDiv.appendChild(dateSpan);
    }

    newTask.appendChild(contentDiv);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerText = "×";
    deleteBtn.setAttribute("data-tooltip", "Delete task");
    deleteBtn.onclick = function(event) {
        event.stopPropagation();
        newTask.remove();
    };
    newTask.appendChild(deleteBtn);

    const todoBoard = document.querySelector(".board");
    todoBoard.appendChild(newTask);

    input.value = "";
    dateInput.value = "";
}