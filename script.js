const SUPABASE_URL = "https://tyjfiwkzjcmtgdjqjopf.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_G6Di7nwj7URul5MTnYl9Gw_O5mRayl4";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const saleForm = document.getElementById("saleForm");
const salesTableBody = document.getElementById("salesTableBody");
const salesPerPage = 10;
const revenueSalesPerPage = 10;

let sales = [];
let currentSalesPage = 1;
let currentRevenuePage = 1;
let productBarChart = null;
let colorBarChart = null;
let sourcePieChart = null;
document.querySelectorAll(".flip-card").forEach(card => {

    card.addEventListener("click", function() {

        this.querySelector(".flip-card-inner")
            .classList.toggle("flipped");

    });

    });
const defaultFormQuestions = [
    {
    id: "product",
    question: "Select 3D Print(s)",
    type: "categoryChoice",
    categories: [
        {
            name: "Keychains",
            image: "",
            products: [
                {
                    name: "Huntr/x Keychain",
                    image: ""
                },
                {
                    name: "SajaBoys Keychain",
                    image: ""
                }
            ]
        },

        {
            name: "Figures",
            image: "",
            products: [
                {
                    name: "Axolotl",
                    image: ""
                },
                {
                    name: "Dragon",
                    image: ""
                },
                {
                    name: "Pokeball",
                    image: ""
                }
            ]
        },

        {
            name: "Knives",
            image: "",
            products: [
                {
                    name: "Butterfly Knife",
                    image: ""
                }
            ]
        },

        {
            name: "Minecraft",
            image: "",
            products: [
                {
                    name: "Minecraft Model",
                    image: ""
                },
                {
                    name: "Minecraft Tool",
                    image: ""
                }
            ]
        },

        {
            name: "Snakes",
            image: "",
            products: [
                {
                    name: "Large Snake",
                    image: ""
                },
                {
                    name: "Small Snake",
                    image: ""
                }
            ]
        },

        {
            name: "Skulls",
            image: "",
            products: [
                {
                    name: "L Skull",
                    image: ""
                },
                {
                    name: "M Skull",
                    image: ""
                },
                {
                    name: "S Skull",
                    image: ""
                }
            ]
        },

        {
            name: "Other",
            image: "",
            products: [
                {
                    name: "Purge Cube",
                    image: ""
                }
            ]
        }
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
        id: "amount",
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

async function loadSalesFromCloud() {
    const { data, error } = await supabaseClient
        .from("sales")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error loading sales:", error);
        alert("Could not load sales from Supabase.");
        return;
    }

    sales = data.map(function(row) {
        return {
            id: row.id,
            date: row.sale_date,
            item: row.item,
            color: row.color,
            source: row.source,
            price: Number(row.price),
            quantity: row.quantity
        };
    });

    displaySales();
    
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

    if (!dynamicSalesForm) return;

    dynamicSalesForm.innerHTML = "";

    formQuestions.forEach(function(question) {

        const questionBox = document.createElement("div");
        questionBox.classList.add("form-step");

        const label = document.createElement("label");
        label.textContent = question.question;
        questionBox.appendChild(label);

        /*
        ============================================================
        CATEGORY PRODUCT SELECTION
        ============================================================
        */

        if (question.type === "categoryChoice") {

            const categoryContainer = document.createElement("div");
            categoryContainer.classList.add("category-choice-container");

            const categoryGrid = document.createElement("div");
            categoryGrid.classList.add("category-grid");

            const productArea = document.createElement("div");
            productArea.classList.add("category-product-area");

            question.categories.forEach(function(category, categoryIndex) {

                /*
                -------------------------------
                CATEGORY BUTTON
                -------------------------------
                */

                const categoryButton = document.createElement("button");

                categoryButton.type = "button";
                categoryButton.classList.add("category-card");
                categoryButton.textContent = category.name;

                if (category.image) {
                    categoryButton.innerHTML = `
                        <div class="category-image">
                            <img src="${category.image}" alt="${category.name}">
                        </div>

                        <div class="category-name">
                            ${category.name}
                        </div>
                    `;
                }

                categoryGrid.appendChild(categoryButton);

                /*
                -------------------------------
                CATEGORY PRODUCT PANEL
                -------------------------------
                */

                const categoryPanel = document.createElement("div");

                categoryPanel.classList.add("category-product-panel");

                if (categoryIndex !== 0) {
                    categoryPanel.style.display = "none";
                }

                categoryPanel.dataset.category = category.name;

                const panelHeader = document.createElement("div");
                panelHeader.classList.add("category-panel-header");

                const backButton = document.createElement("button");

                backButton.type = "button";
                backButton.classList.add("category-back-btn");
                backButton.textContent = "← Back to Categories";

                const categoryTitle = document.createElement("h3");
                categoryTitle.textContent = category.name;

                panelHeader.appendChild(backButton);
                panelHeader.appendChild(categoryTitle);

                categoryPanel.appendChild(panelHeader);

                const productGrid = document.createElement("div");
                productGrid.classList.add("choice-grid");

                category.products.forEach(function(product) {

                    const card = document.createElement("div");

                    card.classList.add("choice-card");

                    card.dataset.value = product.name;

                    /*
                    Keep quantity in the card so the existing
                    color system can use it.
                    */
                    card.dataset.quantity = "0";

                    card.innerHTML = `
                        <div class="choice-image">
                            ${
                                product.image
                                    ? `<img src="${product.image}" alt="${product.name}">`
                                    : `<span>No Image</span>`
                            }
                        </div>

                        <p>${product.name}</p>

                        <div class="quantity-control">

                            <button
                                type="button"
                                class="qty-btn minus-btn"
                            >
                                -
                            </button>

                            <span class="qty-display">1</span>

                            <button
                                type="button"
                                class="qty-btn plus-btn"
                            >
                                +
                            </button>

                        </div>
                    `;

                    const minusBtn =
                        card.querySelector(".minus-btn");

                    const plusBtn =
                        card.querySelector(".plus-btn");

                    const qtyDisplay =
                        card.querySelector(".qty-display");

                    /*
                    -------------------------------
                    SELECT PRODUCT
                    -------------------------------
                    */

                    card.addEventListener("click", function() {

                        let quantity =
                            Number(card.dataset.quantity);

                        if (quantity === 0) {

                            quantity = 1;

                            card.dataset.quantity = quantity;

                            qtyDisplay.textContent = quantity;

                            card.classList.add("selected");

                            updateColorQuestions();
                        }
                    });

                    /*
                    -------------------------------
                    PLUS
                    -------------------------------
                    */

                    plusBtn.addEventListener(
                        "click",
                        function(event) {

                            event.stopPropagation();

                            let quantity =
                                Number(card.dataset.quantity);

                            quantity++;

                            card.dataset.quantity = quantity;

                            qtyDisplay.textContent = quantity;

                            card.classList.add("selected");

                            updateColorQuestions();
                        }
                    );

                    /*
                    -------------------------------
                    MINUS
                    -------------------------------
                    */

                    minusBtn.addEventListener(
                        "click",
                        function(event) {

                            event.stopPropagation();

                            let quantity =
                                Number(card.dataset.quantity);

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

        /*
        ============================================================
        DROPDOWN
        ============================================================
        */

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

                const optionElement =
                    document.createElement("option");

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

                    <button
                        type="button"
                        onclick="pressMoneyKey('4')"
                    >
                        4
                    </button>

                    <button
                        type="button"
                        onclick="pressMoneyKey('5')"
                    >
                        5
                    </button>

                    <button
                        type="button"
                        onclick="pressMoneyKey('6')"
                    >
                        6
                    </button>

                    <button
                        type="button"
                        onclick="pressMoneyKey('7')"
                    >
                        7
                    </button>

                    <button
                        type="button"
                        onclick="pressMoneyKey('8')"
                    >
                        8
                    </button>

                    <button
                        type="button"
                        onclick="pressMoneyKey('9')"
                    >
                        9
                    </button>

                    <button
                        type="button"
                        onclick="clearMoney()"
                    >
                        Clear
                    </button>

                    <button
                        type="button"
                        onclick="pressMoneyKey('0')"
                    >
                        0
                    </button>

                    <button
                        type="button"
                        onclick="backspaceMoney()"
                    >
                        ⌫
                    </button>

                </div>
            `;

            questionBox.appendChild(moneyBox);
        }

        /*
        ============================================================
        NUMBER
        ============================================================
        */

        if (question.type === "number") {

            const input = document.createElement("input");

            input.type = "number";

            input.id = question.id;

            input.required = true;

            if (question.id === "quantity") {
                input.min = "1";
            }

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

    if (!settingsContainer) return;

    settingsContainer.innerHTML = "";

    formQuestions.forEach(function(question, questionIndex) {

        const settingsCard = document.createElement("div");

        settingsCard.classList.add("settings-card");

        settingsCard.innerHTML = `
            <div class="settings-card-header">

                <h3>Question ${questionIndex + 1}</h3>

                <div class="settings-card-actions">

                    <button
                        type="button"
                        onclick="moveQuestionUp(${questionIndex})"
                    >
                        ↑
                    </button>

                    <button
                        type="button"
                        onclick="moveQuestionDown(${questionIndex})"
                    >
                        ↓
                    </button>

                    <button
                        type="button"
                        class="small-delete-btn"
                        onclick="deleteQuestion(${questionIndex})"
                    >
                        Delete
                    </button>

                </div>

            </div>

            <label>Question Text</label>

            <input
                type="text"
                value="${question.question}"
                oninput="updateQuestionText(${questionIndex}, this.value)"
            >

            <label>Question Type</label>

            <select
                class="big-select"
                onchange="updateQuestionType(${questionIndex}, this.value)"
            >

                <option
                    value="dropdown"
                    ${question.type === "dropdown" ? "selected" : ""}
                >
                    Dropdown
                </option>

                <option
                    value="categoryChoice"
                    ${question.type === "categoryChoice" ? "selected" : ""}
                >
                    Category & Product Selection
                </option>

                <option
                    value="multiImageChoice"
                    ${question.type === "multiImageChoice" ? "selected" : ""}
                >
                    Multi Image Choice
                </option>

                <option
                    value="moneyKeypad"
                    ${question.type === "moneyKeypad" ? "selected" : ""}
                >
                    Money Keypad
                </option>

                <option
                    value="number"
                    ${question.type === "number" ? "selected" : ""}
                >
                    Number
                </option>

            </select>

            <div
                class="settings-option-area"
                id="settings-options-${questionIndex}"
            ></div>
        `;

        settingsContainer.appendChild(settingsCard);

        buildQuestionOptionsEditor(
            question,
            questionIndex
        );
    });
}
function buildQuestionOptionsEditor(question, questionIndex) {

    const optionArea = document.getElementById(
        `settings-options-${questionIndex}`
    );

    if (!optionArea) return;

    optionArea.innerHTML = "";

    /*
    ============================================================
    CATEGORY & PRODUCT EDITOR
    ============================================================
    */

    if (question.type === "categoryChoice") {

        const title = document.createElement("h4");

        title.textContent = "Product Categories";

        optionArea.appendChild(title);

        const helper = document.createElement("p");

        helper.classList.add("helper-text");

        helper.textContent =
            "Create categories such as Keychains, Figures, Fidgets, or Minecraft. Each category can contain multiple products.";

        optionArea.appendChild(helper);

        const categoriesContainer =
            document.createElement("div");

        categoriesContainer.classList.add(
            "category-settings-container"
        );

        question.categories.forEach(function(
            category,
            categoryIndex
        ) {

            const categoryCard =
                document.createElement("div");

            categoryCard.classList.add(
                "category-settings-card"
            );

            categoryCard.innerHTML = `

                <div class="category-settings-header">

                    <h3>
                        ${category.name}
                    </h3>

                    <div>

                        <button
                            type="button"
                            onclick="moveCategoryUp(
                                ${questionIndex},
                                ${categoryIndex}
                            )"
                        >
                            ↑
                        </button>

                        <button
                            type="button"
                            onclick="moveCategoryDown(
                                ${questionIndex},
                                ${categoryIndex}
                            )"
                        >
                            ↓
                        </button>

                    </div>

                </div>

                <label>Category Name</label>

                <input
                    type="text"
                    value="${category.name}"
                    oninput="updateCategoryName(
                        ${questionIndex},
                        ${categoryIndex},
                        this.value
                    )"
                >

                <label>Category Image URL</label>

                <input
                    type="text"
                    value="${category.image || ""}"
                    placeholder="Optional image URL"
                    oninput="updateCategoryImage(
                        ${questionIndex},
                        ${categoryIndex},
                        this.value
                    )"
                >

                <h4>Products</h4>

                <div
                    class="category-products-editor"
                    id="category-products-${questionIndex}-${categoryIndex}"
                ></div>

                <button
                    type="button"
                    class="add-question-btn"
                    onclick="addCategoryProduct(
                        ${questionIndex},
                        ${categoryIndex}
                    )"
                >
                    + Add Product
                </button>

                <button
                    type="button"
                    class="small-delete-btn"
                    onclick="deleteCategory(
                        ${questionIndex},
                        ${categoryIndex}
                    )"
                >
                    Delete Category
                </button>
            `;

            categoriesContainer.appendChild(
                categoryCard
            );

            const productContainer =
                categoryCard.querySelector(
                    `#category-products-${questionIndex}-${categoryIndex}`
                );

            category.products.forEach(function(
                product,
                productIndex
            ) {

                const productRow =
                    document.createElement("div");

                productRow.classList.add(
                    "category-product-row"
                );

                productRow.innerHTML = `

                    <div class="product-editor-fields">

                        <label>Product Name</label>

                        <input
                            type="text"
                            value="${product.name}"
                            oninput="updateCategoryProductName(
                                ${questionIndex},
                                ${categoryIndex},
                                ${productIndex},
                                this.value
                            )"
                        >

                        <label>Product Image URL</label>

                        <input
                            type="text"
                            value="${product.image || ""}"
                            placeholder="Optional image URL"
                            oninput="updateCategoryProductImage(
                                ${questionIndex},
                                ${categoryIndex},
                                ${productIndex},
                                this.value
                            )"
                        >

                    </div>

                    <button
                        type="button"
                        class="small-delete-btn"
                        onclick="deleteCategoryProduct(
                            ${questionIndex},
                            ${categoryIndex},
                            ${productIndex}
                        )"
                    >
                        Remove
                    </button>
                `;

                productContainer.appendChild(
                    productRow
                );
            });
        });

        optionArea.appendChild(
            categoriesContainer
        );

        const addCategoryButton =
            document.createElement("button");

        addCategoryButton.type = "button";

        addCategoryButton.classList.add(
            "add-question-btn"
        );

        addCategoryButton.textContent =
            "+ Add Category";

        addCategoryButton.onclick =
            function() {

                addProductCategory(
                    questionIndex
                );

            };

        optionArea.appendChild(
            addCategoryButton
        );

        return;
    }

    /*
    ============================================================
    MONEY / NUMBER
    ============================================================
    */

    if (
        question.type === "moneyKeypad" ||
        question.type === "number"
    ) {

        optionArea.innerHTML = `
            <p class="helper-text">
                This question type does not need answer options.
            </p>
        `;

        return;
    }

    /*
    ============================================================
    NORMAL DROPDOWN / IMAGE OPTIONS
    ============================================================
    */

    optionArea.innerHTML =
        `<h4>Answer Options</h4>`;

    question.options.forEach(
        function(option, optionIndex) {

            const optionRow =
                document.createElement("div");

            optionRow.classList.add(
                "settings-option-row"
            );

            if (
                question.type ===
                "multiImageChoice"
            ) {

                optionRow.innerHTML = `

                    <input
                        type="text"
                        value="${option.name}"
                        placeholder="Option name"
                        oninput="updateImageOptionName(
                            ${questionIndex},
                            ${optionIndex},
                            this.value
                        )"
                    >

                    <input
                        type="text"
                        value="${option.image || ""}"
                        placeholder="Image URL"
                        oninput="updateImageOptionURL(
                            ${questionIndex},
                            ${optionIndex},
                            this.value
                        )"
                    >

                    <button
                        type="button"
                        class="small-delete-btn"
                        onclick="removeQuestionOption(
                            ${questionIndex},
                            ${optionIndex}
                        )"
                    >
                        Remove
                    </button>
                `;

            } else {

                optionRow.innerHTML = `

                    <input
                        type="text"
                        value="${option}"
                        placeholder="Option text"
                        oninput="updateOptionText(
                            ${questionIndex},
                            ${optionIndex},
                            this.value
                        )"
                    >

                    <button
                        type="button"
                        class="small-delete-btn"
                        onclick="removeQuestionOption(
                            ${questionIndex},
                            ${optionIndex}
                        )"
                    >
                        Remove
                    </button>
                `;
            }

            optionArea.appendChild(
                optionRow
            );
        }
    );

    const addRow =
        document.createElement("div");

    addRow.classList.add(
        "settings-option-row"
    );

    if (
        question.type ===
        "multiImageChoice"
    ) {

        addRow.innerHTML = `

            <input
                type="text"
                id="newImageOptionName-${questionIndex}"
                placeholder="New option name"
            >

            <input
                type="text"
                id="newImageOptionURL-${questionIndex}"
                placeholder="Image URL optional"
            >

            <button
                type="button"
                onclick="addImageQuestionOption(
                    ${questionIndex}
                )"
            >
                Add Option
            </button>
        `;

    } else {

        addRow.innerHTML = `

            <input
                type="text"
                id="newOption-${questionIndex}"
                placeholder="New option"
            >

            <button
                type="button"
                onclick="addQuestionOption(
                    ${questionIndex}
                )"
            >
                Add Option
            </button>
        `;
    }

    optionArea.appendChild(
        addRow
    );
}
function updateQuestionType(questionIndex, newType) {

    const question = formQuestions[questionIndex];

    question.type = newType;

    /*
    ============================================================
    CATEGORY PRODUCT QUESTION
    ============================================================
    */

    if (newType === "categoryChoice") {

        question.categories = [
            {
                name: "New Category",
                image: "",
                products: [
                    {
                        name: "New Product",
                        image: ""
                    }
                ]
            }
        ];

        delete question.options;
    }

    /*
    ============================================================
    MULTI IMAGE QUESTION
    ============================================================
    */

    else if (newType === "multiImageChoice") {

        question.options = [
            {
                name: "New Option",
                image: ""
            }
        ];

        delete question.categories;
    }

    /*
    ============================================================
    DROPDOWN
    ============================================================
    */

    else if (newType === "dropdown") {

        question.options = [
            "New Option"
        ];

        delete question.categories;
    }

    /*
    ============================================================
    MONEY / NUMBER
    ============================================================
    */

    else {

        question.options = [];

        delete question.categories;
    }

    saveFormQuestions();

    buildSalesForm();

    buildSettingsForm();
}

function moveQuestionUp(questionIndex) {
    if (questionIndex === 0) return;

    const question = formQuestions.splice(questionIndex, 1)[0];
    formQuestions.splice(questionIndex - 1, 0, question);

    saveFormQuestions();
    buildSalesForm();
    buildSettingsForm();
}

function moveQuestionDown(questionIndex) {
    if (questionIndex === formQuestions.length - 1) return;

    const question = formQuestions.splice(questionIndex, 1)[0];
    formQuestions.splice(questionIndex + 1, 0, question);

    saveFormQuestions();
    buildSalesForm();
    buildSettingsForm();
}

function deleteQuestion(questionIndex) {

    const confirmed = confirm(
        `Are you sure you want to delete "${formQuestions[questionIndex].question}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
        return;
    }

    formQuestions.splice(questionIndex, 1);

    saveFormQuestions();
    buildSalesForm();
    buildSettingsForm();
}

function addNewQuestion() {
    formQuestions.push({
        id: "question" + Date.now(),
        question: "New Question",
        type: "dropdown",
        options: ["New Option"]
    });

    saveFormQuestions();
    buildSalesForm();
    buildSettingsForm();
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
function updateCategoryName(
    questionIndex,
    categoryIndex,
    newName
) {

    formQuestions[questionIndex]
        .categories[categoryIndex]
        .name = newName;

    saveFormQuestions();

    buildSalesForm();
}


function updateCategoryImage(
    questionIndex,
    categoryIndex,
    newImage
) {

    formQuestions[questionIndex]
        .categories[categoryIndex]
        .image = newImage;

    saveFormQuestions();

    buildSalesForm();
}


function updateCategoryProductName(
    questionIndex,
    categoryIndex,
    productIndex,
    newName
) {

    formQuestions[questionIndex]
        .categories[categoryIndex]
        .products[productIndex]
        .name = newName;

    saveFormQuestions();

    buildSalesForm();
}


function updateCategoryProductImage(
    questionIndex,
    categoryIndex,
    productIndex,
    newImage
) {

    formQuestions[questionIndex]
        .categories[categoryIndex]
        .products[productIndex]
        .image = newImage;

    saveFormQuestions();

    buildSalesForm();
}

async function addProductCategory(
    questionIndex
) {
    formQuestions[questionIndex]
        .categories
        .push({
            name: "New Category",
            image: "",
            products: [
                {
                    name: "New Product",
                    image: ""
                }
            ]
        });

    await saveFormQuestions();

    buildSalesForm();
    buildSettingsForm();
}


async function addCategoryProduct(
    questionIndex,
    categoryIndex
) {
    formQuestions[questionIndex]
        .categories[categoryIndex]
        .products
        .push({
            name: "New Product",
            image: ""
        });

    await saveFormQuestions();

    buildSalesForm();
    buildSettingsForm();
}

function deleteCategory(
    questionIndex,
    categoryIndex
) {

    const category =
        formQuestions[questionIndex]
            .categories[categoryIndex];

    const confirmed = confirm(
        `Are you sure you want to delete the category "${category.name}"?\n\nAll products inside this category will also be deleted.`
    );

    if (!confirmed) {
        return;
    }

    formQuestions[questionIndex]
        .categories
        .splice(categoryIndex, 1);

    saveFormQuestions();

    buildSalesForm();

    buildSettingsForm();
}


function deleteCategoryProduct(
    questionIndex,
    categoryIndex,
    productIndex
) {

    const category =
        formQuestions[questionIndex]
            .categories[categoryIndex];

    const product =
        category.products[productIndex];

    const confirmed = confirm(
        `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) {
        return;
    }

    category.products.splice(
        productIndex,
        1
    );

    saveFormQuestions();

    buildSalesForm();

    buildSettingsForm();
}


function moveCategoryUp(
    questionIndex,
    categoryIndex
) {

    if (categoryIndex === 0) {
        return;
    }

    const categories =
        formQuestions[questionIndex]
            .categories;

    const category =
        categories.splice(
            categoryIndex,
            1
        )[0];

    categories.splice(
        categoryIndex - 1,
        0,
        category
    );

    saveFormQuestions();

    buildSalesForm();

    buildSettingsForm();
}


function moveCategoryDown(
    questionIndex,
    categoryIndex
) {

    const categories =
        formQuestions[questionIndex]
            .categories;

    if (
        categoryIndex ===
        categories.length - 1
    ) {
        return;
    }

    const category =
        categories.splice(
            categoryIndex,
            1
        )[0];

    categories.splice(
        categoryIndex + 1,
        0,
        category
    );

    saveFormQuestions();

    buildSalesForm();

    buildSettingsForm();
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

    const confirmed = confirm(
        "Are you sure you want to delete this option?"
    );

    if (!confirmed) {
        return;
    }

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

    const startIndex = (currentSalesPage - 1) * salesPerPage;
    const endIndex = startIndex + salesPerPage;
    const salesToShow = sales.slice(startIndex, endIndex);

    salesToShow.forEach(function(sale, index) {
        const actualIndex = startIndex + index;
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
                <button class="delete-btn" onclick="deleteSale(${actualIndex})">
                    Delete
                </button>
            </td>
        `;

        salesTableBody.appendChild(row);
    });

    renderSalesPagination();
}
function renderSalesPagination() {
    const pagination = document.getElementById("salesPagination");

    if (!pagination) return;

    const totalPages = Math.ceil(sales.length / salesPerPage);

    if (totalPages <= 1) {
        pagination.innerHTML = "";
        return;
    }

    pagination.innerHTML = `
        <button type="button" onclick="changeSalesPage(${currentSalesPage - 1})" ${currentSalesPage === 1 ? "disabled" : ""}>
            Previous
        </button>

        <span>Page ${currentSalesPage} of ${totalPages}</span>

        <button type="button" onclick="changeSalesPage(${currentSalesPage + 1})" ${currentSalesPage === totalPages ? "disabled" : ""}>
            Next
        </button>
    `;
}

function changeSalesPage(pageNumber) {
    const totalPages = Math.ceil(sales.length / salesPerPage);

    if (pageNumber < 1 || pageNumber > totalPages) return;

    currentSalesPage = pageNumber;
    displaySales();
}

async function deleteSale(index) {

    const saleToDelete = sales[index];

    const confirmed = confirm(
        `Are you sure you want to delete this sale?\n\n` +
        `${saleToDelete.item}\n` +
        `${saleToDelete.date}\n\n` +
        `This action cannot be undone.`
    );

    if (!confirmed) {
        return;
    }

    const { error } = await supabaseClient
        .from("sales")
        .delete()
        .eq("id", saleToDelete.id);

    if (error) {
        console.error("Error deleting sale:", error);
        alert("Could not delete sale.");
        return;
    }

    sales.splice(index, 1);

    displaySales();
    updateRevenueDashboard();

    // Optional: keep pagination valid after deletion
    const totalPages = Math.max(1, Math.ceil(sales.length / salesPerPage));

    if (currentSalesPage > totalPages) {
        currentSalesPage = totalPages;
    }

    displaySales();
}
function getChartColors(count) {
    const colors = [
        "#2563eb", "#dc2626", "#16a34a", "#f59e0b", "#9333ea",
        "#0891b2", "#db2777", "#65a30d", "#ea580c", "#475569",
        "#7c3aed", "#0f766e", "#be123c", "#4d7c0f", "#1d4ed8"
    ];

    let result = [];

    for (let i = 0; i < count; i++) {
        result.push(colors[i % colors.length]);
    }

    return result;
}
function renderSourcePieChart(sourceCounts) {
    const canvas = document.getElementById("sourcePieChart");

    if (!canvas) return;

    const labels = Object.keys(sourceCounts);
    const data = Object.values(sourceCounts);
    const colors = getChartColors(labels.length);

    if (sourcePieChart !== null) {
        sourcePieChart.destroy();
    }

    sourcePieChart = new Chart(canvas, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderColor: "#ffffff",
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "bottom"
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = data.reduce((sum, value) => sum + value, 0);
                            const value = context.raw;
                            const percent = ((value / total) * 100).toFixed(1);

                            return `${context.label}: ${value} sale(s) (${percent}%)`;
                        }
                    }
                }
            }
        }
    });
}
function renderProductBarChart(productCounts) {
    const canvas = document.getElementById("productBarChart");

    if (!canvas) return;

    const entries = Object.entries(productCounts).sort(function(a, b) {
        return b[1] - a[1];
    });

    const labels = entries.map(function(entry) {
        return entry[0];
    });

    const data = entries.map(function(entry) {
        return entry[1];
    });

    const colors = getChartColors(labels.length);

    if (productBarChart !== null) {
        productBarChart.destroy();
    }

    productBarChart = new Chart(canvas, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
            label: "Number of times sold",
            data: data,
            backgroundColor: colors,
            borderRadius: 4,
            barThickness: 20
        }]
        },
        options: {
            indexAxis: "y",
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: "Products Sold"
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.raw} sold`;
                        }
                    }
                }
            },
            scales: {
                 x: {
                     title: {
                        display: true,
                        text: "Number of times sold"
                 },
                beginAtZero: true,
                ticks: {
                    precision: 0
                }
            },
            y: {
                ticks: {
                    autoSkip: false,
                    font: {
                        size: 12
                    }
                }
            }
        }
        }
    });
}
function getColorHex(colorName) {
    const colorMap = {
        "Red": "#dc2626",
        "Pink": "#ec4899",
        "Yellow": "#eab308",
        "Purple": "#9333ea",
        "Black": "#111827",
        "Dark Green": "#166534",
        "Light Green": "#22c55e",
        "Transparent Green": "#86efac",
        "White": "#f8fafc",
        "Blue": "#2563eb",
        "Cyan": "#06b6d4",
        "Orange": "#f97316",
        "Light Pink": "#f9a8d4",
        "N/A": "#94a3b8"
    };

    return colorMap[colorName] || "#64748b";
}
function renderColorBarChart(colorCounts) {
    const canvas = document.getElementById("colorBarChart");

    if (!canvas) return;

    const entries = Object.entries(colorCounts).sort(function(a, b) {
        return b[1] - a[1];
    });

    const labels = entries.map(function(entry) {
        return entry[0];
    });

    const data = entries.map(function(entry) {
        return entry[1];
    });

    const colors = labels.map(function(label) {
    return getColorHex(label);
    });

    if (colorBarChart !== null) {
        colorBarChart.destroy();
    }

    colorBarChart = new Chart(canvas, {
        type: "bar",
        data: {
            labels: labels,
                datasets: [{
                    label: "Number of times used",
                    data: data,
                    backgroundColor: colors,
                    borderColor: "#334155",
                    borderWidth: 1,
                    borderRadius: 4,
                    barThickness: 20
                }]
        },
        options: {
            indexAxis: "y",
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: "Most Used Colors"
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.raw} uses`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Number of times used"
                    },
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                },
                y: {
                    ticks: {
                        autoSkip: false,
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}
function buildColorByProductStats() {
    const container = document.getElementById("colorByProductStats");

    if (!container) return;

    container.innerHTML = "";

    let productColorCounts = {};

    sales.forEach(function(sale) {
        if (!sale.color) return;

        const colorEntries = sale.color.split(",");

        colorEntries.forEach(function(entry) {
            const parts = entry.split(":");

            if (parts.length < 2) return;

            let productName = parts[0].trim();
            const colorTextForProduct =
    parts.slice(1).join(":").trim();

const colors =
    colorTextForProduct.split(" + ");

productName =
    productName.replace(/ #\d+$/, "");

if (!productColorCounts[productName]) {
    productColorCounts[productName] = {};
}

colors.forEach(function(colorName) {

    colorName = colorName.trim();

    if (!colorName) return;

    if (productColorCounts[productName][colorName]) {

        productColorCounts[productName][colorName]++;

    } else {

        productColorCounts[productName][colorName] = 1;

    }
});
        });
    });

    const productNames = Object.keys(productColorCounts);

    if (productNames.length === 0) {
        container.innerHTML = "<p>No color data yet.</p>";
        return;
    }

    productNames.forEach(function(productName) {
        const productCard = document.createElement("div");
        productCard.classList.add("product-color-card");

        const colors = productColorCounts[productName];

        const sortedColors = Object.entries(colors).sort(function(a, b) {
            return b[1] - a[1];
        });

        let colorPills = "";

        sortedColors.forEach(function(colorEntry) {
            const colorName = colorEntry[0];
            const count = colorEntry[1];
            const colorHex = getColorHex(colorName);

            colorPills += `
                <div class="color-pill">
                    <span 
                        class="color-dot" 
                        style="background-color: ${colorHex};"
                    ></span>

                    <span class="color-pill-name">${colorName}</span>

                    <span class="color-pill-count">${count}</span>
                </div>
            `;
        });

        productCard.innerHTML = `
            <h3>${productName}</h3>
            <div class="color-pill-list">
                ${colorPills}
            </div>
        `;

        container.appendChild(productCard);
    });
}
function showRevenueTab(tabId) {
    const revenueSections = document.querySelectorAll(".revenue-section");
    const revenueButtons = document.querySelectorAll(".revenue-tabs button");

    revenueSections.forEach(function(section) {
        section.classList.remove("active-revenue-section");
    });

    revenueButtons.forEach(function(button) {
        button.classList.remove("active-revenue-tab");
    });

    document.getElementById(tabId).classList.add("active-revenue-section");

    const clickedButton = document.querySelector(
        `.revenue-tabs button[onclick="showRevenueTab('${tabId}')"]`
    );

    if (clickedButton) {
        clickedButton.classList.add("active-revenue-tab");
    }
    // To make it "Fancy" when switching tabs so the charts animante.
    setTimeout(() => {
        updateRevenueDashboard();
    }, 50);
}
function updateRevenueDashboard() {
    const dashboardRevenue = document.getElementById("dashboardRevenue");
    const popularItem = document.getElementById("popularItem");
    const monthlyStats = document.getElementById("monthlyStats");

    let total = 0;
    let productCounts = {};
    let categoryCounts = {};
    let colorCounts = {};
    let monthlyTotals = {};
    let sourceCounts = {};

    const productCategoryMap =
        getProductCategoryMap();

    sales.forEach(function(sale) {
        total += sale.price;

        countProducts(sale.item, productCounts);
        countProductCategories(sale.item, categoryCounts, productCategoryMap);
        countColors(sale.color, colorCounts);
        countMonthlySales(sale, monthlyTotals);
        countSources(sale.source, sourceCounts);
    });
     renderRevenueTimestampPage();

    dashboardRevenue.textContent = "$" + total.toFixed(2);

    renderProductBarChart(productCounts);
    renderColorBarChart(colorCounts);
    buildColorByProductStats();
    renderSourcePieChart(sourceCounts);
    renderMonthlyStats(monthlyStats, monthlyTotals);

    let topItem = getTopItem(productCounts);

    if (popularItem) {
        popularItem.textContent = topItem;
    }
}
function renderRevenueTimestampPage() {
    const revenueTableBody = document.getElementById("revenueTableBody");

    if (!revenueTableBody) return;

    revenueTableBody.innerHTML = "";

    const startIndex = (currentRevenuePage - 1) * revenueSalesPerPage;
    const endIndex = startIndex + revenueSalesPerPage;
    const salesToShow = sales.slice(startIndex, endIndex);

    salesToShow.forEach(function(sale) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${sale.date}</td>
            <td>${sale.item}</td>
            <td>${sale.color}</td>
            <td>${sale.source}</td>
            <td>$${sale.price.toFixed(2)}</td>
        `;

        revenueTableBody.appendChild(row);
    });

    renderRevenuePagination();
}

