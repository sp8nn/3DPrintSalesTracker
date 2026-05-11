const saleForm = document.getElementById("saleForm");
const saleDate = document.getElementById("saleDate");
const itemName = document.getElementById("itemName");
const price = document.getElementById("price");
const quantity = document.getElementById("quantity");

const salesTableBody = document.getElementById("salesTableBody");
const totalRevenue = document.getElementById("totalRevenue");

let sales = loadSales();

function loadSales() {
    const savedSales = localStorage.getItem("sales");

    if (savedSales === null) {
        return [];
    }

    return JSON.parse(savedSales);
}

function saveSales() {
    localStorage.setItem("sales", JSON.stringify(sales));
}

function updateRevenue() {
    let total = 0;

    sales.forEach(function (sale) {
        total += sale.price * sale.quantity;
    });

    totalRevenue.textContent = "$" + total.toFixed(2);
}

function displaySales() {
    salesTableBody.innerHTML = "";

    sales.forEach(function (sale, index) {
        const row = document.createElement("tr");
        const saleTotal = sale.price * sale.quantity;

        row.innerHTML = `
            <td>${sale.date}</td>
            <td>${sale.item}</td>
            <td>$${sale.price.toFixed(2)}</td>
            <td>${sale.quantity}</td>
            <td>$${saleTotal.toFixed(2)}</td>
            <td>
                <button class="delete-btn" onclick="deleteSale(${index})">
                    Delete
                </button>
            </td>
        `;

        salesTableBody.appendChild(row);
    });

    updateRevenue();
}

function deleteSale(index) {
    sales.splice(index, 1);
    saveSales();
    displaySales();
}

saleForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const newSale = {
        date: saleDate.value,
        item: itemName.value,
        price: parseFloat(price.value),
        quantity: parseInt(quantity.value)
    };

    sales.push(newSale);

    saveSales();
    displaySales();

    saleForm.reset();
});

displaySales();