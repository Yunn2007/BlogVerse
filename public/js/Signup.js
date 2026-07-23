async function passwordCheck(event) {

    event.preventDefault();

    const fullname = document.getElementById("fullname").value;
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;

    const password = document.getElementById("pass").value;
    const confirmPassword = document.getElementById("confirmPass").value;

    const errorMessage = document.getElementById("errorMessage");

    if (
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[@_*&]/.test(password)
    ) {

        if (password !== confirmPassword) {

            errorMessage.textContent = "Passwords do not match!";
            errorMessage.style.color = "red";

            return false;

        }

        const response = await fetch("/signup", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                fullname,
                username,
                email,
                password

            })

        });

        const message = await response.text();

        alert(message);

        if (message === "Signup Successful") {

            window.location.href = "/login";

        }

        return false;

    }

    else {

        errorMessage.textContent =
        "Password must contain 8 characters, one uppercase, one lowercase, one number and one special character (@ _ * &).";

        errorMessage.style.color = "red";

        return false;

    }

}