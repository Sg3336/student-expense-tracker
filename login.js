function login() {
    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();

    if (!user || !pass) {
        alert("Please enter User ID and Password");
        return;
    }

    // Save logged-in user
    localStorage.setItem("loggedInUser", user);

    // Initialize user-specific expense storage if not exists
    const key = `expenses_${user}`;
    if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify([]));
    }

    window.location.href = "index.html";
}
