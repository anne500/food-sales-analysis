function loadData() {
    const dateStart = document.getElementById('dateStart').value;
    const dateEnd = document.getElementById('dateEnd').value;
    const city = document.getElementById('city').value;
    const category = document.getElementById('category').value;

    fetch(`http://127.0.0.1:5000/filterData?dateStart=${dateStart}&dateEnd=${dateEnd}&city=${city}&category=${category}`)
    .then(response => response.json())
    .then(data => {
        const table = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
        table.innerHTML = '';
        data.forEach(row => {
            const tr = document.createElement('tr');
            Object.values(row).forEach(text => {
                const td = document.createElement('td');
                td.textContent = text;
                tr.appendChild(td);
            });
            table.appendChild(tr);
        });
    });
}
