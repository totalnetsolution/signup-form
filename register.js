if (document.querySelector('#signup-form')) {
    const signupForm = document.querySelector('#signup-form');

    signupForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const fullName = document.querySelector('#full-name').value;
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;

        let users = JSON.parse(localStorage.getItem('users')) || [];

        const existingUser = users.find(user => user.email === email);

        if (existingUser) {
            alert('User already registered');
        } else {
            users.push({ fullName, email, password });
            localStorage.setItem('users', JSON.stringify(users));
            alert('Registration successful');
            window.location.href = 'signin.html';
        }
    });
}

if (document.querySelector('#signin-form')) {
    const signinForm = document.querySelector('#signin-form');

    signinForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;

        let users = JSON.parse(localStorage.getItem('users')) || [];

        const user = users.find(user => user.email === email && user.password === password);

        if (user) {
            alert('Sign in successful');
            window.location.href = 'quiz.html';
        } else {
            alert('Invalid email or password');
        }
    });
}
