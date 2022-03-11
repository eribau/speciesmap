const initialState = {
   threats: [],
   category: [],
   kingdom: []
}

export const setFilterThreats = threats => {
   return {
      type: "filterSetting/setFilterThreats",
      payload: threats,
   }
}

export const setFilterCategory = categories => {
   return {
      type: "filterSetting/setFilterCategory",
      payload: categories,
   }
}

export const setFilterKingdom = kingdoms => {
   return {
      type: "filterSetting/setFilterKingdom",
      payload: kingdoms,
   }
}

const filterSetting = (state = initialState, action) => {
   switch (action.type) {
      case 'filterSetting/setFilterThreats':
         return {
            ...state,
            threats: action.payload
         }
      case 'filterSetting/setFilterCategory':
         return {
            ...state,
            category: action.payload
         }
      case 'filterSetting/setFilterKingdom':
         return {
            ...state,
            kingdom: action.payload
         }
      default:
         return state
   }
}

export default filterSetting