const saleForm = document.getElementById("saleForm");
const price = document.getElementById("price");
const quantity = document.getElementById("quantity");
const salesTableBody = document.getElementById("salesTableBody");
const totalRevenue = document.getElementById("totalRevenue");
const productSelect = document.getElementById("productSelect");
const colorSelect = document.getElementById("colorSelect");
const sourceSelect = document.getElementById("sourceSelect");
const defaultOptions = {
    products: [
        "Butterfly Knife",
        "Minecraft Model",
        "Minecraft Tool",
        "Axolotl",
        "Pokeball",
        "Dragon",
        "Huntr/x Keychain",
        "SajaBoys Keychain",
        "Large Snake",
        "Small Snake",
        "Purge Cube",
        "L Skull",
        "M Skull",
        "S Skull"
    ],
    colors: [
        "Red",
        "Pink",
        "Yellow",
        "Purple",
        "Black",
        "Dark Green",
        "Light Green",
        "Transparent Green",
        "White",
        "Blue",
        "Cyan",
        "Orange",
        "Light Pink",
        "N/A"
    ],
    sources: [
        "FB Marketplace",
        "Ebay Store",
        "In Person",
        "N/A"
    ]
};

let formOptions = JSON.parse(localStorage.getItem("formOptions")) || defaultOptions;

let sales = loadSales();

function showPage(pageId) {
    const pages = document.querySelectorAll(".page");

    pages.forEach(function(page) {
        page.classList.remove("active-page");
    });

    document.getElementById(pageId).classList.add("active-page");

    if (pageId === "revenuePage") {
        updateRevenueDashboard();
    }
}

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

function updateRevenueDashboard() {
    const dashboardRevenue = document.getElementById("dashboardRevenue");
    const popularItem = document.getElementById("popularItem");
    const revenueTableBody = document.getElementById("revenueTableBody");

    let total = 0;
    let itemCounts = {};

    revenueTableBody.innerHTML = "";

    sales.forEach(function(sale) {
        const saleTotal = sale.price * sale.quantity;
        total += saleTotal;

        if (itemCounts[sale.item]) {
            itemCounts[sale.item] += sale.quantity;
        } else {
            itemCounts[sale.item] = sale.quantity;
        }

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${sale.date}</td>
            <td>${sale.item}</td>
            <td>$${sale.price.toFixed(2)}</td>
            <td>${sale.quantity}</td>
            <td>$${saleTotal.toFixed(2)}</td>
        `;

        revenueTableBody.appendChild(row);
    });

    dashboardRevenue.textContent = "$" + total.toFixed(2);

    let topItem = "No sales yet";
    let highestCount = 0;

    for (let item in itemCounts) {
        if (itemCounts[item] > highestCount) {
            highestCount = itemCounts[item];
            topItem = item;
        }
    }

    popularItem.textContent = topItem;
}

function saveFormOptions() {
    localStorage.setItem("formOptions", JSON.stringify(formOptions));
}

function populateDropdowns() {
    fillDropdown(productSelect, formOptions.products, "Choose a Product");
    fillDropdown(colorSelect, formOptions.colors, "Choose a Color");
    fillDropdown(sourceSelect, formOptions.sources, "Choose Source");
}

function fillDropdown(dropdown, options, placeholder) {
    dropdown.innerHTML = "";

    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.textContent = placeholder;
    dropdown.appendChild(placeholderOption);

    options.forEach(function(option) {
        const optionElement = document.createElement("option");
        optionElement.value = option;
        optionElement.textContent = option;
        dropdown.appendChild(optionElement);
    });
}

function displayOptionLists() {
    displaySingleOptionList("products", "productOptionsList");
    displaySingleOptionList("colors", "colorOptionsList");
    displaySingleOptionList("sources", "sourceOptionsList");
}

function displaySingleOptionList(optionType, listId) {
    const list = document.getElementById(listId);
    list.innerHTML = "";

    formOptions[optionType].forEach(function(option, index) {
        const listItem = document.createElement("li");

        listItem.innerHTML = `
            <span>${option}</span>
            <button class="small-delete-btn" type="button" onclick="removeOption('${optionType}', ${index})">
                Remove
            </button>
        `;

        list.appendChild(listItem);
    });
}

function addOption(optionType) {
    let input;

    if (optionType === "products") {
        input = document.getElementById("newProductOption");
    } else if (optionType === "colors") {
        input = document.getElementById("newColorOption");
    } else if (optionType === "sources") {
        input = document.getElementById("newSourceOption");
    }

    const newOption = input.value.trim();

    if (newOption === "") {
        alert("Please enter an option first.");
        return;
    }

    if (formOptions[optionType].includes(newOption)) {
        alert("That option already exists.");
        return;
    }

    formOptions[optionType].push(newOption);

    input.value = "";

    saveFormOptions();
    populateDropdowns();
    displayOptionLists();
}

function removeOption(optionType, index) {
    formOptions[optionType].splice(index, 1);

    saveFormOptions();
    populateDropdowns();
    displayOptionLists();
}

function displaySales() {
    salesTableBody.innerHTML = "";

    sales.forEach(function (sale, index) {
        const row = document.createElement("tr");
        const saleTotal = sale.price * sale.quantity;

        row.innerHTML = `
            <td>${sale.date}</td>
            <td>${sale.item}</td>
            <td>${sale.color}</td>
            <td>${sale.source}</td>
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

    date: new Date().toLocaleString(),

    item: productSelect.value,

    color: colorSelect.value,

    source: sourceSelect.value,

    price: Number(price.value),

    quantity: Number(quantity.value)
};

    sales.push(newSale);

    saveSales();
    displaySales();

    saleForm.reset();
});

populateDropdowns();
displayOptionLists();
displaySales();