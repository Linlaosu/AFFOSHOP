// app.js

const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartPanel = document.getElementById("cartPanel");
const backdrop = document.getElementById("backdrop");
const cartItemsEl = document.getElementById("cartItems");
const cartCountEl = document.getElementById("cartCount");
const cartTotalEl = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

let cart = [];

function openCart() {
  cartPanel.classList.add("open");
  backdrop.classList.add("show");
}

function closeCart() {
  cartPanel.classList.remove("open");
  backdrop.classList.remove("show");
}

openCartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
backdrop.addEventListener("click", closeCart);

function formatCurrency(amount) {
  return "NT$ " + amount.toLocaleString("zh-TW");
}

function renderCart() {
  cartItemsEl.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;
    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML = `
      <div>
        <div>${item.name}</div>
        <small>NT$ ${item.price.toLocaleString("zh-TW")} × ${item.qty}</small>
      </div>
      <button data-index="${index}" class="remove-btn">刪除</button>
    `;
    cartItemsEl.appendChild(li);
  });

  cartTotalEl.textContent = formatCurrency(total);
  cartCountEl.textContent = cart.reduce((sum, i) => sum + i.qty, 0);
}

document.querySelectorAll(".add-to-cart").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const card = e.target.closest(".product-card");
    const id = card.dataset.id;
    const name = card.dataset.name;
    const price = Number(card.dataset.price);

    const existing = cart.find((item) => item.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id, name, price, qty: 1 });
    }

    renderCart();
    openCart();
  });
});

cartItemsEl.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-btn")) {
    const index = Number(e.target.dataset.index);
    cart.splice(index, 1);
    renderCart();
  }
});

checkoutBtn.addEventListener("click", () => {
  alert("目前為示意頁，實際結帳流程可與台灣金流廠商（如綠界、藍新等）合作後再導入。");
});
