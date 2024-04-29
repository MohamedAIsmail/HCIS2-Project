const PatientRegister = require('./models/patientRegisterModel');
const HealthcareProvider = require('./models/healthcareProviderModel');

// ############################################## Create Appointment Scenario ########################################################
exports.createAppointment = (parsedData, id) => {
    return new Promise(async (resolve, reject) => {
        try {

            const message = await parseCreateAppointmentHL7Message(parsedData.hl7Message);

            const appointmentDataARQ = message['2']['fields'];
            const appointmentDataAIS = message['3']['fields'];

            // Extracting the data from the ARQ Segment
            let appointmentDuration = appointmentDataARQ['Appointment Duration'];
            let requestedStartDateTimeRange = appointmentDataARQ['Requested Start Date/Time Range'];

            // Extracting the data from the AIS Segment
            let appointmentTime = appointmentDataAIS['Start Date/Time'];

            // Validating appointmentDuration
            const regex = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])$/;

            if (!regex.test(appointmentDuration)) {
                console.error("Invalid duration");
                reject({ error: 'Internal Server Error' });
                return;
            }

            const splittedDateTime = requestedStartDateTimeRange.split('T');
            const appointmentDate = splittedDateTime[0];
            appointmentTime = splittedDateTime[1];

            // Validating the requestedStartDateTimeRange
            const parsedDate = new Date(appointmentDate);

            if (!(!isNaN(parsedDate.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(appointmentDate))) {
                console.error("Invalid Date or time foramat");
                reject({ error: 'Internal Server Error' });
                return;
            }

            // Check if the date is already booked
            const existingAppointmentDate = await HealthcareProvider.findOne({
                _id: id,
                'schedule.requestedStartDateTimeRange': requestedStartDateTimeRange
            });

            // Check if the time is already booked
            const existingAppointmentTime = await HealthcareProvider.findOne({
                _id: id,
                'schedule.appointmentTime': appointmentTime
            });

            if (existingAppointmentDate && existingAppointmentTime) {
                console.error("Can't replicate an existing appointment");
                reject({ error: 'Internal Server Error' });
                return;
            }

            const bodyObject = {
                "appointmentReason": appointmentDataARQ['Appointment Reason'],
                "appointmentTime": appointmentTime,
                "appointmentDuration": appointmentDataARQ['Appointment Duration'],
                "requestedStartDateTimeRange": appointmentDataARQ['Requested Start Date/Time Range'],
                "priorityARQ": appointmentDataARQ['Priority-ARQ'],
                "repeatingInterval": appointmentDataARQ['Repeating Interval'].replace('^', " "),
                "repeatingIntervalDuration": appointmentDataARQ['Repeating Interval Duration'].replace('^', " "),
                "placerContactPerson": appointmentDataARQ['Placer Contact Person'].replace('^', " "),
                "PlacerContactPhoneNumber": appointmentDataARQ['Placer Contact Phone Number'],
            };

            let healthcareProvider = await HealthcareProvider.findById(id);

            if (!healthcareProvider) {
                console.error("Can't find the healthcare provider");
                reject({ error: 'Internal Server Error' });
                return;
            }

            healthcareProvider.schedule.push(bodyObject);
            healthcareProvider = await healthcareProvider.save();

            resolve(healthcareProvider);
        } catch (error) {
            reject({ error: 'Internal Server Error' });
        }
    });
};
  
async function parseCreateAppointmentHL7Message(message) {
    return new Promise((resolve, reject) => {

        const segments = message.split('\r');

        const parsedMessage = {};

        segments.forEach((segment, index) => {

            const fields = segment.split('|');
            const segmentName = fields[0];
            const segmentFields = {};

            // Names for each field in the MSH segment, excluding the last field
            const fieldNamesMSH = [
                'Encoding Characters', 'Sending Application', 'Sending Facility',
                'Receiving Application', 'Receiving Facility', 'Date/Time Of Message',
                'Security', 'Message Type', 'Message Control ID', 'Processing ID',
                'Version ID', 'Sequence Number', 'Continuation Pointer', 'Accept Acknowledgment Type',
                'Application Acknowledgment Type', 'Country Code', 'Character Set',
                'Principal Language Of Message', 'Alternate Character Set Handling Scheme'
            ];

            const fieldNamesARQ = [
                'Appointment ID', 'Filler Appointment ID', 'Occurrence Number', 'Placer Group Number', 'Schedule ID', 
                'Request Event Reason', 'Appointment Reason', 'Appointment Type', 'Appointment Duration', 'Appointment Duration Units',
                'Requested Start Date/Time Range', 'Priority-ARQ', 'Repeating Interval', 'Repeating Interval Duration', 
                'Placer Contact Person', 'Placer Contact Phone Number', 'Placer Contact Address', 'Placer Contact Location', 
                'Entered By Person', 'Entered By Phone Number', 'Entered By Location', 'Parent Placer Appointment ID', 
                'Parent Filler Appointment ID'
            ];

            const fileNamesAIS = [ 
                'Set ID - AIS', 'Segment Action Code', 'Universal Service ID', 'Start Date/Time', 'Start Date/Time Offset', 
                'Start Date/Time Offset Units', 'Duration', 'Duration Units', 'Allow Substitution Code', 'Filler Status Code'
            ];

            const fieldNames = segmentName === 'MSH' ? fieldNamesMSH : (segmentName === 'ARQ' ? fieldNamesARQ : fileNamesAIS);

            fields.slice(1).forEach((field, fieldIndex) => {
                segmentFields[fieldNames[fieldIndex]] = field;
            });

            parsedMessage[index + 1] = {
                segment: segmentName,
                fields: segmentFields
            };
        });

        resolve(parsedMessage);
    });
};
  

