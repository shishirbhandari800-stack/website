document.addEventListener("DOMContentLoaded", function() {
    // Nav bar active link styling
    var currentPath = window.location.pathname.split("/").pop();
    if (currentPath === "") { currentPath = "index.html"; }
    var navAnchors = document.querySelectorAll(".nav-links a");
    navAnchors.forEach(function(anchor) {
        if (anchor.getAttribute("href") === currentPath) {
            anchor.classList.add("active-nav");
        }
    });

    // Hamburger Menu Logic
    var hamburger = document.getElementById("hamburger");
    var navLinks = document.querySelector(".nav-links");
    if (hamburger && navLinks) {
        hamburger.addEventListener("click", function() {
            navLinks.classList.toggle("active");
        });
    }

    // Accordion Logic for Service Directory
    var acc = document.getElementsByClassName("accordion");
    for (var i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            if (panel.style.display === "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
            }
        });
    }
    // Validation Helpers
    function clearError(inputId) {
        var errorElement = document.getElementById(inputId + "-error");
        if (errorElement) {
            errorElement.remove();
        }
    }

    function showError(inputId, message) {
        clearError(inputId);
        var inputElement = document.getElementById(inputId);
        if (inputElement) {
            var errorElement = document.createElement("span");
            errorElement.className = "error-message";
            errorElement.id = inputId + "-error";
            errorElement.innerText = message;
            inputElement.parentNode.appendChild(errorElement);
        }
    }

    // Booking Multi-step Form Logic
    var currentStep = 1;
    var totalSteps = 3;

    function showStep(step) {
        var steps = document.getElementsByClassName("booking-step");
        for (var i = 0; i < steps.length; i++) {
            steps[i].style.display = "none";
        }
        var confirmationBlock = document.getElementById("booking-confirmation");
        if (confirmationBlock) {
            confirmationBlock.style.display = "none";
        }
        var stepElement = document.getElementById("step-" + step);
        if (stepElement) {
            stepElement.style.display = "block";
        }
        
        var progressBar = document.getElementById("progress-bar");
        if (progressBar) {
            progressBar.style.width = ((step - 1) / (totalSteps - 1)) * 100 + "%";
        }

        var stepCounter = document.getElementById("step-counter");
        if (stepCounter) {
            stepCounter.innerText = "Step " + step + " of " + totalSteps;
            stepCounter.style.display = "block";
        }

        // Create a summary when reaching step 3
        if (step === 3) {
            var name = document.getElementById("b-name") ? document.getElementById("b-name").value : "";
            var email = document.getElementById("b-email") ? document.getElementById("b-email").value : "";
            var event = document.getElementById("b-event") ? document.getElementById("b-event").value : "";
            var date = document.getElementById("b-date") ? document.getElementById("b-date").value : "";
            var people = document.getElementById("b-people") ? document.getElementById("b-people").value : "";

            if (document.getElementById("summary-name")) document.getElementById("summary-name").innerText = name;
            if (document.getElementById("summary-email")) document.getElementById("summary-email").innerText = email;
            if (document.getElementById("summary-event")) document.getElementById("summary-event").innerText = event;
            if (document.getElementById("summary-date")) document.getElementById("summary-date").innerText = date;
            if (document.getElementById("summary-people")) document.getElementById("summary-people").innerText = people;
        }
    }

    // Initialize booking form if present
    if (document.getElementById("step-1")) {
        showStep(currentStep);
    }

    window.nextStep = function() {
        var isValid = true;
        if (currentStep === 1) {
            var nameInput = document.getElementById("b-name");
            var emailInput = document.getElementById("b-email");
            clearError("b-name");
            clearError("b-email");

            if (nameInput && nameInput.value.trim() === "") {
                showError("b-name", "Please enter your full name.");
                isValid = false;
            }
            if (emailInput) {
                var emailVal = emailInput.value.trim();
                var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailVal === "") {
                    showError("b-email", "Please enter your email address.");
                    isValid = false;
                } else if (!emailPattern.test(emailVal)) {
                    showError("b-email", "Please enter a valid format, eg: xyz@email.com.");
                    isValid = false;
                }
            }
        } else if (currentStep === 2) {
            var eventInput = document.getElementById("b-event");
            var dateInput = document.getElementById("b-date");
            var peopleInput = document.getElementById("b-people");
            
            clearError("b-event");
            clearError("b-date");
            clearError("b-people");

            if (eventInput && eventInput.value.trim() === "") {
                 showError("b-event", "Please select an event.");
                 isValid = false;
            }
            if (dateInput && dateInput.value.trim() === "") {
                 showError("b-date", "Please select a preferred date.");
                 isValid = false;
            }
            if (peopleInput) {
                 var peopleVal = parseInt(peopleInput.value, 10);
                 if (isNaN(peopleVal) || peopleVal < 1) {
                      showError("b-people", "Please enter a valid number of people (1 or more).");
                      isValid = false;
                 }
            }
        }

        if (!isValid) return;

        if (currentStep < totalSteps) {
            currentStep++;
            showStep(currentStep);
        } else if (currentStep === totalSteps) {
            confirmBooking();
        }
    };

    window.prevStep = function() {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
        }
    };

    window.confirmBooking = function() {
        var terms = document.getElementById("terms");
        clearError("terms");

        if (terms && terms.checked) {
            var steps = document.getElementsByClassName("booking-step");
            for (var i = 0; i < steps.length; i++) {
                steps[i].style.display = "none";
            }
            var confirmationBlock = document.getElementById("booking-confirmation");
            if (confirmationBlock) {
                confirmationBlock.style.display = "block";
            }
            var stepCounter = document.getElementById("step-counter");
            if (stepCounter) {
                stepCounter.style.display = "none";
            }
            var progressBar = document.getElementById("progress-bar");
            if (progressBar) {
                progressBar.style.width = "100%";
            }
        } else {
            showError("terms", "You must agree to the terms and conditions to proceed.");
        }
    };

    // Calendar Logic for Events Page
    window.selectDate = function(day) {
        var eventDetails = document.getElementById("event-details");
        if (eventDetails) {
            if (day === 15 || day === 20) {
                eventDetails.innerHTML = "<h4>Events on August " + day + ", 2025</h4><p>Mindfulness Workshop - 10:00 AM</p><a href='booking.html' class='btn'>Join Here</a>";
            } else {
                eventDetails.innerHTML = "<h4>Events on August " + day + ", 2025</h4><p>No events scheduled for this date.</p>";
            }
        }
    };
    // Contact Form Logic
    var contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", function(e) {
            e.preventDefault();
            var isValid = true;
            
            var fnameInput = document.getElementById("fname");
            var lnameInput = document.getElementById("lname");
            var emailInput = document.getElementById("email");
            var messageInput = document.getElementById("message");

            clearError("fname");
            clearError("lname");
            clearError("email");
            clearError("message");
            var successElement = document.getElementById("contact-success");
            if(successElement) successElement.style.display = "none";

            if (fnameInput && fnameInput.value.trim() === "") {
                showError("fname", "Please enter your first name.");
                isValid = false;
            }

            if (lnameInput && lnameInput.value.trim() === "") {
                showError("lname", "Please enter your last name.");
                isValid = false;
            }

            if (emailInput) {
                var emailVal = emailInput.value.trim();
                var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailVal === "") {
                    showError("email", "Please enter your email address.");
                    isValid = false;
                } else if (!emailPattern.test(emailVal)) {
                    showError("email", "Please enter a valid format, eg: xyz@email.com.");
                    isValid = false;
                }
            }

            if (messageInput && messageInput.value.trim() === "") {
                showError("message", "Please enter your message.");
                isValid = false;
            }

            if (isValid) {
                if(successElement) successElement.style.display = "block";
                contactForm.reset();
            }
        });
    }
});

