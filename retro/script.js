// Shadow DOM Implementation
function createShadowComponent() {
    const host = document.getElementById('shadow-host');
    
    // Clear existing content
    host.innerHTML = '';
    
    // Create shadow root
    const shadowRoot = host.attachShadow({ mode: 'open' });
    
    // Create encapsulated styles
    const style = document.createElement('style');
    style.textContent = `
        .shadow-component {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .shadow-title {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            font-weight: 600;
        }
        
        .shadow-content {
            font-size: 1rem;
            line-height: 1.6;
            margin-bottom: 1.5rem;
        }
        
        .shadow-button {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 2px solid rgba(255, 255, 255, 0.3);
            padding: 10px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 0.9rem;
            font-weight: 600;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        }
        
        .shadow-button:hover {
            background: rgba(255, 255, 255, 0.3);
            border-color: rgba(255, 255, 255, 0.5);
            transform: translateY(-2px);
        }
        
        .shadow-counter {
            font-size: 2rem;
            font-weight: bold;
            margin: 1rem 0;
            color: #ffd700;
        }
    `;
    
    // Create component HTML
    const componentHTML = `
        <div class="shadow-component">
            <div class="shadow-title">Shadow DOM Component</div>
            <div class="shadow-content">
                This component is encapsulated within Shadow DOM. 
                Its styles are isolated and won't be affected by external CSS.
            </div>
            <div class="shadow-counter" id="counter">0</div>
            <button class="shadow-button" onclick="incrementCounter()">Increment Counter</button>
        </div>
    `;
    
    // Add styles and HTML to shadow root
    shadowRoot.appendChild(style);
    shadowRoot.innerHTML += componentHTML;
}

// Counter function for shadow DOM component
function incrementCounter() {
    const shadowHost = document.getElementById('shadow-host');
    const shadowRoot = shadowHost.shadowRoot;
    const counter = shadowRoot.getElementById('counter');
    const currentValue = parseInt(counter.textContent);
    counter.textContent = currentValue + 1;
}

// Canvas Implementation
let canvas, ctx, isDrawing = false, animationId;

function initCanvas() {
    canvas = document.getElementById('drawing-canvas');
    ctx = canvas.getContext('2d');
    
    // Set canvas background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Drawing event listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
}

function startDrawing(e) {
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
}

function draw(e) {
    if (!isDrawing) return;
    
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = `hsl(${Math.random() * 360}, 70%, 50%)`;
    
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
}

function stopDrawing() {
    isDrawing = false;
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawRandomShapes() {
    const shapes = ['circle', 'rectangle', 'triangle', 'star'];
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
    
    for (let i = 0; i < 5; i++) {
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const x = Math.random() * (canvas.width - 100);
        const y = Math.random() * (canvas.height - 100);
        const size = Math.random() * 50 + 20;
        
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        
        switch (shape) {
            case 'circle':
                ctx.beginPath();
                ctx.arc(x + size/2, y + size/2, size/2, 0, 2 * Math.PI);
                ctx.fill();
                break;
            case 'rectangle':
                ctx.fillRect(x, y, size, size);
                break;
            case 'triangle':
                ctx.beginPath();
                ctx.moveTo(x + size/2, y);
                ctx.lineTo(x, y + size);
                ctx.lineTo(x + size, y + size);
                ctx.closePath();
                ctx.fill();
                break;
            case 'star':
                drawStar(x + size/2, y + size/2, 5, size/2, size/4, color);
                break;
        }
    }
}

function drawStar(x, y, points, outerRadius, innerRadius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    const angle = Math.PI / points;
    
    for (let i = 0; i < 2 * points; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const currentAngle = i * angle;
        const px = x + Math.cos(currentAngle) * radius;
        const py = y + Math.sin(currentAngle) * radius;
        
        if (i === 0) {
            ctx.moveTo(px, py);
        } else {
            ctx.lineTo(px, py);
        }
    }
    ctx.closePath();
    ctx.fill();
}

function startAnimation() {
    if (animationId) return;
    
    let angle = 0;
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw animated circles
        for (let i = 0; i < 3; i++) {
            const x = canvas.width/2 + Math.cos(angle + i * Math.PI/3) * 100;
            const y = canvas.height/2 + Math.sin(angle + i * Math.PI/3) * 100;
            const radius = 20 + Math.sin(angle * 2 + i) * 10;
            
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.fillStyle = `hsl(${(angle * 50 + i * 120) % 360}, 70%, 50%)`;
            ctx.fill();
        }
        
        angle += 0.05;
        animationId = requestAnimationFrame(animate);
    }
    
    animate();
}

