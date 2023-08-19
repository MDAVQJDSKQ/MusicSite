window.addEventListener('DOMContentLoaded', function() {
    // Check if the user is logged in
    if (sessionStorage.getItem('logged-in') !== 'true') {
        // If not logged in, hide the content and inform the user
        document.getElementById('user-content').style.display = 'none';
        alert('You must be logged in to view this content.');
        return;
    }

    const username = sessionStorage.getItem('user');
    const pageUsername = window.location.pathname.split('/')[2].replace('.html', '');

    // If they're not on their own page, remove contenteditable attribute
    if (username !== pageUsername) {
        document.getElementById('user-content').removeAttribute('contenteditable');
    }
});