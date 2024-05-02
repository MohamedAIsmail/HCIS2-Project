import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { FormEvent } from "react";
import { useDispatch } from "react-redux";
import { useParams } from 'react-router-dom';

import { TAppDispatch } from "../../redux/store";
import { addHL7AppointmentThunk } from "../Doctor/appointment-slice";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import {
    parsedMessage,
    encodeHL7Message,
    ParsedMessage,
} from "../../utils/HL7Encoder"
interface AddAppointmentProps {
    onClose: () => void;
}

const appointmentReasons = ["ROUTINE", "WALKIN", "FOLLOWUP", "EMERGENCY"];
const priorityOptions = ["Stat", "ASAP", "Routine", "Timing critical"];

export default function AddAppointment({ onClose }: AddAppointmentProps) {
    const { doctorId } = useParams();
    const dispatch = useDispatch<TAppDispatch>();

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const appointmentData = {
            "1": {
                segment: "MSH",
                fields: {
                    "Encoding Characters": " ~\\&",
                    "Sending Application": "Doctor^Portal",
                    "Sending Facility": "Doctor",
                    "Receiving Application": "Schdule^Database",
                    "Receiving Facility": "Adminesterator",
                    "Date/Time Of Message": "",
                    "Security": "",
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
                    "Alternate Character Set Handling Scheme": ""
                }
            },
            "2": {
                segment: "ARQ",
                fields: {
                    "Appointment ID": "",
                    "Filler Appointment ID": "",
                    "Occurrence Number": "",
                    "Placer Group Number": "",
                    "Schedule ID": "",
                    "Request Event Reason": "",
                    "Appointment Reason": data.get("appointmentReason") as "ROUTINE" | "WALKIN" | "FOLLOWUP" | "EMERGENCY",
                    "Appointment Type": "",
                    "Appointment Duration": data.get("appointmentDuration") as string,
                    "Appointment Duration Units": data.get("appointmentTime") as string,
                    "Requested Start Date/Time Range": data.get("requestedStartDate") as string,
                    "Priority-ARQ": data.get("priorityARQ") as "Stat" | "ASAP" | "Routine" | "Timing critical",
                    "Repeating Interval":  " ",
                    "Repeating Interval Duration": " ",
                    "Placer Contact Person": " ",
                    "Placer Contact Phone Number": " ",
                    "Placer Contact Address": "",
                    "Placer Contact Location": "",
                    "Entered By Person": "",
                    "Entered By Phone Number": "",
                    "Entered By Location": "",
                    "Parent Placer Appointment ID": "",
                    "Parent Filler Appointment ID": ""
                }
            },
            "3": {
                segment: "AIS",
                fields: {
                    "Set ID - AIS": "",
                    "Segment Action Code": "",
                    "Universal Service ID": "",
                    "Start Date/Time": "",
                    "Start Date/Time Offset": "",
                    "Start Date/Time Offset Units": "",
                    "Duration": "",
                    "Duration Units": "",
                    "Allow Substitution Code": "",
                    "Filler Status Code": ""
                }
            }}


            const encodeHL7Mes = encodeHL7Message(appointmentData);

            const dataFinal = JSON.stringify({
                scenario: "createAppointment",
                hl7Message: encodeHL7Mes
            });


        dispatch(addHL7AppointmentThunk(dataFinal,String(doctorId)));

        onClose();
    };

    return (
        <div className="bg-white shadow-md rounded-xl">
            <Container component="main" maxWidth="xs" className="border-2 rounded-xl">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: 3
                    }}
                >
                     <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{ position: 'absolute', right: 8, top: 8, color: 'gray' }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                        <EventAvailableIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Add Appointment
                    </Typography>
                    <Box
                        component="form"
                        noValidate
                        onSubmit={handleSubmit}
                        sx={{ mt: 3 }}
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    select
                                    required
                                    fullWidth
                                    id="appointmentReason"
                                    label="Appointment Reason"
                                    name="appointmentReason"
                                    defaultValue=""
                                >
                                    {appointmentReasons.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="appointmentTime"
                                    label="Appointment Time"
                                    name="appointmentTime"
                                    type="time"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="appointmentDuration"
                                    label="Appointment Duration"
                                    name="appointmentDuration"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="requestedStartDateTimeRange"
                                    label="Requested Start Date"
                                    name="requestedStartDate"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    select
                                    required
                                    fullWidth
                                    id="priorityARQ"
                                    label="Priority ARQ"
                                    name="priorityARQ"
                                    defaultValue=""
                                >
                                    {priorityOptions.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 3,
                                mb: 2,
                                backgroundColor: "#7c73e6",
                                "&:hover": { backgroundColor: "#9370DB" },
                            }}
                        >
                            Add Appointment
                        </Button>
                    </Box>
                </Box>
            </Container>
        </div>
    );
}