function renderRevenuePagination() {
    const pagination = document.getElementById("revenuePagination");

    if (!pagination) return;

    const totalPages = Math.ceil(sales.length / revenueSalesPerPage);

    if (totalPages <= 1) {
        pagination.innerHTML = "";
        return;
    }

    pagination.innerHTML = `
        <button type="button" onclick="changeRevenuePage(${currentRevenuePage - 1})" ${currentRevenuePage === 1 ? "disabled" : ""}>
            Previous
        </button>

        <span>Page ${currentRevenuePage} of ${totalPages}</span>

        <button type="button" onclick="changeRevenuePage(${currentRevenuePage + 1})" ${currentRevenuePage === totalPages ? "disabled" : ""}>
            Next
        </button>
    `;
}

function changeRevenuePage(pageNumber) {
    const totalPages = Math.ceil(sales.length / revenueSalesPerPage);

    if (pageNumber < 1 || pageNumber > totalPages) return;

    currentRevenuePage = pageNumber;
    renderRevenueTimestampPage();
}

function countSources(source, sourceCounts) {
    if (!source) return;

    if (sourceCounts[source]) {
        sourceCounts[source]++;
    } else {
        sourceCounts[source] = 1;
    }
}
function countProducts(itemText, productCounts) {
    if (!itemText) return;

    const items = itemText.split(",");

    items.forEach(function(item) {
        let cleanItem = item.trim();

        const parts = cleanItem.split(" x");
        const name = parts[0];
        const quantity = Number(parts[1]) || 1;

        if (productCounts[name]) {
            productCounts[name] += quantity;
        } else {
            productCounts[name] = quantity;
        }
    });
}
function getProductCategoryMap() {

    const categoryMap = {};

    formQuestions.forEach(function(question) {

        if (question.type !== "categoryChoice") {
            return;
        }

        if (!question.categories) {
            return;
        }

        question.categories.forEach(function(category) {

            if (!category.products) {
                return;
            }

            category.products.forEach(function(product) {

                if (!product.name) {
                    return;
                }

                categoryMap[product.name] = category.name;
            });
        });
    });

    return categoryMap;
}
function countProductCategories(
    itemText,
    categoryCounts,
    productCategoryMap
) {

    if (!itemText) {
        return;
    }

    const items = itemText.split(",");

    items.forEach(function(item) {

        const cleanItem = item.trim();

        const parts = cleanItem.split(" x");

        const productName = parts[0];

        const quantity =
            Number(parts[1]) || 1;

        const category =
            productCategoryMap[productName];

        if (!category) {
            return;
        }

        if (categoryCounts[category]) {

            categoryCounts[category] += quantity;

        } else {

            categoryCounts[category] = quantity;

        }
    });
}

