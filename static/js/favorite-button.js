document.addEventListener('DOMContentLoaded', function() {
    // Retrieve CSRF token safely
    const csrfTokenElement = document.querySelector('meta[name="csrf-token"]');
    if (!csrfTokenElement) {
        console.error('CSRF token meta tag not found. Ensure <meta name="csrf-token" content="{% csrf_token %}"> is in <head>.');
        return;
    }
    const csrfToken = csrfTokenElement.content;

    // Use event delegation for dynamic buttons
    document.body.addEventListener('click', async function(e) {
        const button = e.target.closest('.favorite-btn');
        if (!button) return; // Not a favorite button

        e.preventDefault();
        const productId = button.dataset.productId;
        const isFavorited = button.dataset.favorited === 'true';

        // Store original state
        const originalHTML = button.innerHTML;
        const originalClasses = button.className;

        // Show loading state
        button.innerHTML = `
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
        `;
        button.disabled = true;

        try {
            const response = await fetch('/toggle-favorite/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `product_id=${productId}`
            });

            if (!response.ok) {
                throw new Error(`Network response not ok: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Server response:', data); // Debug: Log response

            // Update button appearance
            let updated = false;
            if (data.status === 'added') {
                button.dataset.favorited = 'true';
                button.className = 'favorite-btn w-full flex items-center justify-center py-2.5 rounded-lg font-medium transition-colors bg-red-50 text-red-600 hover:bg-red-100';
                button.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
                    </svg>
                    Remove Favorite
                `;
                updated = true;
            } else if (data.status === 'removed') {
                button.dataset.favorited = 'false';
                button.className = 'favorite-btn w-full flex items-center justify-center py-2.5 rounded-lg font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200';
                button.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Add Favorite
                `;
                updated = true;
            } else {
                throw new Error(`Invalid status: ${data.status}`);
            }

            // Force DOM repaint to ensure visual update
            button.style.display = 'none';
            button.offsetHeight; // Trigger reflow
            button.style.display = '';

            // Debug: Confirm updates
            console.log('Updated dataset.favorited:', button.dataset.favorited);
            console.log('Updated classes:', button.className);
            console.log('Updated innerHTML:', button.innerHTML);

            // Show notification
            showNotification(`Product ${data.status === 'added' ? 'added to' : 'removed from'} favorites`);

        } catch (error) {
            console.error('Error during favorite toggle:', error);
            showNotification('Failed to update favorites', 'error');
            // Restore original state
            button.innerHTML = originalHTML;
            button.className = originalClasses;
        } finally {
            button.disabled = false;
        }
    });

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 px-4 py-2 rounded-md shadow-lg text-white font-medium flex items-center ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`;
        notification.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            ${message}
        `;
        document.body.appendChild(notification);

        // Auto-remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
});