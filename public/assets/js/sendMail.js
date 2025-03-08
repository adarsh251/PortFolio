async function verifyHuman(event, callback) {
  event.preventDefault();

  const recaptchaResponse = document.querySelector(".g-recaptcha-response").value;
  if (!recaptchaResponse) {
    alert("Please complete the reCAPTCHA");
    return;
  }
  //console.log(recaptchaResponse);
  try {
    console.log(recaptchaResponse);
    const response = await fetch("/verify-recaptcha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "g-recaptcha-response": recaptchaResponse }),
    });

    const result = await response.json();
    console.log(result);
    if (!result.success) {
      alert("reCAPTCHA verification failed");
      return;
    }

    callback(); // If verification succeeds, send the mail
  } catch (error) {
    console.error("reCAPTCHA Error:", error);
    alert("Failed to verify reCAPTCHA. Please try again.");
  }
}

async function sendMail(event) {
  event.preventDefault();
  
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  console.log("Sending message...");

  try {
    const response = await fetch("/send-mail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });

    const result = await response.json();
    alert(result.message);
  } catch (error) {
    console.error("Error:", error);
    alert("There was an error sending your message. Please try again later.");
  }
}

document.getElementById("contactForm").addEventListener("submit", function (event) {
  verifyHuman(event, () => sendMail(event));
});