function countColors(colorText, colorCounts) {

    if (!colorText) return;

    const colorEntries = colorText.split(",");

    colorEntries.forEach(function(entry) {

        const parts = entry.split(":");

        if (parts.length < 2) return;

        const colorTextForProduct =
            parts.slice(1).join(":").trim();

        const colors =
            colorTextForProduct.split(" + ");

        colors.forEach(function(color) {

            color = color.trim();

            if (!color) return;

            if (colorCounts[color]) {
                colorCounts[color]++;
            } else {
                colorCounts[color] = 1;
            }
        });
    });
}

function countMonthlySales(sale, monthlyTotals) {
    const saleDate = new Date(sale.date);

    if (isNaN(saleDate)) return;

    const monthKey = saleDate.toLocaleString("default", {
        month: "long",
        year: "numeric"
    });

    if (monthlyTotals[monthKey]) {
        monthlyTotals[monthKey] += sale.price;
    } else {
        monthlyTotals[monthKey] = sale.price;
    }
}

function renderStats(container, statsObject) {
    const entries = Object.entries(statsObject);

    if (entries.length === 0) {
        container.innerHTML = "<p>No data yet.</p>";
        return;
    }

    entries.sort(function(a, b) {
        return b[1] - a[1];
    });

    const maxValue = entries[0][1];

    entries.forEach(function(entry) {
        const name = entry[0];
        const value = entry[1];
        const percent = (value / maxValue) * 100;

        const row = document.createElement("div");
        row.classList.add("stat-row");

        row.innerHTML = `
            <div class="stat-label">${name}: ${value}</div>
            <div class="stat-bar">
                <div class="stat-fill" style="width: ${percent}%"></div>
            </div>
        `;

        container.appendChild(row);
    });
}

