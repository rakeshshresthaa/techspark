// --- Admin Panel Logic (Minimal, Clean) ---

// --- Authentication Check ---
const user = JSON.parse(localStorage.getItem("loggedInUser"));
if (!user || user.role !== "admin") {
    window.location.href = "index.html";
}

// --- Utility Functions ---
function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}
function setUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}
function getProducts() {
    return JSON.parse(localStorage.getItem("products")) || [];
}
function setProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
}

// --- Tab Switching ---
const tabBtns = document.querySelectorAll('.tab-btn');
const tabSections = document.querySelectorAll('.tab-section');
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabSections.forEach(s => s.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
    });
});

// --- Render Functions ---
function renderPendingSellers() {
    const users = getUsers();
    const pending = users.filter(u => u.role === 'seller' && !u.approved);
    const tbody = document.getElementById('pending-sellers-body');
    tbody.innerHTML = '';
    pending.forEach(seller => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${seller.email}</td>
            <td>
                <button class="approve-btn">Approve</button>
                <button class="delete-btn">Reject</button>
            </td>
        `;
        tr.querySelector('.approve-btn').onclick = () => approveSeller(seller.email);
        tr.querySelector('.delete-btn').onclick = () => deleteSeller(seller.email);
        tbody.appendChild(tr);
    });
    document.getElementById('pending-sellers-count').textContent = `(${pending.length})`;
}

function renderPendingProducts() {
    const products = getProducts();
    const users = getUsers();
    const pending = products.filter(p => !p.approved);
    const tbody = document.getElementById('pending-products-body');
    tbody.innerHTML = '';
    pending.forEach(product => {
        const seller = users.find(u => u.email === product.sellerEmail);
        tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${product.name}</td>
            <td>${product.sellerEmail}${seller && !seller.approved ? ' (Pending Seller)' : ''}</td>
            <td>
                <button class="approve-btn">Approve</button>
                <button class="delete-btn">Delete</button>
            </td>
        `;
        tr.querySelector('.approve-btn').onclick = () => approveProduct(product.id);
        tr.querySelector('.delete-btn').onclick = () => deleteProduct(product.id);
        tbody.appendChild(tr);
    });
    document.getElementById('pending-products-count').textContent = `(${pending.length})`;
}

function renderPublishedProducts() {
    const products = getProducts();
    const users = getUsers();
    const published = products.filter(p => p.approved);
    const tbody = document.getElementById('published-products-body');
    tbody.innerHTML = '';
    published.forEach(product => {
        const seller = users.find(u => u.email === product.sellerEmail);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${product.name}</td>
            <td>${product.sellerEmail}${seller && !seller.approved ? ' (Pending Seller)' : ''}</td>
            <td><button class="delete-btn">Remove</button></td>
        `;
        tr.querySelector('.delete-btn').onclick = () => deleteProduct(product.id);
        tbody.appendChild(tr);
    });
    document.getElementById('published-products-count').textContent = `(${published.length})`;
}

function renderSellerList() {
    const users = getUsers();
    const sellers = users.filter(u => u.role === 'seller' && u.approved);
    const tbody = document.getElementById('seller-list-body');
    tbody.innerHTML = '';
    sellers.forEach(seller => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${seller.email}</td>
            <td><button class="delete-btn">Remove</button></td>
        `;
        tr.querySelector('.delete-btn').onclick = () => deleteSellerAndProducts(seller.email);
        tbody.appendChild(tr);
    });
    document.getElementById('seller-list-count').textContent = `(${sellers.length})`;
}

// --- Action Handlers ---
function approveSeller(email) {
    const users = getUsers();
    const idx = users.findIndex(u => u.email === email);
    if (idx !== -1) {
        users[idx].approved = true;
        setUsers(users);
        renderAll();
    }
}
function deleteSeller(email) {
    let users = getUsers();
    users = users.filter(u => u.email !== email);
    setUsers(users);
    // Also delete their products
    let products = getProducts();
    products = products.filter(p => p.sellerEmail !== email);
    setProducts(products);
    renderAll();
}
function deleteSellerAndProducts(email) {
    if (confirm('Remove this seller and all their products?')) {
        deleteSeller(email);
    }
}
function approveProduct(id) {
    const products = getProducts();
    const idx = products.findIndex(p => p.id === id);
    if (idx !== -1) {
        products[idx].approved = true;
        setProducts(products);
        renderAll();
    }
}
function deleteProduct(id) {
    if (confirm('Delete this product?')) {
        let products = getProducts();
        products = products.filter(p => p.id !== id);
        setProducts(products);
        renderAll();
    }
}

// --- Render All Sections ---
function renderAll() {
    renderPendingSellers();
    renderPendingProducts();
    renderPublishedProducts();
    renderSellerList();
}

document.addEventListener('DOMContentLoaded', renderAll);

// --- Logout Function ---
function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'index.html';
} 