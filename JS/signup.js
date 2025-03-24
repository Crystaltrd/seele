function validate() {
    var pass = document.getElementById("password");
    var errormessage = document.getElementById("password-error");

    if (pass.value.length < 8) {
        errormessage.style.display = "block";
        return false;
    } else {
        errormessage.style.display = "none";
        return true;
    }
}

function confirm() {
    var pass1 = document.getElementById("password");
    var pass2 = document.getElementById("confirm-password");
    var errorMessage = document.getElementById("confirm-error");

    if (pass1.value !== pass2.value) {
        errorMessage.style.display = "block";
        return false;
    } else {
        errorMessage.style.display = "none";
        return true;
    }
}

// Initialize form validation when the DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
    // Add event listener to form if it exists
    const form = document.querySelector("form");
    if (form) {
        form.addEventListener("submit", function (e) {
            if (!validate() || !confirm()) {
                e.preventDefault();
            }
        });
    }
});

/*
// Commented out placeholder handling code - kept for reference
function handlePlaceholder(inputId, placeholderText) {
    const input = document.getElementById(inputId);

    if (!input) {
        console.error("Input non trouvé :", inputId);
        return;
    }

    input.addEventListener("focus", function () {
        console.log("Focus sur :", inputId);
        if (this.value === "") {
            this.classList.add("dynamic-placeholder");
            this.setAttribute("placeholder", placeholderText);
        }
    });

    input.addEventListener("blur", function () {
        console.log("Blur sur :", inputId);
        if (this.value === "") {
            this.classList.remove("dynamic-placeholder");
            this.removeAttribute("placeholder");
        }
    });

    input.addEventListener("input", function () {
        console.log("Input sur :", inputId);
        if (this.value !== "") {
            this.classList.remove("dynamic-placeholder");
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM entièrement chargé !");
    handlePlaceholder("display-name", "exemple : Ali Khaled");
    handlePlaceholder("choose-identifier", "exemple : ali_khaled");
});
*/