function renderMonthlyStats(container, monthlyTotals) {
    container.innerHTML = "";

    let monthlySales = {};

    sales.forEach(function(sale) {
        const saleDate = new Date(sale.date);

        if (isNaN(saleDate)) return;

        const monthKey = saleDate.toLocaleString("default", {
            month: "long",
            year: "numeric"
        });

        if (!monthlySales[monthKey]) {
            monthlySales[monthKey] = [];
        }

        monthlySales[monthKey].push(sale);
    });

    const monthNames = Object.keys(monthlySales);

    if (monthNames.length === 0) {
        container.innerHTML = "<p>No monthly sales yet.</p>";
        return;
    }

    monthNames.sort(function(a, b) {
        return new Date(a) - new Date(b);
    });

    monthNames.forEach(function(monthName) {
        const monthSales = monthlySales[monthName];

        monthSales.sort(function(a, b) {
            return new Date(a.date) - new Date(b.date);
        });

        let monthTotal = 0;

        monthSales.forEach(function(sale) {
            monthTotal += sale.price;
        });

        const monthCard = document.createElement("div");
        monthCard.classList.add("month-card");

        let saleRows = "";

        monthSales.forEach(function(sale) {
            saleRows += `
                <div class="monthly-sale-row">
                    <div>
                        <strong>${sale.date}</strong>
                        <p>${sale.item}</p>
                        <p>${sale.color}</p>
                        <p>${sale.source}</p>
                    </div>

                    <div class="monthly-sale-price">
                        $${sale.price.toFixed(2)}
                    </div>
                </div>
            `;
        });

        monthCard.innerHTML = `
    <button class="month-toggle" type="button">
        <span>${monthName}</span>
        <span>$${monthTotal.toFixed(2)}</span>
    </button>

    <div class="month-details">
        <button type="button" class="plain-report-btn">
            Open Plain Report
        </button>

        ${saleRows}
    </div>
`;

        const toggleButton = monthCard.querySelector(".month-toggle");
        const details = monthCard.querySelector(".month-details");
        const reportButton = monthCard.querySelector(".plain-report-btn");

reportButton.addEventListener("click", function() {
    openMonthlyPlainReport(monthName, monthSales, monthTotal);
});

        toggleButton.addEventListener("click", function() {
            details.classList.toggle("open");
            toggleButton.classList.toggle("open");
        });

        container.appendChild(monthCard);
    });
}
function openMonthlyPlainReport(monthName, monthSales, monthTotal) {
    let reportText = "";

    reportText += `${monthName} Sales Report\n`;
    reportText += `Total Revenue: $${monthTotal.toFixed(2)}\n`;
    reportText += "----------------------------------------\n\n";

    monthSales.forEach(function(sale) {
        reportText += `Date: ${sale.date}\n`;
        reportText += `Items: ${sale.item}\n`;
        reportText += `Colors: ${sale.color}\n`;
        reportText += `Source: ${sale.source}\n`;
        reportText += `Total Paid: $${sale.price.toFixed(2)}\n`;
        reportText += "----------------------------------------\n\n";
    });

    const reportWindow = window.open("", "_blank");

    reportWindow.document.write(`
        <pre>${reportText}</pre>
    `);

    reportWindow.document.close();
}

