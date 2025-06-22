document.addEventListener('DOMContentLoaded', () => {
  // Contact form submission
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for contacting me!');
      form.reset();
    });
  }

  // Navigation active highlight
  const links = document.querySelectorAll("nav a");

  window.addEventListener("scroll", () => {
    let current = "";
    document.querySelectorAll("section").forEach((section) => {
      const sectionTop = section.offsetTop;
      if (pageYOffset >= sectionTop - 60) {
        current = section.getAttribute("id");
      }
    });

    links.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === #${current}) {
        link.classList.add("active");
      }
    });
  });
});
