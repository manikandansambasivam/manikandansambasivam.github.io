async function loadComponent(id, file) {
    const element = document.getElementById(id);

    if (!element) return;

    const response = await fetch(file);
    element.innerHTML = await response.text();
}

async function loadPageComponents() {
    await loadComponent("header", "components/header.html");
    await loadComponent("footer", "components/footer.html");

    const themeScript = document.createElement("script");
    themeScript.src = "js/theme.js";
    document.body.appendChild(themeScript);
}

loadPageComponents();