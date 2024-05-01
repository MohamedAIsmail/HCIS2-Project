const patientRoute = require('./patientAccountRouter');
const healthcareProviderRoute = require('./healthcareProviderRouter');
const adminRoute = require('./adminRouter');
const authRoute = require('./authRouter');
const createAppointmentRoute = require('./createAppointmentRouter');
const registerPatientRoute = require('./patientRegisterRouter');
const receptionistRoute = require('./receptionistRouter');

const mountRoutes = (app) => {
    app.use('/api/v1/patient', patientRoute);
    app.use('/api/v1/healthcareProvider', healthcareProviderRoute);
    app.use('/api/v1/admin', adminRoute);
    app.use('/api/v1/auth', authRoute);
    app.use('/api/v1/registerPatient', registerPatientRoute);
    app.use('/api/v1/appointment', createAppointmentRoute);
    app.use('/api/v1/receptionist', receptionistRoute);
};

module.exports = mountRoutes;