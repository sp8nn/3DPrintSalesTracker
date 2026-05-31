const saleForm = document.getElementById("saleForm");
const salesTableBody = document.getElementById("salesTableBody");

let sales = JSON.parse(localStorage.getItem("sales")) || [];

const defaultFormQuestions = [
    {
        id: "product",
        question: "Select 3D Print(s)",
        type: "multiImageChoice",
        options: [
            { name: "Butterfly Knife", image: "" },
            { name: "Minecraft Model", image: "" },
            { name: "Minecraft Tool", image: "" },
            { name: "Axolotl", image: "" },
            { name: "Pokeball", image: "" },
            { name: "Dragon", image: "" },
            { name: "Huntr/x Keychain", image: "" },
            { name: "SajaBoys Keychain", image: "" },
            { name: "Large Snake", image: "" },
            { name: "Small Snake", image: "" },
            { name: "Purge Cube", image: "" },
            { name: "L Skull", image: "" },
            { name: "M Skull", image: "" },
            { name: "S Skull", image: "" }
        ]
    },
    {
        id: "color",
        question: "What Color was it?",
        type: "dropdown",
        options: [
            "Red", "Pink", "Yellow", "Purple", "Black",
            "Dark Green", "Light Green", "Transparent Green",
            "White", "Blue", "Cyan", "Orange", "Light Pink", "N/A"
        ]
    },
    {
        id: "price",
        question: "Enter Total Purchase Amount",
        type: "moneyKeypad",
        options: []
    },
    {
        id: "source",
        question: "Where did we sell it?",
        type: "dropdown",
        options: ["FB Marketplace", "Etsy Store", "In Person", "N/A"]
    }
];

let formQuestions = JSON.parse(localStorage.getItem("formQuestions")) || defaultFormQuestions;

function saveSales() {
    localStorage.setItem("sales", JSON.stringify(sales));
}

function saveFormQuestions() {
    localStorage.setItem("formQuestions", JSON.stringify(formQuestions));
}

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

