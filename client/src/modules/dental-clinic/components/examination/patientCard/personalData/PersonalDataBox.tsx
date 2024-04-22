import React, { useEffect } from "react";
import { Stack, Box } from "@mui/material";

import styles from "./PersonalDataBox.module.css";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../core/store";

const PersonalData: React.FC = () => {
    const getAge = (birthDate: string) => {
        const dateOfBirth = dayjs(birthDate);
        const today = dayjs();
        const age = today.diff(dateOfBirth, "year");
        return age;
    };

    const ExamPatientState = useSelector(
        (state: RootState) => state.examinationReducer.examination.patient
    );

    return (
        <Box className={styles.box_container}>
            <Stack spacing={2}>
                <span className={styles.titleText}>Personal Data</span>

                <span className={styles.labelText}>
                    Name:{" "}
                    <span className={styles.parameterText}>
                        {ExamPatientState.Name}
                    </span>
                </span>
                <span className={styles.labelText}>
                    Weight:{" "}
                    <span className={styles.parameterText}>
                        {ExamPatientState.Weight}
                    </span>
                </span>
                <span className={styles.labelText}>
                    Height:{" "}
                    <span className={styles.parameterText}>
                        {ExamPatientState.Height}
                    </span>
                </span>
                <span className={styles.labelText}>
                    Age:{" "}
                    <span className={styles.parameterText}>
                        {ExamPatientState.Age}
                    </span>
                </span>
                {/* Add more personal data fields as needed */}
            </Stack>
        </Box>
    );
};

export default PersonalData;
