const patientRoute = require('./patientRouter');
const userRoute = require('./userRouter');
const healthcareProviderRoute = require('./healthcareProviderRouter');

const mountRoutes = (app) => {
    app.use('/api/v1/patient', patientRoute);
    app.use('/api/v1/user', userRoute);
    app.use('/api/v1/healthcareProvider', healthcareProviderRoute);

};

module.exports = mountRoutes;