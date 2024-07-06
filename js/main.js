document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
});

function addTodo() {
    const itemInput = document.getElementById('itemInput');
    const quantityInput = document.getElementById('quantityInput');
    const durationInput = document.getElementById('durationInput');
    const itemText = itemInput.value.trim();
    const quantityText = quantityInput.value.trim();
    const duration = parseInt(durationInput.value, 10);

    if (itemText !== '' && quantityText !== '' && !isNaN(duration) && duration > 0) {
        const todo = {
            id: Date.now(),
            item: itemText,
            quantity: quantityText,
            timestamp: Date.now(),
            duration: duration * 3600000  //hour = 3600000    minutes = 60000 
        };
        saveTodoToLocalStorage(todo);
        addTodoToDOM(todo);
        itemInput.value = '';
        quantityInput.value = '';
        durationInput.value = '1';
    } else {
        alert("You cannot leave empty space!");
    }
}

function saveTodoToLocalStorage(todo) {
    let todos = getTodosFromLocalStorage();
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodosFromLocalStorage() {
    const todos = localStorage.getItem('todos');
    return todos ? JSON.parse(todos) : [];
}

function loadTodos() {
    const todos = getTodosFromLocalStorage();
    todos.forEach(todo => {
        if (isTodoExpired(todo)) {
            removeTodoFromLocalStorage(todo);
        } else {
            addTodoToDOM(todo);
        }
    });
}

function addTodoToDOM(todo) {
    const todoTable = document.getElementById('todoTable').querySelector('tbody');
    const row = document.createElement('tr');
    row.innerHTML = `
<td>${getTodoIndex(todo)}</td>
<td>${todo.item}</td>
<td>${todo.quantity}</td>
<td>
    <button class="edit-btn btn btn-warning inp"><b>Edit</b></button>
    <button class="delete-btn btn btn-danger inp"><b>Delete</b></button>
</td>
`;
    row.querySelector('.delete-btn').onclick = () => {
        removeTodoFromLocalStorage(todo);
        row.remove();
        updateTodoIndexes();
    };
    row.querySelector('.edit-btn').onclick = () => {
        editTodoInDOM(todo, row);
    };
    todoTable.appendChild(row);
}

function removeTodoFromLocalStorage(todo) {
    let todos = getTodosFromLocalStorage();
    todos = todos.filter(t => t.id !== todo.id);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function editTodoInDOM(todo, row) {
    const itemInput = document.getElementById('itemInput');
    const quantityInput = document.getElementById('quantityInput');
    itemInput.value = todo.item;
    quantityInput.value = todo.quantity;
    document.querySelector('button.btn-success').textContent = 'Update';
    document.querySelector('button.btn-success').onclick = () => {
        updateTodoInLocalStorage(todo, row);
    };
}

function updateTodoInLocalStorage(todo, row) {
    const itemInput = document.getElementById('itemInput');
    const quantityInput = document.getElementById('quantityInput');
    todo.item = itemInput.value.trim();
    todo.quantity = quantityInput.value.trim();
    let todos = getTodosFromLocalStorage();
    todos = todos.map(t => (t.id === todo.id ? todo : t));
    localStorage.setItem('todos', JSON.stringify(todos));
    row.children[1].textContent = todo.item;
    row.children[2].textContent = todo.quantity;
    itemInput.value = '';
    quantityInput.value = '';
    document.querySelector('button.btn-success').textContent = 'Add List';
    document.querySelector('button.btn-success').onclick = addTodo;
}

function getTodoIndex(todo) {
    const todos = getTodosFromLocalStorage();
    return todos.findIndex(t => t.id === todo.id) + 1;
}

function updateTodoIndexes() {
    const todoRows = document.querySelectorAll('#todoTable tbody tr');
    todoRows.forEach((row, index) => {
        row.children[0].textContent = index + 1;
    });
}

function isTodoExpired(todo) {
    const currentTime = Date.now();
    return currentTime > (todo.timestamp + todo.duration);
}