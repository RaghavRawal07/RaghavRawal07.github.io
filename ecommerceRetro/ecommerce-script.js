// Ecommerce Website JavaScript
// Global variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [];
let currentFilter = 'all';
let isLoading = false;

// Product data - In a real application, this would come from an API
const productData = [
    {
        id: 1,
        title: "Premium Wireless Headphones",
        category: "electronics",
        description: "High-quality wireless headphones with noise cancellation and premium sound quality.",
        price: 299.99,
        originalPrice: 399.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
        rating: 4.8,
        reviews: 124,
        badge: "featured",
        inStock: true
    },
    {
        id: 2,
        title: "Smart Fitness Watch",
        category: "electronics",
        description: "Advanced fitness tracking with heart rate monitor, GPS, and smartphone connectivity.",
        price: 249.99,
        originalPrice: 299.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
        rating: 4.6,
        reviews: 89,
        badge: "sale",
        inStock: true
    },
    {
        id: 3,
        title: "Designer Sunglasses",
        category: "fashion",
        description: "Stylish designer sunglasses with UV protection and premium frame materials.",
        price: 189.99,
        originalPrice: 249.99,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
        rating: 4.7,
        reviews: 156,
        badge: "new",
        inStock: true
    },
    {
        id: 4,
        title: "Premium Sneakers",
        category: "fashion",
        description: "Comfortable and stylish sneakers perfect for everyday wear and light activities.",
        price: 159.99,
        originalPrice: 199.99,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
        rating: 4.5,
        reviews: 203,
        badge: "sale",
        inStock: true
    },
    {
        id: 5,
        title: "Modern Table Lamp",
        category: "home",
        description: "Elegant modern table lamp with adjustable brightness and sleek minimalist design.",
        price: 89.99,
        originalPrice: 119.99,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop",
        rating: 4.4,
        reviews: 67,
        badge: "featured",
        inStock: true
    },
    {
        id: 6,
        title: "Yoga Mat Pro",
        category: "sports",
        description: "Professional-grade yoga mat with superior grip and cushioning for all yoga practices.",
        price: 79.99,
        originalPrice: 99.99,
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
        rating: 4.9,
        reviews: 312,
        badge: "new",
        inStock: true
    },
    {
        id: 7,
        title: "Wireless Bluetooth Speaker",
        category: "electronics",
        description: "Portable Bluetooth speaker with 360-degree sound and waterproof design.",
        price: 129.99,
        originalPrice: 159.99,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
        rating: 4.6,
        reviews: 178,
        badge: "sale",
        inStock: true
    },
    {
        id: 8,
        title: "Leather Crossbody Bag",
        category: "fashion",
        description: "Genuine leather crossbody bag with multiple compartments and adjustable strap.",
        price: 199.99,
        originalPrice: 249.99,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
        rating: 4.7,
        reviews: 94,
        badge: "featured",
        inStock: true
    },
    {
        id: 9,
        title: "Smart Home Hub",
        category: "electronics",
        description: "Central hub for controlling all your smart home devices with voice commands.",
        price: 149.99,
        originalPrice: 199.99,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
        rating: 4.5,
        reviews: 145,
        badge: "new",
        inStock: true
    },
    {
        id: 10,
        title: "Ceramic Coffee Mug Set",
        category: "home",
        description: "Set of 4 premium ceramic coffee mugs with ergonomic handles and heat retention.",
        price: 49.99,
        originalPrice: 69.99,
        image: "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=400&h=400&fit=crop",
        rating: 4.3,
        reviews: 87,
        badge: "sale",
        inStock: true
    },
    {
        id: 11,
        title: "Resistance Band Set",
        category: "sports",
        description: "Complete resistance band set with multiple resistance levels and door anchor.",
        price: 39.99,
        originalPrice: 59.99,
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        rating: 4.6,
        reviews: 234,
        badge: "featured",
        inStock: true
    },
    {
        id: 12,
        title: "Minimalist Wall Clock",
        category: "home",
        description: "Sleek minimalist wall clock with silent movement and modern aesthetic.",
        price: 69.99,
        originalPrice: 89.99,
        image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400&h=400&fit=crop",
        rating: 4.4,
        reviews: 76,
        badge: "new",
        inStock: true
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    products = [...productData];
    initializeApp();
});

function initializeApp() {
    renderProducts();
    updateCartUI();
    initializeEventListeners();
    initializeNavigation();
    
    console.log('EliteStore initialized successfully!');
    
    // Add some welcome animations
    setTimeout(() => {
        document.querySelectorAll('.hero-text, .hero-image').forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            setTimeout(() => {
                el.style.transition = 'all 0.8s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }, 100);
}

function initializeEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', () => handleSearch());
    }
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            handleFilter(e.target.dataset.filter);
        });
    });
    
    // Category cards
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const category = e.currentTarget.dataset.category;
            handleFilter(category);
            scrollToProducts();
        });
    });
    
    // Newsletter subscription
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            subscribeNewsletter();
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Close modals on outside click
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closeProductModal();
            closeCheckoutModal();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeProductModal();
            closeCheckoutModal();
            if (document.getElementById('cart-sidebar').classList.contains('open')) {
                toggleCart();
            }
        }
    });
}

