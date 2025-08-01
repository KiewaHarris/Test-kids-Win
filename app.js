
let defaultTasks = [
  { name: "Brush teeth", coins: 1, time: "morning" },
  { name: "Make bed", coins: 2, time: "morning" },
  { name: "Feed pet", coins: 2, time: "afternoon" },
  { name: "Read for 10 minutes", coins: 3, time: "evening" }
];

let children = JSON.parse(localStorage.getItem('kidsWinChildren')) || [
  { name: "Walter", avatar: "🦎", coins: 0, tasks: JSON.parse(JSON.stringify(defaultTasks)), rewards: [], rewardHistory: [], purchased: [] }
];

let selectedChildIndex = 0;

function updateChildSelect() {
  const select = document.getElementById('child-select');
  select.innerHTML = '';
  children.forEach((child, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = child.name;
    select.appendChild(option);
  });
  select.value = selectedChildIndex;
  select.onchange = () => {
    selectedChildIndex = parseInt(select.value);
    renderDashboard();
  };
}

function renderDashboard() {
  const child = children[selectedChildIndex];
  document.getElementById('child-avatar').textContent = child.avatar;
  document.getElementById('child-coins').textContent = child.coins;

  const sections = {
    morning: document.getElementById('morning-tasks'),
    afternoon: document.getElementById('afternoon-tasks'),
    evening: document.getElementById('evening-tasks')
  };
  Object.values(sections).forEach(sec => sec.innerHTML = '');
  child.tasks.forEach((task, i) => {
    const li = document.createElement('li');
    li.innerHTML = `${task.name} - ${task.coins} coins <button onclick="completeTask(${i})">✅</button>`;
    sections[task.time].appendChild(li);
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
  let child = children[selectedChildIndex];
  child.coins += child.tasks[index].coins;
  child.tasks.splice(index, 1);
  saveAndRender();
}

function redeemReward(index) {
  let child = children[selectedChildIndex];
  let reward = child.rewards[index];
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

window.onload = () => {
  updateChildSelect();
  renderDashboard();
};
