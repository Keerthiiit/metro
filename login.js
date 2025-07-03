let container = document.getElementById('container');

// Toggle between sign-in and sign-up forms
toggle = () => {
    container.classList.toggle('sign-in');
    container.classList.toggle('sign-up');
}

// Automatically show the sign-in form after a delay
setTimeout(() => {
    container.classList.add('sign-in');
}, 200);

// Username and password for validation
const validUsername = 'ananya';
const validPassword = '12345678';

// Add event listener for the sign-in button
document.querySelector('.form.sign-in button').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent form submission

    // Get the entered username and password
    const enteredUsername = document.getElementById('username').value;
    const enteredPassword = document.getElementById('password').value;

    // Validate the entered credentials
    if (enteredUsername === validUsername && enteredPassword === validPassword) {
        alert('Login successful!');
        window.location.href = "home.html"; // Redirect to home.html after successful login
    } else {
        alert('Invalid username or password. Please try again.');
    }
});

// Add event listener for the sign-up button
document.querySelector('.form.sign-up button').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent form submission

    // Here you can add form validation for sign-up fields (optional)
    // For simplicity, we're just redirecting the user to the home.html after sign-up
    window.location.href = "home.html"; // Redirect to home.html after successful sign-up
});
