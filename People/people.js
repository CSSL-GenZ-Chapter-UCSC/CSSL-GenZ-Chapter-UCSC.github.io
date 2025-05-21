// Mobile menu toggle
document.querySelector(".mobile-toggle").addEventListener("click", function () {
  document.querySelector(".nav-menu").classList.toggle("active");
  this.classList.toggle("active");
});

// Add event listeners for dropdown menus on mobile
const dropdowns = document.querySelectorAll(".dropdown");
dropdowns.forEach((dropdown) => {
  dropdown.addEventListener("click", function (e) {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      this.classList.toggle("show-dropdown");
    }
  });
});

// Year selector functionality
const yearButtons = document.querySelectorAll(".year-button");
yearButtons.forEach((button) => {
  button.addEventListener("click", function () {
    yearButtons.forEach((btn) => btn.classList.remove("active"));
    this.classList.add("active");
    // Here you would typically add logic to switch the displayed team members
  });
});

// Number counter animation
function animateCounter(elementId, targetValue, duration) {
  const element = document.getElementById(elementId);
  const startTime = performance.now();
  const startValue = parseInt(element.textContent, 10);

  function updateNumber(currentTime) {
    const elapsedTime = currentTime - startTime;
    if (elapsedTime < duration) {
      const progress = elapsedTime / duration;
      const currentValue = Math.floor(
        progress * (targetValue - startValue) + startValue
      );
      element.textContent = currentValue;
      requestAnimationFrame(updateNumber);
    } else {
      element.textContent = targetValue;
    }
  }

  requestAnimationFrame(updateNumber);
}

// Start animations when the page loads
window.addEventListener("load", () => {
  // Delay slightly to ensure everything is loaded and visible
  setTimeout(() => {
    animateCounter("totalMembers", 200, 2000);
    animateCounter("newMembers", 20, 2000);
    animateCounter("excomMembers", 10, 2000);
  }, 500);
});
