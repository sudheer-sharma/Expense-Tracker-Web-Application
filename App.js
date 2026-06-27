let expenses = [];
let salary = 0;
let chart = null;

// Load from Local Storage
window.onload = function () {
  const saved = localStorage.getItem("expenses");
  const savedSalary = localStorage.getItem("salary");

  if (saved) {
    expenses = JSON.parse(saved);
    renderTable();
  }

  if (savedSalary) {
    salary = parseFloat(savedSalary);
    document.getElementById("salary").value = salary;
  }

  updateSummary();
  updatePieChart();
};

// Save to Local Storage
function saveData() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
  localStorage.setItem("salary", salary);
}

// Salary change
document.getElementById("salary").addEventListener("input", function (e) {
  salary = parseFloat(e.target.value) || 0;
  saveData();
  updateSummary();
});

// ADD EXPENSE
function addExpense() {
  const item = document.getElementById("itemName").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const employee = document.getElementById("employeeName").value;

  if (!item || !amount || !employee) {
    alert("Please fill all fields");
    return;
  }

  const expense = {
    item,
    amount,
    date: new Date().toLocaleDateString()
  };

  expenses.push(expense);

  saveData();
  renderTable();
  clearInputs();
}

// CLEAR INPUTS
function clearInputs() {
  document.getElementById("itemName").value = "";
  document.getElementById("amount").value = "";
}

// RENDER TABLE
function renderTable() {
  const table = document.getElementById("expenseTable").querySelector("tbody");
  table.innerHTML = "";

  expenses.forEach((exp, index) => {
    const row = table.insertRow();

    row.insertCell(0).innerText = exp.item;
    row.insertCell(1).innerText = exp.amount;

    const dateCell = row.insertCell(2);
    dateCell.innerHTML = `
      ${exp.date}
           <button class="delete-btn" onclick="deleteExpense(${index})">❌</button>
    `;
  });

  updateSummary();
  updatePieChart();
}

// DELETE
function deleteExpense(index) {
  expenses.splice(index, 1);
  saveData();
  renderTable();
}

// EDIT
function editExpense(index) {
  const exp = expenses[index];

  document.getElementById("itemName").value = exp.item;
  document.getElementById("amount").value = exp.amount;

  expenses.splice(index, 1);
  saveData();
  renderTable();
}

// SUMMARY
function updateSummary() {
  let total = expenses.reduce((sum, e) => sum + e.amount, 0);
  let remaining = salary - total;

  document.getElementById("totalSalary").textContent = salary;
  document.getElementById("totalExpenses").textContent = total;
  document.getElementById("remainingSalary").textContent = remaining;
}

// CHART
function updatePieChart() {
  let data = {};

  expenses.forEach(e => {
    data[e.item] = (data[e.item] || 0) + e.amount;
  });

  let labels = Object.keys(data);
  let values = Object.values(data);

  if (chart) chart.destroy();

  const ctx = document.getElementById("expenseChart").getContext("2d");

  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff"]
      }]
    }
  });
}

// EXPORT
function exportData() {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(expenses);
  XLSX.utils.book_append_sheet(wb, ws, "Expenses");
  XLSX.writeFile(wb, "expenses.xlsx");
}




