document.addEventListener("DOMContentLoaded", () => {
    const doctorId = window.location.pathname.split("/")[2];

    // Function to fetch and display appointments for a specific doctor
    const fetchAppointments = async () => {
        try {
            const response = await axios.get(`/api/v1/appointment/${doctorId}`);
            const appointments = response.data.schedule.filter(appointment => !appointment.booked);
            const appointmentsList = document.getElementById("appointments-list");

            appointments.forEach(appointment => {
                if (!appointment.booked){
                    const appointmentDateAndTime = appointment.requestedStartDateTimeRange.split('T')
                    const appointmentCard = document.createElement("div");
                    appointmentCard.classList.add("card"); // Add card class to each appointment card
                    appointmentCard.innerHTML = `
                        <div class="info">
                            <span class="key">Appointment Time:</span>
                            <span class="value">${appointment.appointmentTime}</span>
                        </div>
                        <div class="info">
                            <span class="key">Appointment Date:</span>
                            <span class="value">${appointmentDateAndTime[0]}</span>
                        </div>
                        <button class="book-appointment" data-id="${appointment._id}">Book</button>
                    `;
                    appointmentsList.appendChild(appointmentCard);
                };
            });

            // Add event listener for booking appointments
            const bookButtons = document.querySelectorAll(".book-appointment");
            bookButtons.forEach(button => {
                button.addEventListener("click", async () => {
                    const appointmentId = button.getAttribute("data-id");
                    await bookAppointment(doctorId, appointmentId);
                    window.location.reload(); // Refresh the page after booking
                });
            });
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
    };

    fetchAppointments();

    // Function to book an appointment
    const bookAppointment = async (patientId, doctorId, appointmentId) => {
        try {
            await axios.put(`/api/v1/patient/${patientId}/${doctorId}/${appointmentId}`, {
                booked: true,
                patientID: patientId 
            });
        } catch (error) {
            console.error("Error booking appointment:", error);
        }
    };
});
