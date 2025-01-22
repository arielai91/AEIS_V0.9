import { ImageUpdater } from "../content/Image.js";

// Crear archivo ingreso.js
document.addEventListener("DOMContentLoaded", function () {
  const togglePassword = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("password");
  const ingresoForm = document.getElementById("ingresoForm");
  const botonInicioElements = document.querySelectorAll(".boton_inicio");
  botonInicioElements.forEach((element) => {
    element.addEventListener("click", function () {
      window.location.href = "index.html";
    });
  });

  // Toggle password visibility
  togglePassword.addEventListener("click", function () {
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);

    // Change icon based on password visibility
    const path = togglePassword.querySelector("path:last-child");
    if (type === "password") {
      path.setAttribute(
        "d",
        "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
      );
    } else {
      path.setAttribute(
        "d",
        "M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
      );
    }
  });

  // Handle form submission
  ingresoForm.addEventListener("submit", function (e) {
    e.preventDefault();
    // Aquí iría la lógica de autenticación
    loginUser();
    console.log("Formulario enviado");
  });
});

const imageUpdater = new ImageUpdater(
  "https://codebyelaina.com/bucket/image/logo_aeis.png",
  ".logo_aeis"
);
imageUpdater.updateImage();

function obtainRol(field, credencial) {
  const rolData = {
    field: field,
    value: credencial,
  };

  fetch("https://codebyelaina.com/perfiles/rol", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rolData),
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        return res.json().then((data) => {
          throw new Error(data.message || "Error en la petición");
        });
      }
    })
    .then((data) => {
      console.log(data);
      if (data.rol === "Administrador") {
        window.location.href = `admin.html?cedula=${data.cedula}`;
      } else if (data.rol === "Cliente") {
        window.location.href = `usuario.html?cedula=${data.cedula}`;
      }
    })
    .catch((error) => {
      alert(error.message);
      console.error(error);
    });
}

function loginUser() {
  const credencial = document.getElementById("identifier").value;
  let field = "email";
  const esCorreoOCedula = (credencial) => {
    const regexCorreo = /^[a-zA-Z0-9._%+-]+@epn\.edu\.ec$/;
    const regexCedula = /^\d{10}$/;

    if (regexCorreo.test(credencial)) {
      return true;
    } else if (regexCedula.test(credencial)) {
      return false;
    } else {
      return null;
    }
  };

  const resultado = esCorreoOCedula(credencial);
  if (resultado === true) {
    field = "email";
  } else if (resultado === false) {
    field = "cedula";
  } else {
    document.querySelector(".unknown-info").textContent =
      "* Correo o cédula inválidos";
    document.querySelector(".login-info").style.display = "block";
    return; // Salir de la función si la credencial no es válida
  }

  const userData = {
    field: field,
    value: credencial,
    contraseña: document.getElementById("password").value,
  };

  fetch("https://codebyelaina.com/perfiles/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        return res.json().then((data) => {
          throw new Error(data.message || "Error en la petición");
        });
      }
    })
    .then((data) => {
      obtainRol(field, credencial);
    })
    .catch((error) => {
      document.querySelector(".unknown-info").textContent =
        "* " + error.message;
      document.querySelector(".login-info").style.display = "block";
    });
}
