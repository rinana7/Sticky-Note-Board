let taskIdCounter = 1;
let currentEditingTask = null;

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
    event.target.classList.add("dragging");
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const draggedItem = document.getElementById(data);
    
    if (draggedItem) {
        draggedItem.classList.remove("dragging");
        event.currentTarget.appendChild(draggedItem);
        
        // Bounce animation on drop
        draggedItem.classList.add("dropped");
        setTimeout(() => draggedItem.classList.remove("dropped"), 300);

        updateBoardStats();
    }
}

document.addEventListener("dragend", function(event) {
    if (event.target.classList.contains("task")) {
        event.target.classList.remove("dragging");
    }
});

function createTask() {
    const input = document.getElementById("task-input");
    const dateInput = document.getElementById("task-date");
    const priorityInput = document.getElementById("task-priority");

    const taskText = input.value.trim();
    const taskDueDate = dateInput.value;
    const priority = priorityInput ? priorityInput.value : "medium";

    if (taskText === "") return;

    const newTask = document.createElement("div");
    newTask.className = `task priority-${priority}`;
    newTask.id = "task-" + taskIdCounter++;
    newTask.draggable = true;
    newTask.ondragstart = drag;

    newTask.dataset.priority = priority;
    newTask.dataset.dueDate = taskDueDate;
    newTask.dataset.description = "";

    const randomRotation = (Math.random() * 4 - 2).toFixed(1);
    newTask.style.setProperty("--note-rotation", `${randomRotation}deg`);

    newTask.onclick = function(e) {
        if (!e.target.classList.contains("delete-btn")) {
            openTaskModal(newTask);
        }
    };

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
        newTask.classList.add("deleting");
        setTimeout(() => {
            newTask.remove();
            updateBoardStats();
        }, 200);
    };
    newTask.appendChild(deleteBtn);

    const todoBoard = document.querySelector('.board[data-column="todo"]') || document.querySelectorAll('.board')[0];
    
    if (todoBoard) {
        todoBoard.appendChild(newTask);
        input.value = "";
        dateInput.value = "";
        if (priorityInput) priorityInput.value = "medium";
        updateBoardStats();
    }
}


function openTaskModal(taskElement) {
    currentEditingTask = taskElement;

    const titleSpan = taskElement.querySelector(".task-title");

    document.getElementById("modal-title").value = titleSpan ? titleSpan.innerText : "";
    document.getElementById("modal-description").value = taskElement.dataset.description || "";
    document.getElementById("modal-date").value = taskElement.dataset.dueDate || "";
    document.getElementById("modal-priority").value = taskElement.dataset.priority || "medium";

    document.getElementById("task-modal").classList.add("active");
}

function closeModal() {
    const modal = document.getElementById("task-modal");
    if (modal) modal.classList.remove("active");
    currentEditingTask = null;
}

function saveTaskDetails() {
    if (!currentEditingTask) return;

    const newTitle = document.getElementById("modal-title").value.trim();
    const newDescription = document.getElementById("modal-description").value.trim();
    const newDate = document.getElementById("modal-date").value;
    const newPriority = document.getElementById("modal-priority").value;

    if (newTitle === "") return;

    // Update datasets
    currentEditingTask.dataset.description = newDescription;
    currentEditingTask.dataset.dueDate = newDate;
    currentEditingTask.dataset.priority = newPriority;

    currentEditingTask.className = `task priority-${newPriority}`;

    const contentDiv = currentEditingTask.querySelector(".task-content");
    contentDiv.innerHTML = "";

    const textSpan = document.createElement("span");
    textSpan.className = "task-title";
    textSpan.innerText = newTitle;
    contentDiv.appendChild(textSpan);

    if (newDate) {
        const dateSpan = document.createElement("span");
        dateSpan.className = "task-date-badge";
        dateSpan.innerText = "Due: " + newDate;
        contentDiv.appendChild(dateSpan);
    }

    closeModal();
    updateBoardStats();
}

function updateBoardStats() {
    const boards = document.querySelectorAll('.board');
    if (boards.length < 3) return;

    const todoCount = boards[0].querySelectorAll('.task').length;
    const doingCount = boards[1].querySelectorAll('.task').length;
    const doneCount = boards[2].querySelectorAll('.task').length;
    const totalCount = todoCount + doingCount + doneCount;

    // Calculate ratio fill width
    const fillWidth = totalCount > 0 ? (doneCount / totalCount) * 100 : 0;

    const progressFill = document.getElementById("progress-fill");
    const progressStats = document.getElementById("progress-stats");

    if (progressFill) progressFill.style.width = `${fillWidth}%`;
    if (progressStats) progressStats.innerText = `${totalCount} tasks • ${doneCount} completed`;

    boards.forEach(board => {
        const taskCount = board.querySelectorAll('.task').length;
        const emptyState = board.querySelector('.empty-state');
        if (emptyState) {
            emptyState.style.display = taskCount === 0 ? 'block' : 'none';
        }
    });
}

document.addEventListener("DOMContentLoaded", updateBoardStats);

function allowPhotoDrop(event) {
    event.preventDefault();
}

function handlePhotoDrop(event, position) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files[0] && files[0].type.startsWith("image/")) {
        displayUploadedImage(files[0], position);
    }
}

function handlePhotoSelect(event, position) {
    const files = event.target.files;
    if (files && files[0]) {
        displayUploadedImage(files[0], position);
    }
}

function displayUploadedImage(file, position) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const imgElement = document.getElementById(`photo-img-${position}`);
        if (imgElement) {
            imgElement.src = e.target.result;
        }
    };
    reader.readAsDataURL(file);
}