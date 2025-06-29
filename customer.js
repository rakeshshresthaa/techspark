// Customer-specific JS for logout, buy now, and add to cart

document.addEventListener('DOMContentLoaded', function() {
    // Show logout button if user is logged in
    const logoutBtn = document.getElementById('logoutBtn');
    if (auth && auth.isLoggedIn()) {
        logoutBtn.style.display = 'inline-block';
    }

    // Logout function
    logoutBtn && logoutBtn.addEventListener('click', function() {
        auth.logout();
    });

    // Add to Cart function
    function addToCart(productCard) {
        const title = productCard.querySelector('.product-title').textContent;
        const price = productCard.querySelector('.product-price').textContent;
        const img = productCard.querySelector('img').src;
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.push({ title, price, img });
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Added to cart!');
    }

    // Buy Now function
    function buyNow(productCard) {
        if (!auth || !auth.isLoggedIn()) {
            window.location.href = 'index.html';
            return;
        }
        const title = productCard.querySelector('.product-title').textContent;
        const price = productCard.querySelector('.product-price').textContent;
        // Open payment page in new tab with product info
        const params = new URLSearchParams({ title, price }).toString();
        window.open(`payment.html?${params}`, '_blank');
    }

    // Show purchase count for each product
    const purchases = JSON.parse(localStorage.getItem('purchases') || '{}');
    document.querySelectorAll('.product-card').forEach(card => {
        const title = card.querySelector('.product-title').textContent;
        const count = purchases[title] || 0;
        let badge = card.querySelector('.purchase-count');
        if (!badge) {
            badge = document.createElement('div');
            badge.className = 'purchase-count';
            card.querySelector('.product-title').after(badge);
        }
        badge.textContent = count > 0 ? `Purchased: ${count}` : '';
    });

    // Attach event listeners to all product cards
    document.querySelectorAll('.product-card').forEach(card => {
        const buyBtn = card.querySelector('.buy-btn');
        const cartBtn = card.querySelector('.cart-btn');
        if (buyBtn) {
            buyBtn.addEventListener('click', function() {
                buyNow(card);
            });
        }
        if (cartBtn) {
            cartBtn.addEventListener('click', function() {
                addToCart(card);
            });
        }
    });
}); 