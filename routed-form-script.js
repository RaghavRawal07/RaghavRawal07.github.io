// Multipage Form with URL Routing JavaScript
class RoutedMultipageForm {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.formData = {};
        
        // DOM elements
        this.form = document.getElementById('multipageForm');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.submitBtn = document.getElementById('submitBtn');
        this.progressFill = document.getElementById('progressFill');
        this.formTitle = document.getElementById('formTitle');
        this.formDescription = document.getElementById('formDescription');
        this.successMessage = document.getElementById('successMessage');
        
        // Step content
        this.stepContent = {
            1: {
                title: "Personal Information",
                description: "Please fill in your basic personal details to continue."
            },
            2: {
                title: "Address Details",
                description: "Let us know where you're located."
            },
            3: {
                title: "Preferences & Interests",
                description: "Tell us about your preferences and interests."
            },
            4: {
                title: "Review & Submit",
                description: "Please review your information before submitting."
            }
        };
        
        // Validation rules
        this.validationRules = {
            firstName: { required: true, minLength: 2, pattern: /^[a-zA-Z\s]+$/ },
            lastName: { required: true, minLength: 2, pattern: /^[a-zA-Z\s]+$/ },
            email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
            phone: { required: true, pattern: /^[\+]?[1-9][\d]{0,15}$/ },
            street: { required: true, minLength: 5 },
            city: { required: true, minLength: 2, pattern: /^[a-zA-Z\s]+$/ },
            state: { required: true },
            zipCode: { required: true, pattern: /^[0-9]{5}(-[0-9]{4})?$/ },
            country: { required: true },
            communication: { required: true }
        };
        
