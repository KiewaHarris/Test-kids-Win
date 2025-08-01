
let pinCode = localStorage.getItem('kidsWinPIN') || null;
let parentUnlocked = false;

let children = JSON.parse(localStorage.getItem('kidsWinChildren')) || [];
let selectedChildIndex = 0;

function enterPin() {
  if (!pinCode) {
    const newPin = prompt("Set your 4-digit parent PIN:");
    if (newPin && newPin.length === 4) {
      localStorage.setItem('kidsWinPIN', newPin);
      alert("PIN set. Use this to unlock parent controls.");
    }
  } else {
    const entered = prompt("Enter parent PIN:");
    if (entered === pinCode) {
      parentUnlocked = true;
      alert("Parent mode unlocked.");
      document.getElementById("add-child-btn").style.display = "inline-block";
      applyParentLock();
    } else {
      alert("Incorrect PIN.");
    }
  }
}

function addChild() {
  const name = prompt("Child's name?");
  const avatar = prompt("Choose an emoji avatar:");
  const age = prompt("Child's age?");
  const coins = parseInt(prompt("Starting coins?"), 10);

  if (name && avatar && !isNaN(coins)) {
    const newChild = {
      name,
      avatar,
      age,
      coins,
      tasks: [],
      rewards: [],
      purchased: []
    };
    children.push(newChild);
    localStorage.setItem("kidsWinChildren", JSON.stringify(children));
    updateChildSelect();
    selectedChildIndex = children.length - 1;
    renderDashboard();
  }
}

function updateChildSelect() {
  const select = document.getElementById('child-select');
  select.innerHTML = '';
  children.forEach((child, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = child.name;
    select.appendChild(option);
  });
  select.onchange = () => {
    selectedChildIndex = parseInt(select.value);
    renderDashboard();
  };
}

function renderDashboard() {
  if (children.length === 0) return;
  const child = children[selectedChildIndex];
  document.getElementById('child-avatar').textContent = child.avatar;
  document.getElementById('child-age').textContent = child.age;
  document.getElementById('child-coins').textContent = child.coins;

  const taskSections = {
    morning: document.getElementById('morning-tasks'),
    afternoon: document.getElementById('afternoon-tasks'),
    evening: document.getElementById('evening-tasks')
  };
  Object.values(taskSections).forEach(ul => ul.innerHTML = '');
  child.tasks.forEach((task, i) => {
    const li = document.createElement('li');
    li.innerHTML = `${task.name} - ${task.coins} coins <button onclick="completeTask(${i})">✅</button>`;
    taskSections[task.time].appendChild(li);
  });

  const rewardList = document.getElementById('reward-list');
  rewardList.innerHTML = '';
  child.rewards.forEach((reward, i) => {
    const li = document.createElement('li');
    li.innerHTML = `${reward.name} - ${reward.cost} coins <button onclick="redeemReward(${i})">🎉</button>`;
    rewardList.appendChild(li);
  });

  const purchasedList = document.getElementById('purchased-rewards');
  purchasedList.innerHTML = '';
  child.purchased.forEach(entry => {
    const li = document.createElement('li');
    li.textContent = `${entry.name} on ${entry.date}`;
    purchasedList.appendChild(li);
  });
}

function completeTask(index) {
  const child = children[selectedChildIndex];
  child.coins += child.tasks[index].coins;
  child.tasks.splice(index, 1);
  saveAndRender();
}

function redeemReward(index) {
  const child = children[selectedChildIndex];
  const reward = child.rewards[index];
  if (child.coins >= reward.cost) {
    if (confirm(`Redeem "${reward.name}" for ${reward.cost} coins?`)) {
      child.coins -= reward.cost;
      child.purchased.push({ name: reward.name, date: new Date().toLocaleDateString() });
    }
  } else {
    alert("Not enough coins!");
  }
  saveAndRender();
}

function addTask() {
  const name = prompt("Task name?");
  const coins = parseInt(prompt("Coins for task?"), 10);
  const time = prompt("Time of day? (morning, afternoon, evening)");
  if (name && !isNaN(coins) && ["morning", "afternoon", "evening"].includes(time)) {
    children[selectedChildIndex].tasks.push({ name, coins, time });
    saveAndRender();
  }
}

function addReward() {
  const name = prompt("Reward name?");
  const cost = parseInt(prompt("Cost in coins?"), 10);
  if (name && !isNaN(cost)) {
    children[selectedChildIndex].rewards.push({ name, cost });
    saveAndRender();
  }
}

function saveAndRender() {
  localStorage.setItem('kidsWinChildren', JSON.stringify(children));
  renderDashboard();
}

function applyParentLock() {
  const buttons = document.querySelectorAll('button[onclick^="addTask"], button[onclick^="addReward"]');
  buttons.forEach(btn => {
    btn.style.display = parentUnlocked ? 'inline-block' : 'none';
  });
}

window.onload = () => {
  updateChildSelect();
  renderDashboard();
  applyParentLock();
};


let calendarDate = new Date();

function renderCalendar() {
  const calendarEl = document.getElementById("calendar");
  if (!calendarEl) return;

  calendarEl.innerHTML = "";
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    calendarEl.appendChild(empty);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement("div");
    cell.textContent = d;
    cell.onclick = () => openScheduleModal(d, month, year);
    calendarEl.appendChild(cell);
  }
}

function prevMonth() {
  calendarDate.setMonth(calendarDate.getMonth() - 1);
  renderCalendar();
}
function nextMonth() {
  calendarDate.setMonth(calendarDate.getMonth() + 1);
  renderCalendar();
}

function openScheduleModal(day, month, year) {
  if (!parentUnlocked) {
    alert("Parent PIN required to edit schedule.");
    return;
  }
  const child = children[selectedChildIndex];
  const key = `${year}-${month + 1}-${day}`;
  const schedule = prompt("Add schedule for this day (use emoji):", child.schedule?.[key] || "");
  if (!child.schedule) child.schedule = {};
  if (schedule !== null) {
    child.schedule[key] = schedule;
    saveAndRender();
  }
}

function renderScheduleOnCalendar() {
  const child = children[selectedChildIndex];
  const calendarEl = document.getElementById("calendar");
  if (!calendarEl || !child.schedule) return;

  [...calendarEl.children].forEach(cell => {
    const day = parseInt(cell.textContent);
    if (!isNaN(day)) {
      const key = `${calendarDate.getFullYear()}-${calendarDate.getMonth() + 1}-${day}`;
      if (child.schedule[key]) {
        const tag = document.createElement("div");
        tag.textContent = child.schedule[key];
        cell.appendChild(tag);
      }
    }
  });
}

window.onload = () => {
  updateChildSelect();
  renderDashboard();
  applyParentLock();
  renderCalendar();
  renderScheduleOnCalendar();
};