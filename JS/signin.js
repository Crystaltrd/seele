particlesJS("particles-js", {
    particles: {
        number: {value: 80, density: {enable: true, value_area: 800}},
        color: {value: "#ffffff"},
        shape: {
            type: "circle",
            stroke: {width: 0, color: "#000000"},
            polygon: {nb_sides: 5},
            image: {src: "img/github.svg", width: 100, height: 100}

        },
        opacity: {
            value: 0.5,
            random: false,
            anim: {enable: false, speed: 1, opacity_min: 0.1, sync: false}
        },
        size: {
            value: 3,
            random: true,
            anim: {enable: false, speed: 40, size_min: 0.1, sync: false}
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 6,
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: {enable: false, rotateX: 600, rotateY: 1200}
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: {enable: true, mode: "repulse"},
            onclick: {enable: true, mode: "push"},
            resize: true
        },
        modes: {
            grab: {distance: 400, line_linked: {opacity: 1}},
            bubble: {distance: 400, size: 40, duration: 2, opacity: 8, speed: 3},
            repulse: {distance: 200, duration: 0.4},
            push: {particles_nb: 4},
            remove: {particles_nb: 2}
        }
    },
    retina_detect: true
});
var count_particles, stats, update;
stats = new Stats();
stats.setMode(0);
stats.domElement.style.position = "absolute";
stats.domElement.style.left = "0px";
stats.domElement.style.top = "0px";
document.body.appendChild(stats.domElement);
count_particles = document.querySelector(".js-count-particles");
update = function () {
    stats.begin();
    stats.end();
    if (window.pJSDom[0].pJS.particles && window.pJSDom[0].pJS.particles.array) {
        count_particles.innerText = window.pJSDom[0].pJS.particles.array.length;
    }
    requestAnimationFrame(update);
};
requestAnimationFrame(update);


function eyeIcon(inputId, iconElement) {

    let passwordInput = document.getElementById(inputId);

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        iconElement.src = "../MULTIMEDIA/visible.png";
    } else {
        passwordInput.type = "password";
        iconElement.src = "../MULTIMEDIA/hidden.png";
    }
}

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

document.querySelector("form").addEventListener("submit", function (e) {
    if (!validate() || !confirm()) {
        e.preventDefault();
    }
})

/*function handlePlaceholder(inputId, placeholderText) {
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
});*/