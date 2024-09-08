// Getting all elements needed
let addTask = document.getElementById('addTask');
let taskName = document.getElementById('taskName');
let priority = document.getElementById('priority');
let taskDesc = document.getElementById('taskDesc');
let taskList = document.getElementById('task-list');
let completedTasksContainer = document.getElementById('completed-tasks');
let totalTasks = document.getElementById('total-tasks');
let completedTasksCount = document.getElementById('completed-tasks-count');
let info = document.getElementById('info');
let closeHint = document.getElementById('close-hint');
let systemMsg = document.getElementById('system-message');

// Declaring all variables needed
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Initial rendering of tasks from localStorage when the page loads
updateTasks();

// Add Task Button Click
addTask.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent form submission
    if (taskName.value && priority.value && taskDesc.value) {
        tasks.push({
            'name': taskName.value,
            'priority': priority.value,
            'description': taskDesc.value,
            'completed': false
        });
        
        saveTasksToLocalStorage(); // Save updated tasks to localStorage
        updateTasks();
        clearInputFields(); // Clear input fields after adding task
    } else {
        window.alert("Please enter all data");
    }
});

// Function to clear input fields after adding a task
function clearInputFields() {
    taskName.value = '';
    priority.value = '';
    taskDesc.value = '';
}

// Function to render tasks and update localStorage
function updateTasks() {
    taskList.innerHTML = ''; // Clear existing tasks before re-rendering
    completedTasksContainer.innerHTML = ''; // Clear completed tasks before re-rendering

    // Sort tasks by priority
    tasks.sort((a, b) => {
        const priorityOrder = { 'high': 1, 'medium': 2, 'low': 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    tasks.forEach((e, index) => {
        let temptask = document.createElement('div');
        temptask.classList.add('tasks');
        
        // Determine the priority class
        let priorityClass = '';
        switch (e.priority) {
            case 'high':
                priorityClass = 'priority-high';
                break;
            case 'medium':
                priorityClass = 'priority-medium';
                break;
            case 'low':
                priorityClass = 'priority-low';
                break;
            default:
                priorityClass = '';
        }

        temptask.innerHTML = `
        <div class='heading'>
            <h1>${e.name}</h1> 
            <i class="delete-btn" data-id="${index}">Delete</i>
        </div>
        <span class="${priorityClass}">Priority: ${e.priority}</span>
        <p>${e.description}</p>
        <button class="completed-btn" data-id="${index}">${e.completed ? 'Completed' : 'Mark as Completed'}</button>`;

        if (e.completed) {
            completedTasksContainer.appendChild(temptask);
        } else {
            taskList.appendChild(temptask);
        }
    });

    // Update the total task count
    totalTasks.innerHTML = tasks.length;
    
    // Update the completed task count
    const completedCount = tasks.filter(task => task.completed).length;
    completedTasksCount.innerHTML = completedCount;

    // Update system messages
    updateSystemMessage();

    // Add event listeners to "Delete" and "Mark as Completed" buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', deleteTask);
    });

    document.querySelectorAll('.completed-btn').forEach(btn => {
        btn.addEventListener('click', markCompleted);
    });
}

// Function to delete a task
function deleteTask(e) {
    const taskId = e.target.getAttribute('data-id');
    tasks.splice(taskId, 1);
    saveTasksToLocalStorage(); // Save updated tasks to localStorage
    updateTasks(); // Re-render task list
}

// Function to mark a task as completed
function markCompleted(e) {
    const taskId = e.target.getAttribute('data-id');
    tasks[taskId].completed = true;
    saveTasksToLocalStorage(); // Save updated tasks to localStorage
    updateTasks(); // Re-render task list
}

// Function to save tasks to localStorage
function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to update system messages
function updateSystemMessage() {
    if (tasks.length === 0) {
        systemMsg.textContent = "You have no tasks yet.";
    } else {
        systemMsg.textContent = ""; // Clear system message if there are tasks
    }
}

// Function to hide the info message with animation
function hideInfo() {
    info.classList.add('info-disappear');
    // Remove the info element from the DOM after animation completes
    setTimeout(() => {
        info.style.display = 'none';
    }, 10000); // Match the duration of the animation
}

// Add event listener to close hint button
closeHint.addEventListener('click', () => info.style.display = 'none');

// Automatically hide the info message after 10 seconds
setTimeout(hideInfo, 10000);