// ############################################## Patient Register Scenario ########################################################
exports.registerPatient = (parsedData) => {
  return new Promise(async (resolve, reject) => {
      try {
          const message = await parseRegisterPatientHL7Message(parsedData.hl7Message);

          const patientData = message['3']['fields'];

          const bodyObject = {
              "setID": patientData['Set ID - PID'],
              "patientID": patientData['Patient ID'],
              "patientIdentifierList": patientData['Patient Identifier List'],
              "alternatePatientID": patientData['Alternate Patient ID - PID'],
              "patientName": patientData['Patient Name'],
              "mothersMaidenName": patientData['Mothers Maiden Name'],
              "dateTimeOfBirth": patientData['Date/Time of Birth'],
              "sex": patientData['Sex'],
              "patientAlias": patientData['Patient Alias'],
              "race": patientData['Race'],
              "patientAddress": patientData['Patient Address'],
              "countyCode": patientData['County Code'],
              "phoneNumberHome": patientData['Phone Number - Home'],
              "phoneNumberBusiness": patientData['Phone Number - Business'],
              "primaryLanguage": patientData['Primary Language'],
              "maritalStatus": patientData['Race'],
              "religion": patientData['Religion'],
              "patientAccountNumber": patientData['Patient Account Number'],
              "ssnNumberPatient": patientData['SSN Number - Patient'],
              "driverLicenseNumberPatient": patientData['Driver License Number - Patient'],
              "motherIdentifier": patientData['Mother Identifier'],
              "ethnicGroup": patientData['Ethnic Group'],
              "birthPlace": patientData['Birth Place'],
              "multipleBirthIndicator": patientData['Multiple Birth Indicator'],
              "birthOrder": patientData['Birth Order'],
              "citizenship": patientData['Citizenship'],
              "veteransMilitaryStatus": patientData['Veterans Military Status'],
              "nationality": patientData['Nationality'],
              "patientDeathDateTime": patientData['Patient Death Date and Time'],
              "patientDeathIndicator": patientData['Patient Death Indicator']
          };
          
        const patient = await PatientRegister.create(bodyObject);
        resolve(patient);
      } catch (error) {
          reject({ error: 'Internal Server Error' });
      };
  });
};

async function parseRegisterPatientHL7Message(message) {
  return new Promise((resolve, reject) => {
      const segments = message.split('\r');
      const parsedMessage = {};

      segments.forEach((segment, index) => {
          const fields = segment.split('|');
          const segmentName = fields[0];
          const segmentFields = {};

          const fieldNamesMSH = [
              'Encoding Characters', 'Sending Application', 'Sending Facility',
              'Receiving Application', 'Receiving Facility', 'Date/Time Of Message',
              'Security', 'Message Type', 'Message Control ID', 'Processing ID',
              'Version ID', 'Sequence Number', 'Continuation Pointer', 'Accept Acknowledgment Type',
              'Application Acknowledgment Type', 'Country Code', 'Character Set',
              'Principal Language Of Message', 'Alternate Character Set Handling Scheme'
          ];

          const fieldNamesEVN = [
              'Event Type Code', 'Recorded Date/Time', 'Date/Time Planned Event', 'Event Reason Code', 'Operator ID', 'Event Occurred'
          ];

          const fieldNamesPID = [
              'Set ID - PID', 'Patient ID', 'Patient Identifier List', 'Alternate Patient ID - PID',
              'Patient Name', 'Mothers Maiden Name', 'Date/Time of Birth', 'Sex', 'Patient Alias',
              'Race', 'Patient Address', 'County Code', 'Phone Number - Home', 'Phone Number - Business',
              'Primary Language', 'Marital Status', 'Religion', 'Patient Account Number', 'SSN Number - Patient',
              'Driver License Number - Patient', 'Mother Identifier', 'Ethnic Group', 'Birth Place',
              'Multiple Birth Indicator', 'Birth Order', 'Citizenship', 'Veterans Military Status',
              'Nationality', 'Patient Death Date and Time', 'Patient Death Indicator'
          ];
          
          const fieldNamesPV1 = [
              'Prior Pending Location', 'Accommodation Code', 'Admit Reason', 'Transfer Reason',
              'Patient Valuables', 'Patient Valuables Location', 'Visit User Code', 'Expected Admit Date/Time',
              'Expected Discharge Date/Time', 'Estimated Length of Inpatient Stay', 'Actual Length of Inpatient Stay',
              'Visit Description', 'Referral Source Code', 'Previous Service Date', 'Employment Illness Related Indicator',
              'Purge Status Code', 'Purge Status Date', 'Special Program Code', 'Retention Indicator',
              'Expected Number of Insurance Plans', 'Visit Publicity Code', 'Visit Protection Indicator',
              'Clinic Organization Name', 'Patient Status Code', 'Visit Priority Code', 'Previous Treatment Date',
              'Expected Discharge Disposition', 'Signature on File Date', 'First Similar Illness Date',
              'Patient Charge Adjustment Code', 'Recurring Service Code', 'Billing Media Code',
              'Expected Surgery Date & Time', 'Military Partnership Code', 'Military Non-Availability Code',
              'Newborn Baby Indicator', 'Baby Detained Indicator'
          ];

          const fieldNames = segmentName === 'MSH' ? fieldNamesMSH :
              (segmentName === 'EVN' ? fieldNamesEVN :
                  (segmentName === 'PID' ? fieldNamesPID : fieldNamesPV1));

          fields.slice(1).forEach((field, fieldIndex) => {
              const fieldValue = field.replace(/\^/g, ' ');
              segmentFields[fieldNames[fieldIndex]] = fieldValue;
          });

          parsedMessage[index + 1] = {
              segment: segmentName,
              fields: segmentFields
          };
      });
      resolve(parsedMessage);
  });
};