function stopAnimation() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
}

// Animations Implementation
function triggerAnimations() {
    const animationBoxes = document.querySelectorAll('.bounce-box, .rotate-box, .pulse-box, .slide-box');
    
    animationBoxes.forEach((box, index) => {
        // Reset animation
        box.style.animation = 'none';
        box.offsetHeight; // Trigger reflow
        
        // Restart animation with delay
        setTimeout(() => {
            if (box.classList.contains('bounce-box')) {
                box.style.animation = 'bounce 2s infinite';
            } else if (box.classList.contains('rotate-box')) {
                box.style.animation = 'rotate 3s linear infinite';
            } else if (box.classList.contains('pulse-box')) {
                box.style.animation = 'pulse 2s ease-in-out infinite';
            } else if (box.classList.contains('slide-box')) {
                box.style.animation = 'slide 3s ease-in-out infinite';
            }
        }, index * 200);
    });
}

// Lazy Loading Implementation (Optimized for Performance)
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('.lazy-image');
    
    // Aggressive preloading: Start loading images 500px before they enter viewport
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const placeholder = img.nextElementSibling;
                
                // Start loading immediately
                loadImage(img, observer);
            }
        });
    }, {
        rootMargin: '500px 0px', // Increased from 50px to 500px for aggressive preloading
        threshold: 0.01 // Start as soon as image is near viewport
    });
    
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
    
    // Preload first few images immediately for better perceived performance
    const firstImages = Array.from(lazyImages).slice(0, 2);
    firstImages.forEach(img => {
        loadImage(img, imageObserver);
    });
}

// Separate function for loading images with better error handling
function loadImage(img, observer) {
    if (img.dataset.loaded === 'true') return; // Prevent duplicate loading
    
    img.dataset.loaded = 'true';
    
    // Use native loading="lazy" as fallback and decode for better performance
    const newImg = new Image();
    
    newImg.onload = () => {
        // Use image decode API for smoother rendering
        if ('decode' in newImg) {
            newImg.decode()
                .then(() => {
                    img.src = newImg.src;
                    img.classList.add('loaded');
                })
                .catch(() => {
                    img.src = newImg.src;
                    img.classList.add('loaded');
                });
        } else {
            img.src = newImg.src;
            img.classList.add('loaded');
        }
    };
    
    newImg.onerror = () => {
        img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjhmOWZhIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjY2IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiPkltYWdlIG5vdCBmb3VuZDwvdGV4dD4KPC9zdmc+';
        img.classList.add('loaded');
    };
    
    // Set loading priority hint for better browser optimization
    newImg.loading = 'eager';
    newImg.src = img.dataset.src;
    
    if (observer) {
        observer.unobserve(img);
    }
}

// Utility function to add fade-in animation to sections
function addFadeInAnimation() {
    const sections = document.querySelectorAll('.section');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1
    });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initCanvas();
    initLazyLoading();
    addFadeInAnimation();
    
    // Add some initial content to shadow DOM section
    createShadowComponent();
    
    console.log('Modern Web Technologies Demo initialized!');
    console.log('Features available:');
    console.log('- Shadow DOM: Click "Create Shadow Component"');
    console.log('- Canvas: Draw with mouse, use control buttons');
    console.log('- Base64 Images: Already embedded in the page');
    console.log('- Animations: Click "Trigger All Animations"');
    console.log('- Lazy Loading: Scroll down to see images load');
});

// Add some keyboard shortcuts for better UX
document.addEventListener('keydown', function(e) {
    if (e.key === 'c' && e.ctrlKey) {
        e.preventDefault();
        clearCanvas();
    } else if (e.key === 'a' && e.ctrlKey) {
        e.preventDefault();
        drawRandomShapes();
    } else if (e.key === 's' && e.ctrlKey) {
        e.preventDefault();
        if (animationId) {
            stopAnimation();
        } else {
            startAnimation();
        }
    }
});

// Add touch support for mobile devices
if ('ontouchstart' in window) {
    const canvas = document.getElementById('drawing-canvas');
    
    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    });
    
    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    });
    
    canvas.addEventListener('touchend', function(e) {
        e.preventDefault();
        const mouseEvent = new MouseEvent('mouseup', {});
        canvas.dispatchEvent(mouseEvent);
    });
}
