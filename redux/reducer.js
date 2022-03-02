import { combineReducers } from "redux"

import filteredData from "./slices/filteredData"

const rootReducer = combineReducers({
   filteredData,
})

export default rootReducer