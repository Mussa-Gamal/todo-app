document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.querySelector('.input-container input'),
        filters = document.querySelectorAll('.middle-info p'),
        taskBox = document.querySelector('.task-box'),
        itemsLeft = document.querySelector('.items-left'),
        clearCompletedButton = document.querySelector('.clear-completed');

    let todos = JSON.parse(localStorage.getItem('todo-list')) || [];
    let itemsCount = 0;

    // Initialize itemsCount to the total count of active tasks
    if (todos) {
        itemsCount = todos.reduce((count, todo) => {
            return count + (todo.status !== 'completed' ? 1 : 0);
        }, 0);
    } else {
        itemsCount = 0;
    }

    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('p.active').classList.remove('active');
            btn.classList.add('active');
            showTodo(btn.id);
        });
    });

    clearCompletedButton.addEventListener('click', clearCompletedTasks);

    function clearCompletedTasks() {
        const activeTasks = todos.filter(todo => todo.status !== 'completed');
        todos = activeTasks;
        localStorage.setItem('todo-list', JSON.stringify(todos));
        showTodo('all'); // Always show all tasks after clearing completed
    }

    function showTodo(filter) {
        let div = '';

        if (todos) {
            todos.forEach((todo, id) => {
                let isCompleted = todo.status == 'completed' ? 'checked' : '';
                let circleIconClass = todo.status == 'completed' ? 'circle-icon-onclick' : '';
                let checkIconClass = todo.status == 'completed' ? 'check-icon-onclick' : '';

                if (filter == todo.status || filter == 'all') {
                    div += `
                        <div class="taskk">
                            <label for="${id}">
                                <div class="circle-icon-container">
                                    <div class="circle-icon ${circleIconClass}"></div>
                                    <svg class="check-icon ${checkIconClass}" xmlns="http://www.w3.org/2000/svg" width="11" height="9"><path fill="none" stroke="#FFF" stroke-width="2" d="M1 4.304L3.696 7l6-6"/></svg>
                                </div>
                                <input type="checkbox" id="${id}" ${isCompleted}>
                                <p class="${isCompleted}">${todo.name}</p>
                            </label>
                            <svg onclick="deleteTask(${id})" class="cross-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill="#494C6B" fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.971l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"/></svg>
                        </div>
                    `;
                }
            });
        }

        taskBox.innerHTML = div;

        // Add event listener to the dynamically created checkboxes
        document.querySelectorAll('.taskk input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', function () {
                updateStatus(this);
            });
        });

        // Update items count immediately after rendering tasks
        updateItemsCount();
    }

    window.deleteTask = function(deleteId) {
        todos.splice(deleteId, 1);
        localStorage.setItem('todo-list', JSON.stringify(todos));
        console.log('Deleted task:', deleteId, 'Remaining tasks:', todos);

        // Update the todos array directly after deletion
        todos = JSON.parse(localStorage.getItem('todo-list')) || [];

        // Update the items count in the UI
        updateItemsCount();

        showTodo(document.querySelector('.middle-info p.active').id);
    }

    function updateStatus(selectedTask) {
        let taskContainer = selectedTask.parentElement;
        let taskName = taskContainer.lastElementChild;
        let circleIcon = taskContainer.querySelector('.circle-icon');
        let checkIcon = taskContainer.querySelector('.check-icon');

        if (selectedTask.checked) {
            taskName.classList.add('checked');
            todos[selectedTask.id].status = 'completed';
            circleIcon.classList.add('circle-icon-onclick');
            checkIcon.classList.add('check-icon-onclick');
            itemsCount--;
        } else {
            taskName.classList.remove('checked');
            todos[selectedTask.id].status = 'active';
            circleIcon.classList.remove('circle-icon-onclick');
            checkIcon.classList.remove('check-icon-onclick');
            itemsCount++;
        }

        localStorage.setItem('todo-list', JSON.stringify(todos));
        updateItemsCount();
    }

    taskInput.addEventListener('keyup', e => {
        let userTask = taskInput.value.trim();
        if (e.key === 'Enter' && userTask !== '') {
            if (!todos) {
                todos = [];
            }
            taskInput.value = '';
            let taskInfo = { name: userTask, status: 'active' };
            todos.push(taskInfo);
            localStorage.setItem('todo-list', JSON.stringify(todos));

            // Update the todos array directly to ensure it reflects the latest state
            todos = JSON.parse(localStorage.getItem('todo-list')) || [];

            showTodo(document.querySelector('.middle-info p.active').id);
        }
    });

    function updateItemsCount() {
        // Retrieve the latest todos array from localStorage
        todos = JSON.parse(localStorage.getItem('todo-list')) || [];

        // Calculate the itemsCount based on the active tasks
        itemsCount = todos.reduce((count, todo) => {
            return count + (todo.status !== 'completed' ? 1 : 0);
        }, 0);

        // Update the items count in the UI
        itemsLeft.innerHTML = `${itemsCount} items left`;
    }

    // Initial rendering
    showTodo('all');
});

let sunIcon = document.querySelector('.sun-icon'),
	moonIcon = document.querySelector('.moon-icon'),
	bgImg = document.querySelector('.image-container img');

sunIcon.onclick = () => {
	sunIcon.style.display = 'none';
	moonIcon.style.display = 'block';
	document.body.classList.add('light-mode');
	bgImg.src = 'images/bg-desktop-light.jpg'
}

moonIcon.onclick = () => {
	sunIcon.style.display = 'block';
	moonIcon.style.display = 'none';
	document.body.classList.remove('light-mode');
	bgImg.src = 'images/bg-desktop-dark.jpg'
}