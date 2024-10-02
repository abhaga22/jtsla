function authenticateAdmin() {
    const password = "your_secure_password"; // Replace with your chosen password
    let attempts = 3;

    while (attempts > 0) {
        const input = prompt("Enter the admin password:");
        if (input === password) {
            return true;
        } else {
            attempts--;
            if (attempts > 0) {
                alert(`Incorrect password. ${attempts} attempts remaining.`);
            } else {
                alert("Access denied. Redirecting to home page.");
                window.location.href = "index.html";
                return false;
            }
        }
    }
}