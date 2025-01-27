document.addEventListener("DOMContentLoaded", () => {
    loadNavbarLogo();
});

async function loadNavbarLogo() {
    const logoElement = document.querySelector(".header__logo");
    const logoFilename = "logo_aeis.png"; // Nombre del archivo de la imagen

    try {
        const response = await fetch(`http://localhost:3000/bucket/static/${logoFilename}`, {
            method: "GET",
        });

        if (!response.ok) {
            console.error(`Error al obtener la URL firmada del logo: ${response.statusText}`);
            return;
        }

        const data = await response.json();
        const logoUrl = data.url;
        console.log(logoUrl);
        if (logoElement) {
            console.log("Si hay logo")
            logoElement.style.backgroundImage = `url('${logoUrl}')`;
            logoElement.style.backgroundSize = "cover";
            logoElement.style.backgroundPosition = "center";
        }
    } catch (error) {
        console.error("Error al cargar el logo del navbar:", error);
        alert("No se pudo cargar el logo del sistema.");
    }
}

window.redirectToIndex = function() {
    window.location.href = "index.html"; // Ajusta según la estructura del proyecto
};
