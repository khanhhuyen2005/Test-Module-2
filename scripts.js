const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const filterAll = document.getElementById('filter-all');
const filterActive = document.getElementById('filter-active');
const filterCompleted = document.getElementById('filter-completed');
const deleteAll = document.getElementById('delete-all');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
    todoList.innerHTML = '';

    const filteredTodos = todos.filter(function(todo) {
        if (currentFilter === 'active') return !todo.completed;
        if (currentFilter === 'completed') return todo.completed;
        return true;
    });

    filteredTodos.forEach(function(todo, index) {
        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''}>
            <span class="${todo.completed ? 'completed' : ''}">${todo.text}</span>
            <button class="delete-task">✖</button>
        `;

        const checkbox = li.querySelector('input');
        checkbox.addEventListener('change', function() {
            todo.completed = checkbox.checked;
            saveTodos();
            renderTodos();
        });

        const deleteButton = li.querySelector('.delete-task');
        deleteButton.addEventListener('click', function() {
            todos.splice(index, 1);
            saveTodos();
            renderTodos();
        });

        todoList.appendChild(li);
    });

    deleteAll.style.display = currentFilter === 'completed' && filteredTodos.length > 0 ? 'block' : 'none';
    todoForm.style.display = currentFilter !== 'completed' ? 'flex' : 'none';
}

todoForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (text) {
        todos.push({ text: text, completed: false });
        todoInput.value = '';
        saveTodos();
        renderTodos();
    }
});

filterAll.addEventListener('click', function() {
    currentFilter = 'all';
    updateFilterButtons();
    renderTodos();
});

filterActive.addEventListener('click', function() {
    currentFilter = 'active';
    updateFilterButtons();
    renderTodos();
});

filterCompleted.addEventListener('click', function() {
    currentFilter = 'completed';
    updateFilterButtons();
    renderTodos();
});

deleteAll.addEventListener('click', function() {
    todos = todos.filter(function(todo) {
        return !todo.completed;
    });
    saveTodos();
    renderTodos();
});

function updateFilterButtons() {
    [filterAll, filterActive, filterCompleted].forEach(function(btn) {
        btn.classList.remove('active');
    });
    document.getElementById('filter-' + currentFilter).classList.add('active');
}

renderTodos();
