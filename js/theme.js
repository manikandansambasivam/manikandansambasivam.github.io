const toggleButton = document.getElementById("theme-toggle");

if (toggleButton) {
    const toggleIcon = toggleButton.querySelector("img");

    const lightIcon = "assets/images/ld.svg";
    const darkIcon = "assets/images/ld.svg";

    function setTheme(theme) {
        document.body.classList.toggle("dark-mode", theme === "dark");

        if (toggleIcon) {
            toggleIcon.src = theme === "dark" ? darkIcon : lightIcon;
        }

        localStorage.setItem("theme", theme);
    }

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

        setTheme(prefersDark ? "dark" : "light");
    }

    toggleButton.addEventListener("click", () => {
        const isDark = document.body.classList.contains("dark-mode");
        setTheme(isDark ? "light" : "dark");
    });
}

/* ==========================================================================
   Active Page Highlighting Automation
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll("nav a");

    navLinks.forEach(link => {
        const href = link.getAttribute("href");
        
        // Handle matching for exact paths or matching file names (e.g., research.html)
        if (currentPath.endsWith(href) || 
           (href === "index.html" && (currentPath === "/" || currentPath.endsWith("/")))) {
            link.setAttribute("aria-current", "page");
        }
    });
});