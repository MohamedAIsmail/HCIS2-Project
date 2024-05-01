document.addEventListener("DOMContentLoaded", () => {
    const patientId = window.location.pathname.split("/")[2];
    // Function to fetch and display doctors
    const fetchDoctors = async () => {
        try {
            const response = await axios.get("/api/v1/healthcareProvider");
            const doctors = response.data;
            const doctorsList = document.getElementById("doctors-list");

            doctors.healthcareProviders.forEach(doctor => {
                const doctorCard = document.createElement("div");
                doctorCard.classList.add("card"); // Add card class to each doctor card
                doctorCard.innerHTML = `
                    <div class="info">
                        <span class="key">Name:</span>
                        <span class="value">${doctor.name}</span>
                    </div>
                    <div class="info">
                        <span class="key">Specialization:</span>
                        <span class="value">${doctor.specialization}</span>
                    </div>
                    <button class="book-appointment" data-id="${doctor._id}">Book Appointment</button>
                `;
                doctorsList.appendChild(doctorCard);
            });

            // Add event listeners for booking appointments
            const bookButtons = document.querySelectorAll(".book-appointment");
            bookButtons.forEach(button => {
                button.addEventListener("click", async () => {
                    const doctorId = button.getAttribute("data-id");
                    window.location.href = `/appointments/${patientId}/${doctorId}`;
                });
            });
        } catch (error) {
            console.error("Error fetching doctors:", error);
        }
    };

    fetchDoctors();
});
