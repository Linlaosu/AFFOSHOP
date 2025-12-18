// app.js

const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartPanel = document.getElementById("cartPanel");
const backdrop = document.getElementById("backdrop");
const cartItemsEl = document.getElementById("cartItems");
const cartCountEl = document.getElementById("cartCount");
const cartTotalEl = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");
const productGrid = document.getElementById("productGrid"); // 抓取商品列表容器

let cart = [];

// --- 購物車開關邏輯 ---
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

// --- 金額格式化 ---
function formatCurrency(amount) {
  return "NT$ " + amount.toLocaleString("zh-TW");
}

// --- 渲染購物車內容 ---
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

// --- 加入購物車邏輯 (改為通用函式) ---
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

// --- 讀取並顯示商品 (核心新功能) ---
async function loadProducts() {
  // 如果找不到容器就不執行，避免錯誤
  if (!productGrid) return;

  try {
    // 讀取 products.json 檔案
    const response = await fetch('products.json');
    if (!response.ok) throw new Error("找不到 products.json");
    
    const products = await response.json();
    
    productGrid.innerHTML = ''; // 清空原本的載入中文字

    products.forEach(product => {
      // 建立商品卡片 HTML
      const card = document.createElement('article');
      card.className = 'product-card';
      // 雖然資料在 JS 裡，但為了保險還是寫入 dataset
      card.dataset.id = product.id; 
      card.dataset.name = product.name;
      card.dataset.price = product.price;

      card.innerHTML = `
        <div class="product-img">
          <img src="${product.image}" alt="${product.name}" style="width:100%; height:100%; object-fit:cover; border-radius:12px;">
        </div>
        <h3>${product.name}</h3>
        <p class="product-brand">${product.brand}</p>
        <p class="product-price">NT$ ${Number(product.price).toLocaleString()}</p>
        ${product.tag ? `<p class="product-tag">${product.tag}</p>` : ''}
        <button class="btn-outline add-to-cart-btn">加入購物車</button>
      `;

      // 直接幫這顆按鈕綁定事件 (這樣就不怕動態生成抓不到了)
      const btn = card.querySelector('.add-to-cart-btn');
      btn.addEventListener('click', () => {
        addToCart(product.id, product.name, Number(product.price));
      });

      productGrid.appendChild(card);
    });

  } catch (error) {
    console.error('無法讀取商品資料:', error);
    productGrid.innerHTML = '<p style="grid-column: 1/-1; text-align:center;">目前無法載入商品，請稍後再試。</p>';
  }
}

// --- 購物車內刪除按鈕監聽 ---
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

// --- 網頁載入後，開始抓商品資料 ---
window.addEventListener('DOMContentLoaded', loadProducts);