function buildSalesForm() {
    const dynamicSalesForm = document.getElementById("dynamicSalesForm");
    dynamicSalesForm.innerHTML = "";

    formQuestions.forEach(function(question) {
        const questionBox = document.createElement("div");
        questionBox.classList.add("form-step");

        const label = document.createElement("label");
        label.textContent = question.question;
        questionBox.appendChild(label);

        if (question.type === "multiImageChoice") {
    const grid = document.createElement("div");
    grid.classList.add("choice-grid");

    question.options.forEach(function(option) {
        const card = document.createElement("div");
        card.classList.add("choice-card");
        card.dataset.value = option.name;
        card.dataset.quantity = "0";

        card.innerHTML = `
            <div class="choice-image">
                ${
                    option.image
                        ? `<img src="${option.image}" alt="${option.name}">`
                        : `<span>No Image</span>`
                }
            </div>

            <p>${option.name}</p>

            <div class="quantity-control">
                <button type="button" class="qty-btn minus-btn">-</button>
                <span class="qty-display">1</span>
                <button type="button" class="qty-btn plus-btn">+</button>
            </div>
        `;

        const minusBtn = card.querySelector(".minus-btn");
        const plusBtn = card.querySelector(".plus-btn");
        const qtyDisplay = card.querySelector(".qty-display");

        card.addEventListener("click", function() {
            let quantity = Number(card.dataset.quantity);

            if (quantity === 0) {
                quantity = 1;
                card.dataset.quantity = quantity;
                qtyDisplay.textContent = quantity;
                card.classList.add("selected");
                updateColorQuestions();
            }
        });

        plusBtn.addEventListener("click", function(event) {
            event.stopPropagation();

            let quantity = Number(card.dataset.quantity);
            quantity++;

            card.dataset.quantity = quantity;
            qtyDisplay.textContent = quantity;
            card.classList.add("selected");
            updateColorQuestions();
        });

        minusBtn.addEventListener("click", function(event) {
            event.stopPropagation();

            let quantity = Number(card.dataset.quantity);

            if (quantity > 1) {
                quantity--;
                card.dataset.quantity = quantity;
                qtyDisplay.textContent = quantity;
            } else {
                quantity = 0;
                card.dataset.quantity = quantity;
                qtyDisplay.textContent = "1";
                card.classList.remove("selected");
                updateColorQuestions();
            }
        });

        grid.appendChild(card);
    });

    questionBox.appendChild(grid);
}
if (question.id === "color") {
    const colorSection = document.createElement("div");
    colorSection.id = "colorSection";
    colorSection.classList.add("color-section");
    colorSection.innerHTML = "<p class='helper-text'>Select a print first to choose colors.</p>";

    questionBox.appendChild(colorSection);
    dynamicSalesForm.appendChild(questionBox);
    return;
}
        if (question.type === "dropdown") {
            const select = document.createElement("select");
            select.id = question.id;
            select.classList.add("big-select");
            select.required = true;

            const placeholder = document.createElement("option");
            placeholder.value = "";
            placeholder.textContent = "Choose an option";
            select.appendChild(placeholder);

            question.options.forEach(function(option) {
                const optionElement = document.createElement("option");
                optionElement.value = option;
                optionElement.textContent = option;
                select.appendChild(optionElement);
            });

            questionBox.appendChild(select);
        }
            if (question.type === "moneyKeypad") {
                const moneyBox = document.createElement("div");
                moneyBox.classList.add("money-box");

                moneyBox.innerHTML = `
                    <div class="money-display" id="moneyDisplay">$0.00</div>

                    <input type="hidden" id="price" value="0">

                    <div class="keypad">
                <button type="button" onclick="pressMoneyKey('1')">1</button>
                <button type="button" onclick="pressMoneyKey('2')">2</button>
                <button type="button" onclick="pressMoneyKey('3')">3</button>

                <button type="button" onclick="pressMoneyKey('4')">4</button>
                <button type="button" onclick="pressMoneyKey('5')">5</button>
                <button type="button" onclick="pressMoneyKey('6')">6</button>

                <button type="button" onclick="pressMoneyKey('7')">7</button>
                <button type="button" onclick="pressMoneyKey('8')">8</button>
                <button type="button" onclick="pressMoneyKey('9')">9</button>

                <button type="button" onclick="clearMoney()">Clear</button>
                <button type="button" onclick="pressMoneyKey('0')">0</button>
                <button type="button" onclick="backspaceMoney()">⌫</button>
            </div>
     `;

    questionBox.appendChild(moneyBox);
}

        if (question.type === "number") {
            const input = document.createElement("input");
            input.type = "number";
            input.id = question.id;
            input.required = true;

            if (question.id === "quantity") input.min = "1";
            if (question.id === "price") {
                input.min = "0";
                input.step = "0.01";
            }

            questionBox.appendChild(input);
        }

        dynamicSalesForm.appendChild(questionBox);
    });
}

