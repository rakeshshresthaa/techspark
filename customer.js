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
});

// Utility to render products in a grid
function displayProducts(containerId, products) {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (!products || products.length === 0) {
        container.innerHTML = '<div class="no-products">No products available.</div>';
        return;
    }
    container.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.photoData || product.image || 'https://via.placeholder.com/400x300?text=No+Image'}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
            <div class="product-title">${product.name}</div>
            <div class="product-price">Rs.${product.price}</div>
            <div class="product-desc">${product.description || ''}</div>
            <div class="product-category">${product.category || ''}</div>
            <div class="product-actions">
                <button class="pay-btn">Buy Now</button>
                <button class="cart-btn">Add to cart</button>
                <button class="rating-btn">Rate Product</button>
            </div>
        </div>
    `).join('');

    // Show purchase count for each product
    const purchases = JSON.parse(localStorage.getItem('purchases') || '{}');
    container.querySelectorAll('.product-card').forEach(card => {
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

    // Attach event listeners to new product cards
    container.querySelectorAll('.product-card').forEach(card => {
        const payBtn = card.querySelector('.pay-btn');
        const cartBtn = card.querySelector('.cart-btn');
        const ratingBtn = card.querySelector('.rating-btn');
        if (payBtn) {
            payBtn.addEventListener('click', function() {
                payNow(card);
            });
        }
        if (cartBtn) {
            cartBtn.addEventListener('click', function() {
                addToCart(card);
            });
        }
        if (ratingBtn) {
            ratingBtn.addEventListener('click', function() {
                openRatingModal(card);
            });
        }
    });
}

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

// Redirect to payment page with product info
function payNow(productCard) {
    if (!auth || !auth.isLoggedIn()) {
        window.location.href = 'index.html';
        return;
    }
    const title = productCard.querySelector('.product-title').textContent;
    const price = productCard.querySelector('.product-price').textContent;
    const img = productCard.querySelector('img').src;
    // Open payment page with product info as query params
    const params = new URLSearchParams({ title, price, img }).toString();
    window.location.href = `payment.html?${params}`;
}

// Rating modal logic
let currentRating = 0;
let currentProduct = null;

function openRatingModal(productCard) {
    currentProduct = productCard;
    document.getElementById('ratingModal').style.display = 'flex';
    resetRating();
    // Set product name in modal
    document.getElementById('ratingProductName').textContent = productCard.querySelector('.product-title').textContent;
}

function closeRatingModal() {
    document.getElementById('ratingModal').style.display = 'none';
    currentProduct = null;
    currentRating = 0;
}

function resetRating() {
    currentRating = 0;
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => star.textContent = '☆');
    document.querySelector('.rating-text').textContent = 'Click on a star to rate';
    document.getElementById('reviewComment').value = '';
}

// Star rating functionality
window.addEventListener('DOMContentLoaded', function() {
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.dataset.rating);
            setRating(rating);
        });
        star.addEventListener('mouseenter', function() {
            const rating = parseInt(this.dataset.rating);
            highlightStars(rating);
        });
    });
    const starContainer = document.querySelector('.star-rating');
    if (starContainer) {
        starContainer.addEventListener('mouseleave', function() {
            highlightStars(currentRating);
        });
    }
});

function setRating(rating) {
    currentRating = rating;
    highlightStars(rating);
    const ratingTexts = [
        'Click on a star to rate',
        'Poor',
        'Fair',
        'Good',
        'Very Good',
        'Excellent'
    ];
    document.querySelector('.rating-text').textContent = ratingTexts[rating];
}

function highlightStars(rating) {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.textContent = '★';
            star.style.color = '#ffd700';
        } else {
            star.textContent = '☆';
            star.style.color = '#ccc';
        }
    });
}

function submitRating() {
    if (currentRating === 0) {
        alert('Please select a rating before submitting.');
        return;
    }
    const currentUser = auth.getCurrentUser();
    if (!currentUser) {
        alert('Please log in to submit a rating.');
        return;
    }
    const productName = currentProduct.querySelector('.product-title').textContent;
    const ratingData = {
        id: Date.now().toString(),
        productName: productName,
        customerId: currentUser.id,
        customerName: currentUser.name || currentUser.email,
        rating: currentRating,
        comment: document.getElementById('reviewComment').value,
        date: new Date().toISOString()
    };
    // Save rating to localStorage
    const ratings = JSON.parse(localStorage.getItem('ratings') || '[]');
    ratings.push(ratingData);
    localStorage.setItem('ratings', JSON.stringify(ratings));
    alert('Thank you for your rating!');
    closeRatingModal();
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('ratingModal');
    if (event.target === modal) {
        closeRatingModal();
    }
} 