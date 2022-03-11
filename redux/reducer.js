import { combineReducers } from "redux"

import filteredData from "./slices/filteredData"
import selectedCountry from "./slices/selectedCountry"
import filterSetting from "./slices/filterSetting"

const rootReducer = combineReducers({
   filteredData,
   selectedCountry,
   filterSetting
})

export default rootReducer