let cart = [];
let total = 0;
let metodeBayar = "";

/* ================= CART ================= */

function renderCart(){
  const cartItems = document.getElementById("cartItems");
  cartItems.innerHTML = "";

  cart.forEach(item => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `<span>${item.name}</span><span>Rp ${item.price}</span>`;
    cartItems.appendChild(div);
  });

  document.getElementById("totalPrice").innerText = "Total: Rp " + total;
}

function increaseQty(btn, name, price){
  const qty = btn.parentElement.querySelector(".qty-number");
  qty.innerText = parseInt(qty.innerText) + 1;

  cart.push({ name, price });
  total += price;
  renderCart();
}

function decreaseQty(btn){
  const qty = btn.parentElement.querySelector(".qty-number");
  let value = parseInt(qty.innerText);

  if(value > 0){
    qty.innerText = value - 1;
    const item = cart.pop();
    if(item) total -= item.price;
    renderCart();
  }
}

/* ================= CHECKOUT ================= */

function checkout(){
  if(cart.length === 0){
    alert("Keranjang masih kosong");
    return;
  }

  document.getElementById("payTotal").innerText = "Total Bayar: Rp " + total;
  document.getElementById("buyerName").value = "";
  document.getElementById("tableNumber").value = "";
  metodeBayar = "";
  document.getElementById("qrisBox").style.display = "none";

  document.getElementById("paymentPopup").style.display = "flex";
}

function tutupPopup(){
  document.getElementById("paymentPopup").style.display = "none";
}

/* ================= METODE BAYAR ================= */

function pilihMetode(metode){
  metodeBayar = metode;
  document.getElementById("qrisBox").style.display =
    metode === "qris" ? "block" : "none";
}

/* ================= KONFIRMASI ================= */

function konfirmasiBayar(){
  const nama = document.getElementById("buyerName").value.trim();
  const meja = document.getElementById("tableNumber").value.trim();
  const nomorWA = "6281210361866";

  if(nama === "" || meja === ""){
    alert("Nama dan nomor meja wajib diisi!");
    return;
  }

  if(metodeBayar === ""){
    alert("Pilih metode pembayaran!");
    return;
  }

  let pesan = `Halo 9Brothers 🌭%0A`;
  pesan += `Nama: ${nama}%0A`;
  pesan += `No Meja: ${meja}%0A`;
  pesan += `Metode: ${metodeBayar.toUpperCase()}%0A%0A`;
  pesan += `Pesanan:%0A`;

  cart.forEach(item => {
    pesan += `- ${item.name} Rp ${item.price}%0A`;
  });

  pesan += `%0ATotal: Rp ${total}`;

  window.open(
    `https://wa.me/${nomorWA}?text=${pesan}`,
    "_blank"
  );

  document.getElementById("paymentPopup").style.display = "none";
  document.getElementById("thankyouPage").style.display = "flex";

  // 🔥 generate invoice otomatis
  generateInvoice(nama, meja, metodeBayar);
}

/* ================= INVOICE ================= */

function generateInvoice(nama, meja, metode){
  const invNumber = "INV-" + Date.now();

  document.getElementById("invNumber").innerText = invNumber;
  document.getElementById("invName").innerText = nama;
  document.getElementById("invTable").innerText = meja;
  document.getElementById("invMethod").innerText = metode.toUpperCase();

  const invItems = document.getElementById("invItems");
  invItems.innerHTML = "";

  cart.forEach(item => {
    const p = document.createElement("p");
    p.innerText = `${item.name} - Rp ${item.price}`;
    invItems.appendChild(p);
  });

  document.getElementById("invTotal").innerText = "Total: Rp " + total;

  document.getElementById("invoicePage").style.display = "flex";
}

function printInvoice(){
  window.print();

  win.document.write(`
    <html>
    <head>
      <title>Invoice</title>
      <style>
        body{font-family:Arial;padding:20px;}
      </style>
    </head>
    <body>${content}</body>
    </html>
  `);

  win.document.close();
  win.print();
}

function tutupInvoice(){
  document.getElementById("invoicePage").style.display = "none";
}

/* ================= RESET & KEMBALI ================= */

function kembaliKeMenu(){
  document.getElementById("thankyouPage").style.display = "none";
  document.getElementById("invoicePage").style.display = "none";

  cart = [];
  total = 0;
  metodeBayar = "";

  document.querySelectorAll(".qty-number").forEach(q => q.innerText = 0);
  renderCart();

  // auto scroll ke menu (ANTI GAGAL)
  setTimeout(() => {
    const menu = document.getElementById("menu");
    if(menu){
      window.scrollTo({
        top: menu.offsetTop - 80,
        behavior: "smooth"
      });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, 100);
}