function buildSettingsForm() {
    const settingsContainer = document.getElementById("questionSettingsContainer");
    settingsContainer.innerHTML = "";

    formQuestions.forEach(function(question, questionIndex) {
        const settingsCard = document.createElement("div");
        settingsCard.classList.add("settings-card");

        settingsCard.innerHTML = `
            <h3>Question ${questionIndex + 1}</h3>

            <label>Question Text</label>
            <input
                type="text"
                value="${question.question}"
                oninput="updateQuestionText(${questionIndex}, this.value)"
            >

            <p><strong>Type:</strong> ${question.type}</p>
        `;

        if (question.type === "dropdown") {
            question.options.forEach(function(option, optionIndex) {
                const optionRow = document.createElement("div");
                optionRow.classList.add("settings-option-row");

                optionRow.innerHTML = `
                    <input
                        type="text"
                        value="${option}"
                        oninput="updateOptionText(${questionIndex}, ${optionIndex}, this.value)"
                    >

                    <button
                        type="button"
                        class="small-delete-btn"
                        onclick="removeQuestionOption(${questionIndex}, ${optionIndex})"
                    >
                        Remove
                    </button>
                `;

                settingsCard.appendChild(optionRow);
            });

            const addRow = document.createElement("div");
            addRow.classList.add("settings-option-row");

            addRow.innerHTML = `
                <input
                    type="text"
                    id="newOption-${questionIndex}"
                    placeholder="New option"
                >

                <button
                    type="button"
                    onclick="addQuestionOption(${questionIndex})"
                >
                    Add Option
                </button>
            `;

            settingsCard.appendChild(addRow);
        }

        if (question.type === "multiImageChoice") {
            question.options.forEach(function(option, optionIndex) {
                const optionRow = document.createElement("div");
                optionRow.classList.add("settings-option-row");

                optionRow.innerHTML = `
                    <input
                        type="text"
                        value="${option.name}"
                        placeholder="Option name"
                        oninput="updateImageOptionName(${questionIndex}, ${optionIndex}, this.value)"
                    >

                    <input
                        type="text"
                        value="${option.image}"
                        placeholder="Image URL"
                        oninput="updateImageOptionURL(${questionIndex}, ${optionIndex}, this.value)"
                    >

                    <button
                        type="button"
                        class="small-delete-btn"
                        onclick="removeQuestionOption(${questionIndex}, ${optionIndex})"
                    >
                        Remove
                    </button>
                `;

                settingsCard.appendChild(optionRow);
            });

            const addRow = document.createElement("div");
            addRow.classList.add("settings-option-row");

            addRow.innerHTML = `
                <input
                    type="text"
                    id="newImageOptionName-${questionIndex}"
                    placeholder="New product name"
                >

                <input
                    type="text"
                    id="newImageOptionURL-${questionIndex}"
                    placeholder="Image URL optional"
                >

                <button
                    type="button"
                    onclick="addImageQuestionOption(${questionIndex})"
                >
                    Add Product
                </button>
            `;

            settingsCard.appendChild(addRow);
        }

        settingsContainer.appendChild(settingsCard);
    });
}

function updateQuestionText(questionIndex, newText) {
    formQuestions[questionIndex].question = newText;
    saveFormQuestions();
    buildSalesForm();
}

function updateOptionText(questionIndex, optionIndex, newText) {
    formQuestions[questionIndex].options[optionIndex] = newText;
    saveFormQuestions();
    buildSalesForm();
}

function updateImageOptionName(questionIndex, optionIndex, newName) {
    formQuestions[questionIndex].options[optionIndex].name = newName;
    saveFormQuestions();
    buildSalesForm();
}

function updateImageOptionURL(questionIndex, optionIndex, newURL) {
    formQuestions[questionIndex].options[optionIndex].image = newURL;
    saveFormQuestions();
    buildSalesForm();
}

function addQuestionOption(questionIndex) {
    const input = document.getElementById(`newOption-${questionIndex}`);
    const newOption = input.value.trim();

    if (newOption === "") return;

    formQuestions[questionIndex].options.push(newOption);
    input.value = "";

    saveFormQuestions();
    buildSalesForm();
    buildSettingsForm();
}

function addImageQuestionOption(questionIndex) {
    const nameInput = document.getElementById(`newImageOptionName-${questionIndex}`);
    const urlInput = document.getElementById(`newImageOptionURL-${questionIndex}`);

    const name = nameInput.value.trim();
    const image = urlInput.value.trim();

    if (name === "") return;

    formQuestions[questionIndex].options.push({
        name: name,
        image: image
    });

    nameInput.value = "";
    urlInput.value = "";

    saveFormQuestions();
    buildSalesForm();
    buildSettingsForm();
}

function removeQuestionOption(questionIndex, optionIndex) {
    formQuestions[questionIndex].options.splice(optionIndex, 1);

    saveFormQuestions();
    buildSalesForm();
    buildSettingsForm();
}

function getSelectedProducts() {
    const productCards = document.querySelectorAll(".choice-card");
    let selectedProducts = [];
    let totalQuantity = 0;

    productCards.forEach(function(card) {
        const quantity = Number(card.dataset.quantity);

        if (quantity > 0) {
            selectedProducts.push(`${card.dataset.value} x${quantity}`);
            totalQuantity += quantity;
        }
    });

    return {
        items: selectedProducts.join(", "),
        totalQuantity: totalQuantity
    };
}

