const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const toggleThemeBtn = document.getElementById('toggleThemeBtn');

loadTasks(); // Load tasks from localStorage when the page loads
loadTheme(); // Load theme from localStorage when the page loads
toggleThemeBtn.addEventListener('click', toggleTheme);

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        addTaskToList(task.text, task.status);
    });
}

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        const allTasksComplete = Array.from(taskList.querySelectorAll('.task-item')).every(taskItem => taskItem.classList.contains('complete'));
        
        // If all tasks are complete, add the new task as inprogress
        const status = allTasksComplete ? 'inprogress' : 'todo';
        
        addTaskToList(taskText, status);
        saveTasks();
        taskInput.value = '';
    } else {
        alert('Please enter a task before adding!');
    }
}

function addTaskToList(taskText, status) {
    const li = document.createElement('li');
    li.className = 'task-item'; // Set class to 'task-item' only

    // Create status span
    const statusSpan = document.createElement('span');
    statusSpan.className = 'status';

    // Define icon class based on status
    let iconClass;
    if (status === 'complete') {
        iconClass = 'fas fa-check-circle'; // Checkmark icon for complete tasks
    } else if (status === 'inprogress') {
        iconClass = 'fas fa-hourglass-half'; // Hourglass icon for inprogress tasks
    } else {
        iconClass = 'fas fa-times-circle'; // Cross icon for todo tasks
    }

    // Create icon element
    const icon = document.createElement('i');
    icon.className = iconClass;

    // Append icon to status span
    statusSpan.appendChild(icon);
    
    // Create status text
    const statusText = document.createTextNode(status);

    // Append status text to status span
    statusSpan.appendChild(statusText);

    // Create task text span
    const taskTextSpan = document.createElement('span');
    taskTextSpan.textContent = taskText;

    // Create date-time span
    const dateTimeSpan = document.createElement('span');
    const currentDate = new Date();
    const dateTimeString = currentDate.toLocaleString();
    dateTimeSpan.textContent = dateTimeString;
    dateTimeSpan.classList.add('date-time')
   
    // Append spans to li element
    li.appendChild(statusSpan);
    li.appendChild(taskTextSpan);
    li.appendChild(dateTimeSpan);

    // Add the status as a separate class
    li.classList.add(status);

    // Append li to taskList
    taskList.appendChild(li);

 
        // Check if all tasks are complete
        const allTasksComplete = Array.from(taskList.querySelectorAll('.task-item')).every(taskItem => taskItem.classList.contains('complete'));
        
        // Set the new task's status based on the current state of all tasks
        if (allTasksComplete && status === 'todo') {
        li.classList.remove('todo');
        li.classList.add('inprogress');
        li.querySelector('.status').textContent = 'inprogress';
        }
        
        li.addEventListener('click', toggleTaskStatus);
        li.addEventListener('touchstart', startPress);
        li.addEventListener('touchend', cancelPress);
        
        
        }

function saveTasks() {
    const tasks = [];
    taskList.querySelectorAll('.task-item').forEach(taskItem => {
        tasks.push({
            text: taskItem.querySelector('span:nth-child(2)').textContent,
            status: taskItem.classList.contains('complete') ? 'complete' : taskItem.classList.contains('inprogress') ? 'inprogress' : 'todo'
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    toggleThemeBtn.classList.toggle('rotate');
    const currentIcon = toggleThemeBtn.classList.contains('rotate') ? 'fa-sun' : 'fa-moon';
    toggleThemeBtn.classList.remove(currentIcon);
    toggleThemeBtn.classList.add(currentIcon === 'fa-moon' ? 'fa-sun' : 'fa-moon');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

function loadTheme() {
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const prefersLightMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    const theme = localStorage.getItem('theme');

    if (theme === 'light' || (theme !== 'dark' && prefersLightMode)) {
        document.body.classList.remove('dark-mode');
        toggleThemeBtn.classList.remove('rotate');
        toggleThemeBtn.classList.remove('fa-moon');
        toggleThemeBtn.classList.add('fa-sun');
    } else if (theme === 'dark' || (theme !== 'light' && prefersDarkMode)) {
        document.body.classList.add('dark-mode');
        toggleThemeBtn.classList.add('rotate');
        toggleThemeBtn.classList.remove('fa-sun');
        toggleThemeBtn.classList.add('fa-moon');
    }
}



addTaskBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Add event listener for task status toggling
taskList.addEventListener('click', function(event) {
    if (event.target.closest('.task-item')) {
        toggleTaskStatus(event.target.closest('.task-item'));
    }
});

// Add event listener for task deletion
taskList.addEventListener('click', function(event) {
    if (event.target.closest('.delete-btn')) {
        deleteTask(event.target.closest('.task-item'));
    }
});

function toggleTaskStatus(taskItem) {
    // Code to toggle task status
    saveTasks();
}

function deleteTask(taskItem) {
    taskItem.remove();
    saveTasks();
}


function startPress(event) {
            const li = event.currentTarget;
            pressTimer = setTimeout(() => {
                deleteTask(li);
            }, 500); // Adjust the duration here for the long press
        }

        function cancelPress() {
            clearTimeout(pressTimer);
        }
        
       function toggleTaskStatus(event) {
       const li = event.currentTarget;
       const statusSpan = li.querySelector('.status');
       
       if (li.classList.contains('todo')) {
       li.classList.remove('todo');
       li.classList.add('complete');
       // Update status span with icon for complete tasks
       statusSpan.innerHTML = '<i class="fas fa-check-circle"></i> Complete';
       
       // Check for next task and update its status if needed
       const nextTask = li.nextElementSibling;
       if (nextTask && nextTask.classList.contains('todo')) {
       nextTask.classList.remove('todo');
       nextTask.classList.add('inprogress');
       nextTask.querySelector('.status').innerHTML = '<i class="fas fa-hourglass-half"></i> In Progress'; // Update status with icon for in progress
       }
       } else if (li.classList.contains('inprogress')) {
       li.classList.remove('inprogress');
       li.classList.add('complete');
       // Update status span with icon for complete tasks
       statusSpan.innerHTML = '<i class="fas fa-check-circle"></i> Complete';
       
       // Check for next task and update its status if needed
       const nextTask = li.nextElementSibling;
       if (nextTask && nextTask.classList.contains('todo')) {
       nextTask.classList.remove('todo');
       nextTask.classList.add('inprogress');
       nextTask.querySelector('.status').innerHTML = '<i class="fas fa-hourglass-half"></i> In Progress'; // Update status with icon for in progress
       }
       }
       
       saveTasks();
       }
       
       
       