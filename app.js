
let pinCode = localStorage.getItem('kidsWinPIN') || null;
let parentUnlocked = false;

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
      applyParentLock();
    } else {
      alert("Incorrect PIN.");
    }
  }
}

function applyParentLock() {
  const buttons = document.querySelectorAll('button[onclick^="addTask"], button[onclick^="addReward"]');
  buttons.forEach(btn => {
    btn.style.display = parentUnlocked ? 'inline-block' : 'none';
  });
}

window.onload = () => {
  applyParentLock();
};
