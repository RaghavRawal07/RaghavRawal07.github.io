// Page content
const pages = {
    home: `
        <div class="page">
            <h1>Welcome to Our SPA</h1>
            <p>This is a modern Single Page Application with smooth transitions.</p>
        </div>
    `,
    about: `
        <div class="page">
            <h1>About Us</h1>
            <p>We are a team dedicated to creating amazing web experiences.</p>
        </div>
    `,
    contact: `
        <div class="page">
            <h1>Contact Us</h1>
            <p>Get in touch with us at: example@email.com</p>
        </div>
    `
};

// Handle navigation
function navigateTo(page) {
    const content = document.getElementById('content');
    content.innerHTML = pages[page];
    history.pushState({}, '', `#${page}`);
}

// Handle initial load and hash changes
function handleRoute() {
    const hash = window.location.hash.slice(1) || 'home';
    navigateTo(hash);
}

// Event listeners
window.addEventListener('load', handleRoute);
window.addEventListener('hashchange', handleRoute);

// Add click event listeners to navigation links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = e.target.getAttribute('href').slice(1);
        navigateTo(page);
    });
}); 
