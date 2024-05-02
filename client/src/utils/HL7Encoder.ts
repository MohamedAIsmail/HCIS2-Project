import React from "react";

export interface ParsedMessage {
    [key: string]: MessageSegment;
}

interface MessageSegment {
    segment: string;
    fields: {
        [key: string]: string;
    };
}

export function encodeHL7Message(parsedMessage: ParsedMessage) {
    let encodedMessage = "";

    Object.values(parsedMessage).forEach((segmentData: any, index: number) => {
        const segmentName = segmentData.segment;
        const segmentFields = segmentData.fields;

        let segmentString = segmentName;

        Object.values(segmentFields).forEach(
            (fieldValue: any, fieldIndex: any) => {
                const encodedFieldValue = fieldValue.replace(/ /g, "^");
                segmentString += "|" + encodedFieldValue;
            }
        );

        encodedMessage += segmentString + "\r";
    });
    return encodedMessage;
}

export const parsedMessage: ParsedMessage = {
    "1": {
        segment: "MSH",
        fields: {
            "Encoding Characters": " ~\\&",
            "Sending Application": "Registeration^Portal",
            "Sending Facility": "Receptionist",
            "Receiving Application": "Patients^Database",
            "Receiving Facility": "Administerator",
            "Date/Time Of Message": "",
            Security: "",
            "Message Type": "ADT A04",
            "Message Control ID": "123456",
            "Processing ID": "T",
            "Version ID": "2.3.1",
            "Sequence Number": "",
            "Continuation Pointer": "",
            "Accept Acknowledgment Type": "AL",
            "Application Acknowledgment Type": "NE",
            "Country Code": "",
            "Character Set": "",
            "Principal Language Of Message": "",
            "Alternate Character Set Handling Scheme": "",
        },
    },
    "2": {
        segment: "EVN",
        fields: {
            "Event Type Code": "A04",
            "Recorded Date/Time": "",
            "Date/Time Planned Event": "",
            "Event Reason Code": "",
            "Operator ID": "",
            "Event Occurred": "",
        },
    },
    "3": {
        segment: "PID",
        fields: {
            "Set ID - PID": "",
            "Patient ID": "",
            "Patient Identifier List": "",
            "Alternate Patient ID - PID": "",
            "Patient Name": "",
            "Mothers Maiden Name": "",
            "Date/Time of Birth": "",
            Sex: "",
            "Patient Alias": "",
            Race: "",
            "Patient Address": "",
            "County Code": "",
            "Phone Number - Home": "",
            "Phone Number - Business": "",
            "Primary Language": "",
            "Marital Status": "",
            Religion: "",
            "Patient Account Number": "",
            "SSN Number - Patient": "",
            "Driver License Number - Patient": "",
            "Mother Identifier": "",
            "Ethnic Group": "",
            "Birth Place": "",
            "Multiple Birth Indicator": "",
            "Birth Order": "",
            Citizenship: "",
            "Veterans Military Status": "",
            Nationality: "",
            "Patient Death Date and Time": "",
            "Patient Death Indicator": "",
        },
    },
    "4": {
        segment: "PV1",
        fields: {
            "Prior Pending Location": "1",
            "Accommodation Code": "O",
            "Admit Reason": "Regesteration",
            "Transfer Reason": "PRT",
            "Patient Valuables": "",
            "Patient Valuables Location": "",
            "Visit User Code": "",
            "Expected Admit Date/Time": "",
            "Expected Discharge Date/Time": "",
            "Estimated Length of Inpatient Stay": "",
            "Actual Length of Inpatient Stay": "",
            "Visit Description": "",
            "Referral Source Code": "",
            "Previous Service Date": "",
            "Employment Illness Related Indicator": "",
            "Purge Status Code": "",
            "Purge Status Date": "",
            "Special Program Code": "",
            "Retention Indicator": "",
            "Expected Number of Insurance Plans": "",
            "Visit Publicity Code": "",
            "Visit Protection Indicator": "",
            "Clinic Organization Name": "",
            "Patient Status Code": "",
            "Visit Priority Code": "",
            "Previous Treatment Date": "",
            "Expected Discharge Disposition": "",
            "Signature on File Date": "",
            "First Similar Illness Date": "",
            "Patient Charge Adjustment Code": "",
            "Recurring Service Code": "",
            "Billing Media Code": "",
            "Expected Surgery Date & Time": "",
            "Military Partnership Code": "",
            "Military Non-Availability Code": "",
            "Newborn Baby Indicator": "",
            "Baby Detained Indicator": "",
        },
    },
};
