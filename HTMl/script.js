// Automatically update the copyright year in the footer
document.addEventListener("DOMContentLoaded", () => {
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});

// The smooth scrolling logic is already handled by 'scroll-behavior: smooth;' in the CSS,
// eliminating the need for complex JavaScript event listeners.