function initializeNavigation() {
    // Navbar scroll effect
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
        
        // Hide/show navbar on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Update active navigation link
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Product rendering functions
function renderProducts(productsToRender = products) {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    if (productsToRender.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search" style="font-size: 3rem; color: #ddd; margin-bottom: 1rem;"></i>
                <h3>No products found</h3>
                <p>Try adjusting your search or filter criteria</p>
            </div>
        `;
        return;
    }
    
    productsGrid.innerHTML = productsToRender.map(product => createProductCard(product)).join('');
    
    // Add intersection observer for animation
    const productCards = document.querySelectorAll('.product-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    productCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

function createProductCard(product) {
    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    const stars = generateStars(product.rating);
    
    return `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}" loading="lazy">
                ${product.badge ? `<span class="product-badge ${product.badge}">${product.badge}</span>` : ''}
                <div class="product-actions">
                    <button class="action-btn" onclick="addToWishlist(${product.id})" title="Add to Wishlist">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="action-btn" onclick="quickView(${product.id})" title="Quick View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn" onclick="shareProduct(${product.id})" title="Share">
                        <i class="fas fa-share"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title">${product.title}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-rating">
                    <div class="stars">${stars}</div>
                    <span class="rating-count">(${product.reviews})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">$${product.price}</span>
                    ${product.originalPrice > product.price ? 
                        `<span class="original-price">$${product.originalPrice}</span>
                         <span class="discount">-${discount}%</span>` : ''
                    }
                </div>
                <button class="add-to-cart" onclick="addToCart(${product.id})" ${!product.inStock ? 'disabled' : ''}>
                    <i class="fas fa-shopping-cart"></i>
                    ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
            </div>
        </div>
    `;
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt star"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star star empty"></i>';
    }
    
    return stars;
}

// Search and filter functions
function handleSearch() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value.toLowerCase().trim();
    
    if (query === '') {
        renderProducts(products);
        return;
    }
    
    const filteredProducts = products.filter(product => 
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );
    
    renderProducts(filteredProducts);
    showToast(`Found ${filteredProducts.length} products`, 'info');
}

function handleFilter(filter) {
    currentFilter = filter;
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });
    
    // Filter products
    let filteredProducts = products;
    if (filter !== 'all') {
        filteredProducts = products.filter(product => product.category === filter);
    }
    
    renderProducts(filteredProducts);
    
    // Animate filter change
    const productsGrid = document.getElementById('products-grid');
    productsGrid.style.opacity = '0.5';
    setTimeout(() => {
        productsGrid.style.opacity = '1';
    }, 300);
}

// Cart functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || !product.inStock) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCartUI();
    saveCartToStorage();
    showToast('Product added to cart!', 'success');
    
    // Add visual feedback
    const button = event.target;
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i> Added!';
    button.style.background = '#2ed573';
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = '';
    }, 2000);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    saveCartToStorage();
    showToast('Product removed from cart', 'info');
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    updateCartUI();
    saveCartToStorage();
}

function updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTotal = document.getElementById('cart-total');
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    // Update cart items
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Your cart is empty</h3>
                    <p>Add some products to get started!</p>
                </div>
            `;
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.title}">
                    </div>
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">$${item.price}</div>
                        <div class="quantity-controls">
                            <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        </div>
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('');
        }
    }
    
    // Update totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartSubtotal) cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (cartTotal) cartTotal.textContent = `$${subtotal.toFixed(2)}`;
    
    // Update checkout modal totals
    const checkoutSubtotal = document.getElementById('checkout-subtotal');
    const checkoutTotal = document.getElementById('checkout-total');
    if (checkoutSubtotal) checkoutSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (checkoutTotal) checkoutTotal.textContent = `$${subtotal.toFixed(2)}`;
}