function getTopItem(productCounts) {
    let topItem = "No sales yet";
    let highestCount = 0;

    for (let item in productCounts) {
        if (productCounts[item] > highestCount) {
            highestCount = productCounts[item];
            topItem = item;
        }
    }

    return topItem;
}
function filterSalesByDate() {
    const startDateInput = document.getElementById("filterStartDate").value;
    const endDateInput = document.getElementById("filterEndDate").value;
    const filteredSalesBody = document.getElementById("filteredSalesBody");

    filteredSalesBody.innerHTML = "";

    if (startDateInput === "" || endDateInput === "") {
        alert("Please choose both a start date and an end date.");
        return;
    }

    const startDate = new Date(startDateInput);
    const endDate = new Date(endDateInput);

    sales.forEach(function(sale) {
        const saleDate = new Date(sale.date);

        if (saleDate >= startDate && saleDate <= endDate) {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${sale.date}</td>
                <td>${sale.item}</td>
                <td>${sale.color}</td>
                <td>${sale.source}</td>
                <td>$${sale.price.toFixed(2)}</td>
            `;

            filteredSalesBody.appendChild(row);
        }
    });
}

function clearSalesFilter() {
    document.getElementById("filterStartDate").value = "";
    document.getElementById("filterEndDate").value = "";
    document.getElementById("filteredSalesBody").innerHTML = "";
}
function getColorStyle(colorName) {

    const colorMap = {

        "Red": {
            background: "#ef4444",
            text: "#ffffff"
        },

        "Pink": {
            background: "#ec4899",
            text: "#ffffff"
        },

        "Yellow": {
            background: "#facc15",
            text: "#172033"
        },

        "Purple": {
            background: "#8b5cf6",
            text: "#ffffff"
        },

        "Black": {
            background: "#1f2937",
            text: "#ffffff"
        },

        "Dark Green": {
            background: "#166534",
            text: "#ffffff"
        },

        "Green": {
            background: "#02f35a",
            text: "#172033"
        },

        "Transparent Green": {
            background: "#6ee7b7",
            text: "#064e3b"
        },

        "White": {
            background: "#ffffff",
            text: "#172033"
        },

        "Blue": {
            background: "#3b82f6",
            text: "#ffffff"
        },

        "Cyan": {
            background: "#22d3ee",
            text: "#083344"
        },

        "Orange": {
            background: "#f97316",
            text: "#ffffff"
        },

        "Light Pink": {
            background: "#f9a8d4",
            text: "#831843"
        },

        "N/A": {
            background: "#e2e8f0",
            text: "#334155"
        }
    };


    return colorMap[colorName] || {
        background: "#e2e8f0",
        text: "#172033"
    };
}
function updateColorQuestions() {
    const colorSection = document.getElementById("colorSection");

    if (!colorSection) return;

    colorSection.innerHTML = "";

    const selectedCards = document.querySelectorAll(".choice-card.selected");

    if (selectedCards.length === 0) {
        colorSection.innerHTML =
            "<p class='helper-text'>Select a print first to choose colors.</p>";
        return;
    }

    selectedCards.forEach(function(card) {

        const productName = card.dataset.value;
        const productQuantity = Number(card.dataset.quantity);

        for (let i = 1; i <= productQuantity; i++) {

            const colorBox = document.createElement("div");
            colorBox.classList.add("color-branch-box");

            const label = document.createElement("label");
            label.textContent = `Colors for ${productName} #${i}`;

            colorBox.appendChild(label);

            const helperText = document.createElement("p");
            helperText.classList.add("color-helper-text");
            helperText.textContent = "Select all colors used on this print.";

            colorBox.appendChild(helperText);

            const colorGrid = document.createElement("div");
            colorGrid.classList.add("color-checkbox-grid");

            const colorQuestion = formQuestions.find(
                q => q.id === "color"
            );

            if (!colorQuestion) return;

            colorQuestion.options.forEach(function(color) {

               const colorLabel = document.createElement("label");

colorLabel.classList.add("color-checkbox");

const checkbox = document.createElement("input");

checkbox.type = "checkbox";
checkbox.value = color;

checkbox.dataset.product = `${productName} #${i}`;


/* Set the actual color of the chip */

const colorStyle = getColorStyle(color);

colorLabel.style.setProperty(
    "--color",
    colorStyle.background
);

colorLabel.style.setProperty(
    "--text-color",
    colorStyle.text
);


const colorText = document.createElement("span");

colorText.textContent = color;


colorLabel.appendChild(checkbox);

colorLabel.appendChild(colorText);

colorGrid.appendChild(colorLabel); 
            });

            colorBox.appendChild(colorGrid);

            colorSection.appendChild(colorBox);
        }
    });
}
function getSelectedColors() {

    const colorGroups =
        document.querySelectorAll(".color-branch-box");

    let colors = [];

    colorGroups.forEach(function(group) {

        const checkboxes =
            group.querySelectorAll("input[type='checkbox']:checked");

        if (checkboxes.length === 0) {
            return;
        }

        const productName =
            checkboxes[0].dataset.product;

        const selectedColors =
            Array.from(checkboxes)
                .map(function(checkbox) {
                    return checkbox.value;
                })
                .join(" + ");

        colors.push(
            `${productName}: ${selectedColors}`
        );
    });

    return colors.join(", ");
}
let moneyValue = "";