        this.init();
    }
    
    init() {
        this.setupURLRouting();
        this.loadSavedData();
        this.bindEvents();
        this.initializeFromURL();
        this.setupAutoSave();
    }
    
    setupURLRouting() {
        // Listen for browser back/forward button
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.step) {
                this.navigateToStep(e.state.step, false);
            } else {
                this.navigateToStep(1, false);
            }
        });
        
        // Set initial state
        const urlParams = new URLSearchParams(window.location.search);
        const pageParam = urlParams.get('page');
        const initialStep = pageParam ? parseInt(pageParam) : 1;
        
        if (initialStep >= 1 && initialStep <= this.totalSteps) {
            this.currentStep = initialStep;
        }
        
        // Push initial state
        this.updateURL(this.currentStep, true);
    }
    
    initializeFromURL() {
        this.updateUI();
        this.showStep(this.currentStep);
        
        // Update review section if we're on the last step
        if (this.currentStep === this.totalSteps) {
            this.updateReviewSection();
        }
    }
    
    updateURL(step, replace = false) {
        const url = new URL(window.location);
        url.searchParams.set('page', step.toString());
        
        const state = { step: step };
        const title = `Step ${step} - ${this.stepContent[step].title}`;
        
        if (replace) {
            history.replaceState(state, title, url.toString());
        } else {
            history.pushState(state, title, url.toString());
        }
        
        // Update page title
        document.title = `${title} - Multipage Form with URL Routing`;
    }
    
    navigateToStep(step, updateURL = true) {
        if (step < 1 || step > this.totalSteps) return;
        
        this.currentStep = step;
        
        if (updateURL) {
            this.updateURL(step);
        }
        
        this.updateUI();
        this.showStep(step);
        
        // Update review section if we're on the last step
        if (step === this.totalSteps) {
            this.updateReviewSection();
        }
    }
    
    bindEvents() {
        // Navigation buttons
        this.prevBtn.addEventListener('click', () => this.previousStep());
        this.nextBtn.addEventListener('click', () => this.nextStep());
        this.submitBtn.addEventListener('click', (e) => this.submitForm(e));
        
        // Form input events
        this.form.addEventListener('input', (e) => this.handleInput(e));
        this.form.addEventListener('change', (e) => this.handleInput(e));
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Prevent form submission on enter
        this.form.addEventListener('submit', (e) => e.preventDefault());
        
        // Step indicator clicks
        document.querySelectorAll('.step').forEach(step => {
            step.addEventListener('click', () => {
                const stepNumber = parseInt(step.dataset.step);
                if (stepNumber <= this.currentStep || this.canNavigateToStep(stepNumber)) {
                    this.navigateToStep(stepNumber);
                }
            });
        });
    }
    
    canNavigateToStep(targetStep) {
        // Allow navigation to previous steps or next step if current step is valid
        if (targetStep <= this.currentStep) return true;
        if (targetStep === this.currentStep + 1) {
            return this.validateCurrentStep();
        }
        return false;
    }
    
    handleInput(e) {
        const field = e.target;
        
        // Clear previous error
        this.clearFieldError(field);
        
        // Real-time validation for some fields
        if (['email', 'phone'].includes(field.name)) {
            setTimeout(() => this.validateField(field), 500);
        }
        
        // Save data
        this.saveFieldData(field);
    }
    
    handleKeyboard(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    if (this.currentStep > 1) this.previousStep();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    if (this.currentStep < this.totalSteps) this.nextStep();
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (this.currentStep < this.totalSteps) {
                        this.nextStep();
                    } else {
                        this.submitForm(e);
                    }
                    break;
            }
        }
    }
    
    nextStep() {
        if (this.validateCurrentStep()) {
            if (this.currentStep < this.totalSteps) {
                this.navigateToStep(this.currentStep + 1);
            }
        }
    }
    
    previousStep() {
        if (this.currentStep > 1) {
            this.navigateToStep(this.currentStep - 1);
        }
    }
    
    showStep(step) {
        // Hide all steps
        const steps = document.querySelectorAll('.form-step');
        steps.forEach(s => s.classList.remove('active'));
        
        // Show current step
        const currentStepEl = document.querySelector(`[data-step="${step}"]`);
        if (currentStepEl) {
            currentStepEl.classList.add('active');
        }
        
        // Focus first input in the step
        setTimeout(() => {
            const firstInput = currentStepEl.querySelector('input, select, textarea');
            if (firstInput && !firstInput.disabled) {
                firstInput.focus();
            }
        }, 300);
    }
    
    updateUI() {
        // Update progress bar
        const progress = (this.currentStep / this.totalSteps) * 100;
        this.progressFill.style.width = `${progress}%`;
        
        // Update step indicators
        const stepIndicators = document.querySelectorAll('.step');
        stepIndicators.forEach((indicator, index) => {
            const stepNumber = index + 1;
            indicator.classList.remove('active', 'completed');
            
            if (stepNumber === this.currentStep) {
                indicator.classList.add('active');
            } else if (stepNumber < this.currentStep) {
                indicator.classList.add('completed');
            }
            
            // Add clickable cursor for accessible steps
            if (stepNumber <= this.currentStep || this.canNavigateToStep(stepNumber)) {
                indicator.style.cursor = 'pointer';
                indicator.title = `Go to ${this.stepContent[stepNumber].title}`;
            } else {
                indicator.style.cursor = 'default';
                indicator.title = 'Complete previous steps first';
            }
        });
        
        // Update title and description
        const stepInfo = this.stepContent[this.currentStep];
        this.formTitle.textContent = stepInfo.title;
        this.formDescription.textContent = stepInfo.description;
        
        // Update navigation buttons
        this.prevBtn.disabled = this.currentStep === 1;
        
        if (this.currentStep === this.totalSteps) {
            this.nextBtn.style.display = 'none';
            this.submitBtn.style.display = 'inline-block';
        } else {
            this.nextBtn.style.display = 'inline-block';
            this.submitBtn.style.display = 'none';
        }
        
        // Add animation class to form container
        const formContainer = document.querySelector('.form-container');
        formContainer.classList.add('step-transition');
        setTimeout(() => formContainer.classList.remove('step-transition'), 400);
    }
    
    validateCurrentStep() {
        const currentStepEl = document.querySelector(`[data-step="${this.currentStep}"]`);
        const inputs = currentStepEl.querySelectorAll('input, select, textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        // Special validation for step 3 (at least one interest should be selected)
        if (this.currentStep === 3) {
            const interests = currentStepEl.querySelectorAll('input[name="interests"]:checked');
            if (interests.length === 0) {
                this.showFieldError(
                    currentStepEl.querySelector('input[name="interests"]'),
                    'Please select at least one interest'
                );
                isValid = false;
            }
        }
        
        // Special validation for step 4 (terms must be accepted)
        if (this.currentStep === 4) {
            const termsCheckbox = document.getElementById('termsAccepted');
            if (!termsCheckbox.checked) {
                this.showFieldError(termsCheckbox, 'You must accept the terms and conditions');
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    validateField(field) {
        const rules = this.validationRules[field.name];
        if (!rules) return true;
        
        const value = field.value.trim();
        
        // Required field validation
        if (rules.required && !value) {
            this.showFieldError(field, `${this.getFieldLabel(field)} is required`);
            return false;
        }
        
        // Skip other validations if field is empty and not required
        if (!value && !rules.required) {
            this.clearFieldError(field);
            return true;
        }
        
        // Minimum length validation
        if (rules.minLength && value.length < rules.minLength) {
            this.showFieldError(field, `${this.getFieldLabel(field)} must be at least ${rules.minLength} characters`);
            return false;
        }
        
        // Pattern validation
        if (rules.pattern && !rules.pattern.test(value)) {
            let message = `${this.getFieldLabel(field)} format is invalid`;
            
            // Custom messages for specific fields
            if (field.name === 'email') {
                message = 'Please enter a valid email address';
            } else if (field.name === 'phone') {
                message = 'Please enter a valid phone number';
            } else if (field.name === 'zipCode') {
                message = 'Please enter a valid ZIP code';
            }
            
            this.showFieldError(field, message);
            return false;
        }
        
        this.clearFieldError(field);
        return true;
    }
    
    showFieldError(field, message) {
        field.classList.add('error');
        const errorSpan = field.parentNode.querySelector('.error-message');
        if (errorSpan) {
            errorSpan.textContent = message;
        }
        
        // Scroll to field if it's not visible
        if (!this.isElementInViewport(field)) {
            field.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    clearFieldError(field) {
        field.classList.remove('error');
        const errorSpan = field.parentNode.querySelector('.error-message');
        if (errorSpan) {
            errorSpan.textContent = '';
        }
    }
    
    getFieldLabel(field) {
        const label = field.parentNode.querySelector('label');
        return label ? label.textContent.replace('*', '').trim() : field.name;
    }
    
    isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    saveFieldData(field) {
        if (field.type === 'checkbox') {
            if (field.name === 'interests') {
                // Handle multiple checkboxes for interests
                const checkedInterests = Array.from(
                    document.querySelectorAll('input[name="interests"]:checked')
                ).map(cb => cb.value);
                this.formData.interests = checkedInterests;
            } else {
                this.formData[field.name] = field.checked;
            }
        } else if (field.type === 'radio') {
            if (field.checked) {
                this.formData[field.name] = field.value;
            }
        } else {
            this.formData[field.name] = field.value;
        }
        
        // Save to localStorage
        localStorage.setItem('routedMultipageFormData', JSON.stringify(this.formData));
    }
    
    loadSavedData() {
        const savedData = localStorage.getItem('routedMultipageFormData');
        if (savedData) {
            this.formData = JSON.parse(savedData);
            
            // Populate form fields
            Object.keys(this.formData).forEach(key => {
                const field = document.querySelector(`[name="${key}"]`);
                if (field) {
                    if (field.type === 'checkbox') {
                        if (key === 'interests' && Array.isArray(this.formData[key])) {
                            this.formData[key].forEach(interest => {
                                const checkbox = document.querySelector(`input[name="interests"][value="${interest}"]`);
                                if (checkbox) checkbox.checked = true;
                            });
                        } else {
                            field.checked = this.formData[key];
                        }
                    } else if (field.type === 'radio') {
                        const radioButton = document.querySelector(`input[name="${key}"][value="${this.formData[key]}"]`);
                        if (radioButton) radioButton.checked = true;
                    } else {
                        field.value = this.formData[key];
                    }
                }
            });
        }
    }
    
    setupAutoSave() {
        // Auto-save every 30 seconds
        setInterval(() => {
            const formData = new FormData(this.form);
            const currentData = {};
            
            for (let [key, value] of formData.entries()) {
                currentData[key] = value;
            }
            
            // Handle checkboxes separately
            const interests = Array.from(document.querySelectorAll('input[name="interests"]:checked'))
                .map(cb => cb.value);
            if (interests.length > 0) {
                currentData.interests = interests;
            }
            
            this.formData = { ...this.formData, ...currentData };
            localStorage.setItem('routedMultipageFormData', JSON.stringify(this.formData));
        }, 30000);
    }
    
    updateReviewSection() {
        // Personal Information
        document.getElementById('reviewName').textContent = 
            `${this.formData.firstName || ''} ${this.formData.lastName || ''}`.trim() || 'Not provided';
        document.getElementById('reviewEmail').textContent = this.formData.email || 'Not provided';
        document.getElementById('reviewPhone').textContent = this.formData.phone || 'Not provided';
        document.getElementById('reviewBirthDate').textContent = 
            this.formData.birthDate ? new Date(this.formData.birthDate).toLocaleDateString() : 'Not provided';
        
        // Address Details
        const addressParts = [
            this.formData.street,
            this.formData.city,
            this.formData.state,
            this.formData.zipCode,
            this.formData.country
        ].filter(part => part);
        document.getElementById('reviewAddress').textContent = 
            addressParts.length > 0 ? addressParts.join(', ') : 'Not provided';
        
        // Preferences
        document.getElementById('reviewInterests').textContent = 
            (this.formData.interests && this.formData.interests.length > 0) 
                ? this.formData.interests.join(', ') 
                : 'None selected';
        document.getElementById('reviewCommunication').textContent = 
            this.formData.communication || 'Not selected';
        document.getElementById('reviewNewsletter').textContent = 
            this.formData.newsletter ? 'Yes' : 'No';
        document.getElementById('reviewComments').textContent = 
            this.formData.comments || 'None';
    }
    
    async submitForm(e) {
        e.preventDefault();
        
        if (!this.validateCurrentStep()) {
            return;
        }
        
        // Show loading state
        this.submitBtn.classList.add('loading');
        this.submitBtn.disabled = true;
        
        try {
            // Simulate API call
            await this.simulateSubmission();
            
            // Show success message
            this.showSuccessMessage();
            
            // Clear saved data
            localStorage.removeItem('routedMultipageFormData');
            
            // Update URL to success state
            const url = new URL(window.location);
            url.searchParams.set('page', 'success');
            history.pushState({ step: 'success' }, 'Registration Successful', url.toString());
            
        } catch (error) {
            console.error('Submission error:', error);
            alert('There was an error submitting your form. Please try again.');
        } finally {
            this.submitBtn.classList.remove('loading');
            this.submitBtn.disabled = false;
        }
    }
    
    async simulateSubmission() {
        // Simulate network delay
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form submitted successfully!', this.formData);
                resolve();
            }, 2000);
        });
    }
    
    showSuccessMessage() {
        // Hide form
        this.form.parentNode.style.display = 'none';
        
        // Show success message
        this.successMessage.style.display = 'block';
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Update page title
        document.title = 'Registration Successful - Multipage Form with URL Routing';
    }
}

// Reset form function
function resetForm() {
    localStorage.removeItem('routedMultipageFormData');
    
    // Navigate to first step
    const url = new URL(window.location);
    url.searchParams.set('page', '1');
    window.location.href = url.toString();
}

// Initialize form when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const form = new RoutedMultipageForm();
    
    // Add some helpful console messages
    console.log('🚀 Routed Multipage Form initialized!');
    console.log('🔗 URL routing enabled - each step has its own URL');
    console.log('💡 Keyboard shortcuts:');
    console.log('   • Ctrl/Cmd + ← : Previous step');
    console.log('   • Ctrl/Cmd + → : Next step');
    console.log('   • Ctrl/Cmd + Enter : Next step / Submit');
    console.log('📱 Form data is automatically saved to localStorage');
    console.log('🔄 Browser back/forward buttons work with form navigation');
    console.log('👆 Click on step indicators to navigate directly');
    
    // Add visual feedback for form interactions
    document.addEventListener('focusin', function(e) {
        if (e.target.matches('input, select, textarea')) {
            e.target.parentNode.classList.add('focused');
        }
    });
    
    document.addEventListener('focusout', function(e) {
        if (e.target.matches('input, select, textarea')) {
            e.target.parentNode.classList.remove('focused');
        }
    });
});

// Add some CSS for focus states and step navigation
const style = document.createElement('style');
style.textContent = `
    .input-group.focused {
        transform: translateY(-2px);
        transition: transform 0.2s ease;
    }
    
    .form-container.step-transition {
        transform: scale(0.98);
        transition: transform 0.2s ease;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .input-group input.error,
    .input-group select.error {
        animation: shake 0.5s ease-in-out;
    }
    
    .step[style*="cursor: pointer"]:hover .step-number {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }
    
    .step[style*="cursor: pointer"]:hover .step-label {
        color: #667eea;
    }
    
    .step-indicators {
        user-select: none;
    }
`;
document.head.appendChild(style);
