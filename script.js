const currentUser = localStorage.getItem("loggedInUser");
if (!currentUser) window.location.href = "login.html";

// 🔑 Keys
const EXPENSE_KEY = `expenses_${currentUser}`;
const DAILY_KEY = `daily_${currentUser}`;
const MONTHLY_KEY = `monthly_${currentUser}`;

let expenses = JSON.parse(localStorage.getItem(EXPENSE_KEY)) || [];
let dailyLimit = localStorage.getItem(DAILY_KEY);
let monthlyLimit = localStorage.getItem(MONTHLY_KEY);
let currentCategory = "All";

// Elements
const expenseForm = document.getElementById("expenseForm");
const expenseList = document.getElementById("expenseList");
const totalEl = document.getElementById("total");
const summaryEl = document.getElementById("categorySummary");
const remainingEl = document.getElementById("remaining");
const addBtn = document.getElementById("addBtn");
const searchInput = document.getElementById("search");

expenseForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const amount = Number(document.getElementById("amount").value);
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;
    const note = document.getElementById("note").value;

    const today = new Date().toISOString().split("T")[0];
    const month = date.slice(0, 7);

    const todayTotal = expenses
        .filter(e => e.date === today)
        .reduce((s, e) => s + e.amount, 0);

    const monthTotal = expenses
        .filter(e => e.date.startsWith(month))
        .reduce((s, e) => s + e.amount, 0);

    if (dailyLimit && todayTotal + amount > dailyLimit) {
        alert("❌ Daily limit exceeded");
        return;
    }

    if (monthlyLimit && monthTotal + amount > monthlyLimit) {
        alert("❌ Monthly budget exceeded");
        return;
    }

    expenses.push({ amount, category, date, note });
    localStorage.setItem(EXPENSE_KEY, JSON.stringify(expenses));

    expenseForm.reset();
    renderExpenses();
});

function setDailyLimit() {
    const limit = document.getElementById("dailyLimit").value;
    if (limit > 0) {
        localStorage.setItem(DAILY_KEY, limit);
        dailyLimit = limit;
        renderExpenses();
    }
}

function setMonthlyLimit() {
    const limit = document.getElementById("monthlyLimit").value;
    if (limit > 0) {
        localStorage.setItem(MONTHLY_KEY, limit);
        monthlyLimit = limit;
    }
}

function filterCategory(category) {
    currentCategory = category;
    renderExpenses();
}

function renderExpenses() {
    expenseList.innerHTML = "";
    summaryEl.innerHTML = "";
    let total = 0;
    let categoryTotals = {};

    const today = new Date().toISOString().split("T")[0];
    let todayTotal = 0;

    const searchText = searchInput.value.toLowerCase();

    expenses.forEach((exp, index) => {
        if (exp.date === today) todayTotal += exp.amount;

        if (
            (currentCategory === "All" || exp.category === currentCategory) &&
            (exp.note.toLowerCase().includes(searchText) ||
             exp.category.toLowerCase().includes(searchText))
        ) {
            total += exp.amount;
            categoryTotals[exp.category] =
                (categoryTotals[exp.category] || 0) + exp.amount;

            const li = document.createElement("li");
            li.innerHTML = `₹${exp.amount} - ${exp.category}
                <button onclick="deleteExpense(${index})">X</button>`;
            expenseList.appendChild(li);
        }
    });

    totalEl.innerText = total;

    for (let cat in categoryTotals) {
        const li = document.createElement("li");
        li.innerText = `${cat}: ₹${categoryTotals[cat]}`;
        summaryEl.appendChild(li);
    }

    if (dailyLimit) {
        const remaining = dailyLimit - todayTotal;
        remainingEl.innerText = remaining >= 0 ? remaining : 0;
        addBtn.disabled = remaining <= 0;
    }
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    localStorage.setItem(EXPENSE_KEY, JSON.stringify(expenses));
    renderExpenses();
}

function clearAll() {
    if (confirm("Clear all expenses?")) {
        expenses = [];
        localStorage.setItem(EXPENSE_KEY, JSON.stringify([]));
        renderExpenses();
    }
}

renderExpenses();
