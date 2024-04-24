const patientRoute = require('./patientRouter');
const healthcareProviderRoute = require('./healthcareProviderRouter');
const adminRoute = require('./adminRouter')
const authRoute = require('./authRouter')
const hl7A01Route = require('./hl7A01Router')
const hl7A04Route = require('./hl7A04Router')

const mountRoutes = (app) => {
    app.use('/api/v1/patient', patientRoute);
    app.use('/api/v1/healthcareProvider', healthcareProviderRoute);
    app.use('/api/v1/admin', adminRoute);
    app.use('/api/v1/auth', authRoute);
    app.use('/api/v1/a01', hl7A01Route);
    app.use('/api/v1/a04', hl7A04Route);
};

module.exports = mountRoutes;