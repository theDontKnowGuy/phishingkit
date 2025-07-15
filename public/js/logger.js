// Logger utility for tracking user behavior
class TrainingLogger {
    constructor() {
        this.username = this.getUsername();
    }

    getUsername() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('user') || urlParams.get('username') || 'unknown';
    }

    async logEvent(page, action, additionalData = {}) {
        try {
            await fetch('/api/log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: this.username,
                    page,
                    action,
                    additionalData: {
                        url: window.location.href,
                        timestamp: new Date().toISOString(),
                        ...additionalData
                    }
                })
            });
        } catch (error) {
            console.error('Logging failed:', error);
        }
    }

    logPageView(page) {
        this.logEvent(page, 'page_view');
    }

    logButtonClick(page, buttonName) {
        this.logEvent(page, 'button_click', { buttonName });
    }

    logFormSubmit(page, formData = {}) {
        this.logEvent(page, 'form_submit', { formData });
    }

    logPasswordEntered(page) {
        this.logEvent(page, 'password_entered');
    }
}

// Global logger instance
window.trainingLogger = new TrainingLogger(); 