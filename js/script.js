function addTodo() {
    const input = document.getElementById('todoInput');
    const date = document.getElementById('dueDate');
    if (input.value.trim() !== '') {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${input.value}</td>
            <td>${date.value || 'N/A'}</td>
            <td><input type="checkbox" onchange="filterTodos()"></td>
            <td><button onclick="this.parentElement.parentElement.remove(); filterTodos()">Delete</button></td>
        `;
        document.getElementById('todoList').appendChild(row);
        input.value = '';
        date.value = '';
        const noTaskRow = document.querySelector('#todoList tr');
        if (noTaskRow && noTaskRow.cells[0].textContent === 'No task found') {
            noTaskRow.remove();
        }
    }
}

function filterTodos() {
    const filter = document.getElementById('filterSelect').value;
    const rows = document.getElementById('todoList').getElementsByTagName('tr');
    for (let row of rows) {
        if (row.cells[2] && row.cells[2].querySelector('input')) {
            const isChecked = row.cells[2].querySelector('input').checked;
            if (filter === 'done' && !isChecked) {
                row.style.display = 'none';
            } else if (filter === 'havent' && isChecked) {
                row.style.display = 'none';
            } else {
                row.style.display = '';
            }
        } else if (row.cells[0].textContent === 'No task found') {
            row.style.display = rows.length === 1 ? '' : 'none';
        }
    }
}

function deleteAll() {
    document.getElementById('todoList').innerHTML = '<tr><td colspan="4">No task found</td></tr>';
    filterTodos();
}