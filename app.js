
function toggleChildModal() {
  const modal = document.getElementById("add-child-modal");
  modal.style.display = (modal.style.display === "none") ? "block" : "none";
}

function createChild() {
  const name = document.getElementById("new-name").value;
  const age = +document.getElementById("new-age").value;
  const emoji = document.getElementById("new-emoji").value;
  const coins = +document.getElementById("new-coins").value;

  let children = JSON.parse(localStorage.getItem("kidsWinChildren") || "[]");
  children.push({ name, age, avatar: emoji, coins, tasks: [], rewards: [], purchased: [], schedule: {} });
  localStorage.setItem("kidsWinChildren", JSON.stringify(children));
  location.reload();
}
