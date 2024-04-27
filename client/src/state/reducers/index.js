import { combineReducers } from "redux";
import userReducer from "../slices/userSlice";
import stocksReducer from "../slices/stocksSlice";

const rootReducer = combineReducers({
  user: userReducer,
  stocks: stocksReducer,
});

export default rootReducer;
