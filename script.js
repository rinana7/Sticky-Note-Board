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
    var draggedItem = document.getElementById(data);
    
    if (draggedItem) {
        event.currentTarget.appendChild(draggedItem);
        updateBoardStats(); // Update stats on drop
    }
}

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
        updateBoardStats(); // Update stats on deletion
    };
    newTask.appendChild(deleteBtn);

    // Target the specific todo board or fallback to first board
    const todoBoard = document.querySelector('.board[data-column="todo"]') || document.querySelector(".board");
    
    if (todoBoard) {
        todoBoard.appendChild(newTask);
        input.value = "";
        dateInput.value = "";
        updateBoardStats(); // Update stats on task creation
    }
}

function updateBoardStats() {
    const boards = document.querySelectorAll('.board');
    if (boards.length < 3) return;

    const todoCount = boards[0].querySelectorAll('.task').length;
    const doingCount = boards[1].querySelectorAll('.task').length;
    const doneCount = boards[2].querySelectorAll('.task').length;
    const totalCount = todoCount + doingCount + doneCount;

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