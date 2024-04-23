const patientRoute = require('./patientRouter');
const healthcareProviderRoute = require('./healthcareProviderRouter');
const adminRoute = require('./adminRouter')
const authRoute = require('./authRouter')

const mountRoutes = (app) => {
    app.use('/api/v1/patient', patientRoute);
    app.use('/api/v1/healthcareProvider', healthcareProviderRoute);
    app.use('/api/v1/admin', adminRoute);
    app.use('/api/v1/auth', authRoute);
};

module.exports = mountRoutes;