function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    cartSidebar.classList.toggle('open');
    
    if (cartSidebar.classList.contains('open')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Product modal functions
function quickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('product-modal');
    const modalContent = document.getElementById('modal-content');
    
    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    const stars = generateStars(product.rating);
    
    modalContent.innerHTML = `
        <div class="modal-product">
            <div class="modal-image">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="modal-info">
                <div class="modal-category">${product.category}</div>
                <h2>${product.title}</h2>
                <div class="product-rating">
                    <div class="stars">${stars}</div>
                    <span class="rating-count">(${product.reviews} reviews)</span>
                </div>
                <p class="modal-description">${product.description}</p>
                <div class="modal-price">
                    <span class="current-price">$${product.price}</span>
                    ${product.originalPrice > product.price ? 
                        `<span class="original-price">$${product.originalPrice}</span>
                         <span class="discount">-${discount}%</span>` : ''
                    }
                </div>
                <div class="product-features">
                    <h4>Features:</h4>
                    <ul>
                        <li>Premium quality materials</li>
                        <li>1-year warranty included</li>
                        <li>Free shipping on orders over $50</li>
                        <li>30-day return policy</li>
                    </ul>
                </div>
                <button class="add-to-cart" onclick="addToCart(${product.id}); closeProductModal();" ${!product.inStock ? 'disabled' : ''}>
                    <i class="fas fa-shopping-cart"></i>
                    ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
            </div>
        </div>
    `;
    
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    modal.classList.remove('open');
    document.body.style.overflow = '';
}

// Checkout functions
function proceedToCheckout() {
    if (cart.length === 0) {
        showToast('Your cart is empty!', 'error');
        return;
    }
    
    const modal = document.getElementById('checkout-modal');
    const checkoutItems = document.getElementById('checkout-items');
    
    // Populate checkout items
    checkoutItems.innerHTML = cart.map(item => `
        <div class="summary-item">
            <span>${item.title} (${item.quantity}x)</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
    
    modal.classList.add('open');
    toggleCart(); // Close cart sidebar
    document.body.style.overflow = 'hidden';
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    modal.classList.remove('open');
    document.body.style.overflow = '';
}

function processCheckout(event) {
    event.preventDefault();
    
    // Show loading
    showLoading();
    
    // Simulate payment processing
    setTimeout(() => {
        hideLoading();
        
        // Clear cart
        cart = [];
        updateCartUI();
        saveCartToStorage();
        
        // Close modal
        closeCheckoutModal();
        
        // Show success message
        showToast('Order placed successfully! You will receive a confirmation email shortly.', 'success');
        
        // Reset form
        document.getElementById('checkout-form').reset();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
    }, 3000);
}

// Utility functions
function addToWishlist(productId) {
    // In a real app, this would save to user's wishlist
    showToast('Added to wishlist!', 'success');
}

function shareProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    if (navigator.share) {
        navigator.share({
            title: product.title,
            text: product.description,
            url: window.location.href
        });
    } else {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href);
        showToast('Product link copied to clipboard!', 'info');
    }
}

function subscribeNewsletter() {
    const email = document.getElementById('newsletter-email');
    if (!email || !email.value) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate API call
    showLoading();
    setTimeout(() => {
        hideLoading();
        showToast('Successfully subscribed to newsletter!', 'success');
        email.value = '';
    }, 1500);
}

function loadMoreProducts() {
    // In a real app, this would load more products from API
    showToast('All products loaded!', 'info');
}

// Scroll functions
function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function scrollToCategories() {
    const categoriesSection = document.getElementById('categories');
    if (categoriesSection) {
        categoriesSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// UI utility functions
function showLoading() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.classList.add('show');
    }
}

function hideLoading() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.classList.remove('show');
    }
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastIcon = toast.querySelector('.toast-icon');
    const toastMessage = toast.querySelector('.toast-message');
    
    // Set icon based on type
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle'
    };
    
    toastIcon.className = `toast-icon ${icons[type] || icons.info}`;
    toastMessage.textContent = message;
    toast.className = `toast ${type}`;
    
    // Show toast
    toast.classList.add('show');
    
    // Hide after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Animation helpers
function animateValue(element, start, end, duration) {
    if (!element) return;
    
    const range = end - start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        element.textContent = current;
        if (current === end) {
            clearInterval(timer);
        }
    }, stepTime);
}

// Initialize smooth animations for counters when they come into view
function initializeCounterAnimations() {
    const counters = document.querySelectorAll('[data-counter]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.counter);
                animateValue(counter, 0, target, 2000);
                observer.unobserve(counter);
            }
        });
    });
    
    counters.forEach(counter => observer.observe(counter));
}

// Performance optimization: Lazy load images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.3s ease';
                    
                    img.onload = () => {
                        img.style.opacity = '1';
                    };
                    
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Initialize additional features when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeCounterAnimations();
    initializeLazyLoading();
    
    // Add some subtle parallax effect to hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.hero-image');
        if (parallax) {
            parallax.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
    });
});

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export functions for global access
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.toggleCart = toggleCart;
window.quickView = quickView;
window.closeProductModal = closeProductModal;
window.proceedToCheckout = proceedToCheckout;
window.closeCheckoutModal = closeCheckoutModal;
window.processCheckout = processCheckout;
window.addToWishlist = addToWishlist;
window.shareProduct = shareProduct;
window.subscribeNewsletter = subscribeNewsletter;
window.loadMoreProducts = loadMoreProducts;
window.scrollToProducts = scrollToProducts;
window.scrollToCategories = scrollToCategories;
