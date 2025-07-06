const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxB09d-3eqsTXjKa6EmZQGQvVfWk0F_nZ3q5wl3O0TkhIfFSeQSWeDkVt0fkiEZVatY/exec"
// Load navbar and footer
fetch("/navbar/navbar.html")
    .then((response) => response.text())
    .then((data) => {
        document.getElementById("navbar-container").innerHTML = data

        // Mobile menu toggle - moved inside navbar fetch callback
        document
            .querySelector(".mobile-toggle")
            .addEventListener("click", function () {
                document.querySelector(".nav-menu").classList.toggle("active")
                this.classList.toggle("active")
            })

        // Add event listeners for dropdown menus on mobile
        const dropdowns = document.querySelectorAll(".dropdown")
        dropdowns.forEach((dropdown) => {
            dropdown.addEventListener("click", function (e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault()
                    this.classList.toggle("show-dropdown")
                }
            })
        })
    })

fetch("/footer/footer.html")
    .then((response) => response.text())
    .then((data) => {
        document.getElementById("footer-container").innerHTML = data
    })

// Year selector functionality
const yearButtons = document.querySelectorAll(".year-button")
yearButtons.forEach((button) => {
    button.addEventListener("click", function () {
        yearButtons.forEach((btn) => btn.classList.remove("active"))
        this.classList.add("active")
        // Here you would typically add logic to switch the displayed team members
    })
})

// Contact form submission
document.addEventListener("DOMContentLoaded", function () {
    const submitButton = document.querySelector(".send-message-btn")
    const form = document.querySelector(".contact-form")

    if (submitButton) {
        submitButton.addEventListener("click", function (e) {
            e.preventDefault()
            submitContactForm()
        })
    }
})

function submitContactForm() {
    // Get form data
    const firstName = document.getElementById("firstName").value.trim()
    const lastName = document.getElementById("lastName").value.trim()
    const email = document.getElementById("email").value.trim()
    const phone = document.getElementById("phone").value.trim()
    const message = document.getElementById("message").value.trim()

    // Basic validation
    if (!firstName || !lastName || !email || !message) {
        showMessage(
            "Please fill in all required fields (First Name, Last Name, Email, and Message)",
            "error"
        )
        return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        showMessage("Please enter a valid email address", "error")
        return
    }

    // Prepare data
    const formData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        message: message,
    }

    // Show loading state
    const submitButton = document.querySelector(".send-message-btn")
    const originalText = submitButton.textContent
    submitButton.textContent = "Sending..."
    submitButton.disabled = true

    // Submit to Google Sheets using form data approach to avoid CORS
    const form = document.createElement("form")
    form.method = "POST"
    form.action = GOOGLE_SCRIPT_URL
    form.target = "hidden_iframe"

    // Create hidden form fields
    Object.keys(formData).forEach((key) => {
        const input = document.createElement("input")
        input.type = "hidden"
        input.name = key
        input.value = formData[key]
        form.appendChild(input)
    })

    // Create hidden iframe to handle response
    let iframe = document.getElementById("hidden_iframe")
    if (!iframe) {
        iframe = document.createElement("iframe")
        iframe.id = "hidden_iframe"
        iframe.name = "hidden_iframe"
        iframe.style.display = "none"
        document.body.appendChild(iframe)
    }

    // Handle response
    iframe.onload = function () {
        showMessage(
            "Thank you! Your message has been sent successfully.",
            "success"
        )
        clearForm()
        // Reset button
        submitButton.textContent = originalText
        submitButton.disabled = false
    }

    // Submit form
    document.body.appendChild(form)
    form.submit()
    document.body.removeChild(form)

    // Fallback timeout in case iframe doesn't load
    setTimeout(() => {
        if (submitButton.disabled) {
            submitButton.textContent = originalText
            submitButton.disabled = false
        }
    }, 10000).finally(() => {
        // Reset button
        submitButton.textContent = originalText
        submitButton.disabled = false
    })
}

function showMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector(".form-message")
    if (existingMessage) {
        existingMessage.remove()
    }

    // Create new message element
    const messageDiv = document.createElement("div")
    messageDiv.className = `form-message ${type}`
    messageDiv.textContent = message

    // Insert message before the submit button
    const submitButton = document.querySelector(".send-message-btn")
    submitButton.parentNode.insertBefore(messageDiv, submitButton)

    // Auto-remove message after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove()
        }
    }, 5000)
}

function clearForm() {
    document.getElementById("firstName").value = ""
    document.getElementById("lastName").value = ""
    document.getElementById("email").value = ""
    document.getElementById("phone").value = ""
    document.getElementById("message").value = ""
}
