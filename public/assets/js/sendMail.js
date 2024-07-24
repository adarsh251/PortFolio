document
  .getElementById("contactForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;
    console.log("test");
    try {
      const response = await fetch("/send-mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });
      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error sending your message. Please try again later.");
    }
  });
