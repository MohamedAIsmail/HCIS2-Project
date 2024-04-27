const patientRoute = require('./patientAccountRouter');
const healthcareProviderRoute = require('./healthcareProviderRouter');
const adminRoute = require('./adminRouter')
const authRoute = require('./authRouter')

const registerPatient = require('./patientRegisterRouter')

const mountRoutes = (app) => {
    app.use('/api/v1/patient', patientRoute);
    app.use('/api/v1/healthcareProvider', healthcareProviderRoute);
    app.use('/api/v1/admin', adminRoute);
    app.use('/api/v1/auth', authRoute);
    app.use('/api/v1/registerPatient', registerPatient);
};

module.exports = mountRoutes;