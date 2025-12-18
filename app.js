// app.js

const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartPanel = document.getElementById("cartPanel");
const backdrop = document.getElementById("backdrop");
const cartItemsEl = document.getElementById("cartItems");
const cartCountEl = document.getElementById("cartCount");
const cartTotalEl = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");
const productGrid = document.getElementById("productGrid");

let cart = [];

// --- 購物車開關 ---
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

// --- 格式化金額 ---
function formatCurrency(amount) {
  return "NT$ " + Number(amount).toLocaleString("zh-TW");
}

// --- 渲染購物車 ---
function renderCart() {
  cartItemsEl.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;
    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML = `
      <div>
        <div style="font-weight:bold;">${item.name}</div>
        <small style="color:#666;">NT$ ${item.price.toLocaleString("zh-TW")} × ${item.qty}</small>
      </div>
      <button data-index="${index}" class="remove-btn" style="border:none; background:none; color:#999; cursor:pointer;">✕</button>
    `;
    cartItemsEl.appendChild(li);
  });

  cartTotalEl.textContent = formatCurrency(total);
  cartCountEl.textContent = cart.reduce((sum, i) => sum + i.qty, 0);
}

// --- 加入購物車 (通用函式) ---
function addToCart(id, name, price) {
  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price, qty: 1 });
  }
  renderCart();
  openCart();
}

// --- 讀取並顯示商品 (核心功能) ---
async function loadProducts() {
  if (!productGrid) return;

  try {
    const response = await fetch('products.json');
    if (!response.ok) throw new Error("找不到商品目錄檔");

    const products = await response.json();
    productGrid.innerHTML = ''; // 清空載入中文字

    products.forEach(product => {
      const card = document.createElement('article');
      card.className = 'product-card';
      
      card.innerHTML = `
        <div class="product-img">
          <img src="${product.image}" alt="${product.name}" onerror="this.src='https://placehold.co/400x400?text=No+Image'">
        </div>
        <h3>${product.name}</h3>
        <p class="product-brand">${product.brand}</p>
        <p class="product-price">NT$ ${Number(product.price).toLocaleString()}</p>
        ${product.tag ? `<p class="product-tag">${product.tag}</p>` : ''}
        <button class="btn-outline add-to-cart-btn">加入購物車</button>
      `;

      // 綁定按鈕事件
      const btn = card.querySelector('.add-to-cart-btn');
      btn.addEventListener('click', () => {
        addToCart(product.id, product.name, Number(product.price));
      });

      productGrid.appendChild(card);
    });

  } catch (error) {
    console.error(error);
    productGrid.innerHTML = '<p style="grid-column:1/-1; text-align:center;">目前無商品資料</p>';
  }
}

// --- 刪除購物車項目 ---
cartItemsEl.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-btn")) {
    const index = Number(e.target.dataset.index);
    cart.splice(index, 1);
    renderCart();
  }
});

checkoutBtn.addEventListener("click", () => {
  alert("這是範例網站，尚未串接金流。");
});

// --- 啟動 ---
window.addEventListener('DOMContentLoaded', loadProducts);
