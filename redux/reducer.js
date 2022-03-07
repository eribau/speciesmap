import { combineReducers } from "redux"

import filteredData from "./slices/filteredData"
import selectedCountry from "./slices/selectedCountry"

const rootReducer = combineReducers({
   filteredData,
   selectedCountry
})

export default rootReducer