import PersonalDataBox from "./personalData/PersonalDataBox";
import { Stack } from "@mui/material";
import HistoryBox from "./historyBox/HistoryBox";
import { useAppDispatch } from "../../../../../core/store";
import { fetchExaminationByAppointmentID } from "../../../state/slices/examinationSlice";

const PersonCard = () => {
  const dispatch = useAppDispatch();
  
    dispatch(fetchExaminationByAppointmentID("5"));

    return (
        <Stack direction="row" spacing={1}>
            <PersonalDataBox />
            <HistoryBox />
        </Stack>
    );
};

export default PersonCard;