function updateMoneyDisplay() {
    const moneyDisplay = document.getElementById("moneyDisplay");
    
    const priceInput = document.getElementById("amount");

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

function showSaleSuccessMessage() {
    saleForm.classList.add("hidden");

    const successMessage = document.getElementById("saleSuccessMessage");
    successMessage.classList.remove("hidden");
}

function resetSaleFormView() {
    saleForm.reset();
    moneyValue = "";
    buildSalesForm();

    const successMessage = document.getElementById("saleSuccessMessage");
    successMessage.classList.add("hidden");

    saleForm.classList.remove("hidden");
}
saleForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const selectedProducts = getSelectedProducts();

    if (selectedProducts.items === "") {
        alert("Please select at least one 3D print.");
        return;
    }

    const selectedColors = getSelectedColors();

    const colorGroups =
    document.querySelectorAll(".color-branch-box");

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
        date: new Date().toISOString(),
        item: selectedProducts.items,
        color: selectedColors,
        source: (document.getElementById("source") || document.querySelector("select[id='source']")).value,
        price: totalPurchaseAmount,
        quantity: selectedProducts.totalQuantity
    };

    const { data, error } = await supabaseClient
    .from("sales")
    .insert({
        sale_date: newSale.date,
        item: newSale.item,
        color: newSale.color,
        source: newSale.source,
        price: newSale.price,
        quantity: newSale.quantity
    })
    .select();

    if (error) {
        console.error("Error saving sale:", error);
        alert("Could not save sale to Supabase.");
        return;
    }

    newSale.id = data[0].id;
    sales.unshift(newSale);

    displaySales();
    updateRevenueDashboard();

    showSaleSuccessMessage();
});

buildSalesForm();
buildSettingsForm();
loadSalesFromCloud();