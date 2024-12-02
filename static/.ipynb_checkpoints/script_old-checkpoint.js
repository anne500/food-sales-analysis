document.addEventListener('DOMContentLoaded', function() {
    fetchCities();
    fetchCategories();
});

function fetchCities() {
    console.log("Fetching cities...");
    fetch('/cities')
    //.then(response => response.json())
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Cities data:", data);  // Check the data received
        const select = document.getElementById('city');
        select.innerHTML = '<option value="">Select City</option>'; // Reset dropdown
        const addedOptions = new Set(); // Track added options to avoid duplicates
        data.forEach(city => {
            if (!addedOptions.has(city)) {
                addedOptions.add(city);
                let option = new Option(city, city);
                select.add(option);
            }
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
    //.then(response => response.json())
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Categories data:", data);  // Check the data received
        const select = document.getElementById('category');
        select.innerHTML = '<option value="">Select Category</option>'; // Ensure dropdown is reset
        const addedOptions = new Set(); // Track added options to avoid duplicates
        data.forEach(category => {
            if (!addedOptions.has(category)) {
                addedOptions.add(category);
                let option = new Option(category, category);
                select.add(option);
            }
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

    fetch(`http://127.0.0.1:5000/filterData?dateStart=${dateStart}&dateEnd=${dateEnd}&city=${city}&category=${category}`)
    //.then(response => response.json())
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const table = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
        table.innerHTML = '';
        data.forEach(row => {
            const tr = document.createElement('tr');
            //Object.values(row).forEach(text => {
            //    const td = document.createElement('td');
            //    td.textContent = text;
            //    tr.appendChild(td);
            //});
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
