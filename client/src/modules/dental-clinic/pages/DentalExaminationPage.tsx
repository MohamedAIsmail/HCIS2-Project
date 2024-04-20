import PersonCard from "../components/examination/patientCard/PersonCard";
import PatientExamination from "../components/examination/PatientExamination";
import { Stack } from "@mui/material";
import React from "react";
import styles from "../components/examination/examination.module.css";
import AppLayout from "../../../core/components/AppLayout";

const DentalExaminationPage = () => {
    return (
        <div>
            <AppLayout>
                <Stack spacing={1} className={styles.page}>
                    <PersonCard />
                    <PatientExamination />
                </Stack>
            </AppLayout>
        </div>
    );
};
export default DentalExaminationPage;
