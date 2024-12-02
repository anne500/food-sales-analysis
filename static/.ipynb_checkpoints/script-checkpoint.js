document.addEventListener('DOMContentLoaded', function() {
    fetchCities();
    fetchCategories();

    // Add event listener for the Filter Data button
    const filterButton = document.getElementById('filterButton');
    filterButton.addEventListener('click', loadData);
});

function fetchCities() {
    console.log("Fetching cities...");
    fetch('/cities')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Cities data:", data);
        const select = document.getElementById('city');
        select.innerHTML = '<option value="">Select City</option>';
        data.forEach(city => {
            let option = new Option(city, city);
            select.add(option);
        });
    })
    .catch(error => {
        console.error('Error fetching cities:', error);
        alert('Failed to fetch city data. Please try again later.');
    });
}

function fetchCategories() {
    console.log("Fetching categories...");
    fetch('/categories')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Categories data:", data);
        const select = document.getElementById('category');
        select.innerHTML = '<option value="">Select Category</option>';
        data.forEach(category => {
            let option = new Option(category, category);
            select.add(option);
        });
    })
    .catch(error => {
        console.error('Error fetching categories:', error);
        alert('Failed to fetch category data. Please try again later.');
    });
}

function loadData() {
    const dateStart = document.getElementById('dateStart').value;
    const dateEnd = document.getElementById('dateEnd').value;
    const city = document.getElementById('city').value;
    const category = document.getElementById('category').value;

    // Show loading indicator
    const table = document.getElementById('dataTable');
    table.innerHTML = '<tr><td colspan="9">Loading...</td></tr>';

    fetch(`/filterData?dateStart=${dateStart}&dateEnd=${dateEnd}&city=${city}&category=${category}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        table.innerHTML = '';
        if (data.length === 0) {
            table.innerHTML = '<tr><td colspan="9">No data found for the selected filters.</td></tr>';
            return;
        }
        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.ID}</td>
                <td>${new Date(row.Date).toLocaleDateString()}</td>
                <td>${row.Region}</td>
                <td>${row.City}</td>
                <td>${row.Category}</td>
                <td>${row.Product}</td>
                <td>${row.Qty}</td>
                <td>${row.UnitPrice}</td>
                <td>${row.TotalPrice}</td>
            `;
            table.appendChild(tr);
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        alert('Failed to fetch data. Please try again later.');
    });
}