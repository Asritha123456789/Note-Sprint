document.addEventListener('DOMContentLoaded', () => {
    fetchTasks();

    document.getElementById('addTaskBtn').addEventListener('click', addTask);
});

function addTask() {
    const taskName = document.getElementById('taskName').value;
    const taskDate = document.getElementById('taskDate').value;
    const taskTime = document.getElementById('taskTime').value;

    if (taskName && taskDate && taskTime) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '../php/add_task.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = function() {
            if (xhr.status === 200) {
                fetchTasks();
                document.getElementById('taskName').value = '';
                document.getElementById('taskDate').value = '';
                document.getElementById('taskTime').value = '';
            } else {
                alert('Failed to add task');
            }
        };
        xhr.send(`task=${encodeURIComponent(taskName)}&date=${encodeURIComponent(taskDate)}&time=${encodeURIComponent(taskTime)}`);
    } else {
        alert('Please fill all fields');
    }
}

function fetchTasks() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '../php/fetch_tasks.php', true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            const tasks = JSON.parse(xhr.responseText);
            const taskList = document.getElementById('taskList');
            taskList.innerHTML = '';
            tasks.forEach(task => {
                const taskItem = document.createElement('div');
                taskItem.classList.add('task-item');
                taskItem.innerHTML = `
                    <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="updateTask(${task.id}, this)">
                    <span>${task.task} - ${task.date} ${task.time}</span>
                    <button onclick="deleteTask(${task.id})">Delete</button>
                `;
                taskList.appendChild(taskItem);
            });
        }
    };
    xhr.send();
}

function updateTask(id, checkbox) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '../php/update_task.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
        if (xhr.status !== 200) {
            alert('Failed to update task');
        }
    };
    xhr.send(`id=${id}&completed=${checkbox.checked}`);
}

function deleteTask(id) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '../php/delete_task.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
        if (xhr.status === 200) {
            fetchTasks();
        } else {
            alert('Failed to delete task');
        }
    };
    xhr.send(`id=${id}`);
}