function displaySales() {
    salesTableBody.innerHTML = "";

    sales.forEach(function(sale, index) {
        const saleTotal = sale.price;
        const row = document.createElement("tr");

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
}

function deleteSale(index) {
    sales.splice(index, 1);
    saveSales();
    displaySales();
}

function updateRevenueDashboard() {
    const dashboardRevenue = document.getElementById("dashboardRevenue");
    const popularItem = document.getElementById("popularItem");
    const revenueTableBody = document.getElementById("revenueTableBody");

    let total = 0;
    let itemCounts = {};

    revenueTableBody.innerHTML = "";

    sales.forEach(function(sale) {
        const saleTotal = sale.price;
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
            <td>${sale.color}</td>
            <td>${sale.source}</td>
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
function updateColorQuestions() {
    const colorSection = document.getElementById("colorSection");

    if (!colorSection) return;

    colorSection.innerHTML = "";

    const selectedCards = document.querySelectorAll(".choice-card.selected");

    if (selectedCards.length === 0) {
        colorSection.innerHTML = "<p class='helper-text'>Select a print first to choose colors.</p>";
        return;
    }

    selectedCards.forEach(function(card) {
        const productName = card.dataset.value;
        const productQuantity = Number(card.dataset.quantity);

        for (let i = 1; i <= productQuantity; i++) {
            const colorBox = document.createElement("div");
            colorBox.classList.add("color-branch-box");

            const label = document.createElement("label");
            label.textContent = `Color for ${productName} #${i}`;

            const select = document.createElement("select");
            select.classList.add("big-select");
            select.dataset.product = `${productName} #${i}`;
            select.required = true;

            const placeholder = document.createElement("option");
            placeholder.value = "";
            placeholder.textContent = "Choose a color";
            select.appendChild(placeholder);

            const colorQuestion = formQuestions.find(q => q.id === "color");

            colorQuestion.options.forEach(function(color) {
                const option = document.createElement("option");
                option.value = color;
                option.textContent = color;
                select.appendChild(option);
            });

            colorBox.appendChild(label);
            colorBox.appendChild(select);
            colorSection.appendChild(colorBox);
        }
    });
}
function getSelectedColors() {
    const colorDropdowns = document.querySelectorAll("#colorSection select");
    let colors = [];

    colorDropdowns.forEach(function(dropdown) {
        colors.push(`${dropdown.dataset.product}: ${dropdown.value}`);
    });

    return colors.join(", ");
}
let moneyValue = "";

function updateMoneyDisplay() {
    const moneyDisplay = document.getElementById("moneyDisplay");
    const priceInput = document.getElementById("price");

    const amount = Number(moneyValue || 0);

    moneyDisplay.textContent = "$" + amount.toFixed(2);
    priceInput.value = amount.toFixed(2);
}

function pressMoneyKey(digit) {
    moneyValue += digit;
    updateMoneyDisplay();
}

function clearMoney() {
    moneyValue = "";
    updateMoneyDisplay();
}

function backspaceMoney() {
    moneyValue = moneyValue.slice(0, -1);
    updateMoneyDisplay();
}

function pressMoneyKey(digit) {
    moneyValue += digit;
    updateMoneyDisplay();
}

function clearMoney() {
    moneyValue = "";
    updateMoneyDisplay();
}

function backspaceMoney() {
    moneyValue = moneyValue.slice(0, -1);
    updateMoneyDisplay();
}
saleForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const selectedProducts = getSelectedProducts();

    if (selectedProducts.items === "") {
        alert("Please select at least one 3D print.");
        return;
    }

    const selectedColors = getSelectedColors();

    const colorDropdowns = document.querySelectorAll("#colorSection select");

    for (let dropdown of colorDropdowns) {
        if (dropdown.value === "") {
            alert("Please choose a color for each selected print.");
            return;
        }
    }
    const totalPurchaseAmount = Number(document.getElementById("price").value);

    if (totalPurchaseAmount <= 0) {
        alert("Please enter the total purchase amount.");
        return;
    }

    const newSale = {
        date: new Date().toLocaleString(),
        item: selectedProducts.items,
        color: selectedColors,
        source: document.getElementById("source").value,
        price: totalPurchaseAmount,
        quantity: selectedProducts.totalQuantity
    };

    sales.push(newSale);

    saveSales();
    displaySales();

    saleForm.reset();
    moneyDigits = "";
    buildSalesForm();
});

buildSalesForm();
buildSettingsForm();
displaySales();