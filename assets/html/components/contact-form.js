
function formDOM() {

}

document
    .getElementById("contactForm")
    .addEventListener("submit", function (event) {
        event.preventDefault(); // Evitar el envío del formulario

        // Limpiar mensajes de error anteriores
        document
            .querySelectorAll(".error-message")
            .forEach((span) => (span.textContent = ""));
            // console.log('validate');
        // Validación de campos
        let valid = true;
        if (!document.getElementById("name").value) {
            document.getElementById("nameError").textContent =
                "El nombre completo es obligatorio.";
            valid = false;
        }
        if (!document.getElementById("email").value) {
            document.getElementById("emailError").textContent =
                "El correo electrónico es obligatorio.";
            valid = false;
        } else if (!document.getElementById("email").validity.valid) {
            alert('error correo');
            document.getElementById("emailError").textContent =
                "Por favor, ingrese un correo electrónico válido.";
            valid = false;
        }
        if (!document.getElementById("phone").value) {
            document.getElementById("phoneError").textContent =
                "El número de celular es obligatorio.";
            valid = false;
        } else if (!document.getElementById("phone").validity.valid) {
            document.getElementById("phoneError").textContent =
                "Por favor, ingrese un número de celular válido.";
            valid = false;
        }
        if (!document.getElementById("comments").value) {
            document.getElementById("commentsError").textContent =
                "Los comentarios son obligatorios.";
            valid = false;
        }

        if (valid) {
            // Enviar datos al servidor
            fetch("http://localhost:3000", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: document.getElementById("name").value,
                    email: document.getElementById("email").value,
                    phone: document.getElementById("phone").value,
                    comments: document.getElementById("comments").value,
                }),
            })
                .then((response) => {
                    if (response.ok) {
                        alert("El formulario ha sido enviado correctamente.");
                        document.getElementById("contactForm").reset();
                    } else {
                        alert(
                            "Hubo un problema al enviar el formulario. Inténtalo de nuevo más tarde."
                        );
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                    alert(
                        "Hubo un problema al enviar el formulario. Inténtalo de nuevo más tarde."
                    );
                });
        }
    });


document.addEventListener('DOMContentLoaded', formDOM);
