document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Mock credentials for demonstration
    const users = {
        john: 'johnpass',
        jane: 'janepass'
        // ... add more users as needed
    };
    
    if (users[username] && users[username] === password) {
        // Mock 'logged-in' state using sessionStorage
        sessionStorage.setItem('logged-in', 'true');
        sessionStorage.setItem('user', username);
        window.location.href = `./user/${username}.html`;
    } else {
        alert('Invalid credentials');
    }
});
