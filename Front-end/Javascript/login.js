document.addEventListener("DOMContentLoaded", function () {
  const togglePassword = document.querySelector("#togglePassword");
  const password = document.querySelector("#password");
  const icon = togglePassword.querySelector("i");

  togglePassword.addEventListener("click", function () {
    // Inverte o tipo do input
    const type =
      password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);

    // Altera o ícone
    icon.classList.toggle("bi-eye");
    icon.classList.toggle("bi-eye-slash");
  });
});
