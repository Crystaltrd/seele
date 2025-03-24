function eyeIcon() {
    const icon = document.getElementById("pass-icon");
    const passwordInput = document.getElementById("password");
    
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.src = "../MULTIMEDIA/visible.png";
    } else {
        passwordInput.type = "password";
        icon.src = "../MULTIMEDIA/hidden.png";
    }
}