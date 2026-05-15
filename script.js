// ================= USERS =================

const users = [
  {
    username: "owal",
    password: "123",
    balance: 1250000,
    walletId: "OW-241",
    history: [
      {
        name: "Top Up Saldo",
        amount: 250000,
        time: "Hari ini • 09:20",
        icon: "fa-wallet"
      },
      {
        name: "Bayar Makanan",
        amount: 45000,
        time: "Kemarin • 18:40",
        icon: "fa-utensils"
      },
      {
        name: "Voucher Game",
        amount: 75000,
        time: "Kemarin • 21:15",
        icon: "fa-gamepad"
      }
    ]
  },
  {
    username: "danil",
    password: "123",
    balance: 875000,
    walletId: "DN-526",
    history: [
      {
        name: "Pulsa Telkomsel",
        amount: 50000,
        time: "Hari ini • 08:10",
        icon: "fa-mobile-screen"
      },
      {
        name: "Bayar Internet",
        amount: 180000,
        time: "Kemarin • 20:00",
        icon: "fa-wifi"
      },
      {
        name: "Transfer ke Owal",
        amount: 100000,
        time: "2 hari lalu • 14:25",
        icon: "fa-paper-plane"
      }
    ]
  }
];

let currentUser = null;

// ================= FORMAT =================

function formatRupiah(number){
  return "Rp " + Number(number).toLocaleString("id-ID");
}

// ================= PAGE =================

function showPage(pageId){
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  document.getElementById(pageId).classList.add("active");

  const bottomNav = document.getElementById("bottomNav");

  if(pageId === "loginPage"){
    bottomNav.style.display = "none";
  }else{
    bottomNav.style.display = "flex";
  }

  render();
}

// ================= LOGIN =================

function login(){
  const username = document.getElementById("username").value.trim().toLowerCase();
  const password = document.getElementById("password").value.trim();

  const foundUser = users.find(user => {
    return user.username === username && user.password === password;
  });

  if(!foundUser){
    showToast("Username atau password salah");
    return;
  }

  currentUser = foundUser;

  document.getElementById("username").value = "";
  document.getElementById("password").value = "";

  showToast("Login berhasil");
  showPage("homePage");
}

// ================= LOGOUT =================

function logout(){
  currentUser = null;
  showToast("Berhasil keluar");
  showPage("loginPage");
}

// ================= OPEN =================

function openTopup(){
  showPage("topupPage");
}

function openTransfer(){
  showPage("transferPage");
}

// ================= TOP UP =================

function setTopup(amount){
  document.getElementById("topupAmount").value = amount;
}

function topup(){
  const input = document.getElementById("topupAmount");
  const amount = Number(input.value);

  if(!currentUser){
    showToast("Silakan login dulu");
    return;
  }

  if(!amount || amount <= 0){
    showToast("Nominal top up tidak valid");
    return;
  }

  currentUser.balance += amount;

  currentUser.history.unshift({
    name: "Top Up Saldo",
    amount: amount,
    time: "Baru saja",
    icon: "fa-wallet"
  });

  input.value = "";

  successEffect();
  showToast("Top up berhasil");
  render();

  setTimeout(() => {
    showPage("homePage");
  }, 600);
}

// ================= TRANSFER =================

function transfer(){
  const receiverInput = document.getElementById("receiverName");
  const amountInput = document.getElementById("transferAmount");

  const receiver = receiverInput.value.trim();
  const amount = Number(amountInput.value);

  if(!currentUser){
    showToast("Silakan login dulu");
    return;
  }

  if(!receiver || !amount || amount <= 0){
    showToast("Isi penerima dan nominal");
    return;
  }

  if(amount > currentUser.balance){
    showToast("Saldo tidak cukup");
    return;
  }

  currentUser.balance -= amount;

  currentUser.history.unshift({
    name: "Transfer ke " + receiver,
    amount: amount,
    time: "Baru saja",
    icon: "fa-paper-plane"
  });

  receiverInput.value = "";
  amountInput.value = "";

  successEffect();
  showToast("Transfer berhasil");
  render();

  setTimeout(() => {
    showPage("homePage");
  }, 600);
}

// ================= RENDER =================

function render(){
  if(!currentUser) return;

  document.getElementById("userName").textContent = currentUser.username;
  document.getElementById("balanceText").textContent = formatRupiah(currentUser.balance);
  document.getElementById("walletId").textContent = currentUser.walletId;

  const historyList = document.getElementById("historyList");
  historyList.innerHTML = "";

  currentUser.history.forEach(item => {
    historyList.innerHTML += `
      <div class="history-item">
        <div class="history-left">

          <div class="history-icon">
            <i class="fa-solid ${item.icon}"></i>
          </div>

          <div>
            <div class="history-name">${item.name}</div>
            <div class="history-time">${item.time}</div>
          </div>

        </div>

        <div class="history-amount">
          ${formatRupiah(item.amount)}
        </div>
      </div>
    `;
  });
}

// ================= EFFECT =================

function successEffect(){
  const phone = document.querySelector(".phone");

  phone.style.transform = "scale(1.015)";
  phone.style.transition = ".25s ease";

  setTimeout(() => {
    phone.style.transform = "scale(1)";
  }, 250);
}

function showToast(message){
  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}

// ================= START =================

showPage("loginPage");