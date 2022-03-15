const initialState = {
   country: null,
   name: null,
}

export const setSelectedCountry = country => {
   return {
      type: "selectedCountry/setCountry",
      payload: country,
   }
}

export const setSelectedCountryName = name => {
   return {
      type: "selectedCountry/setCountryName",
      payload: name,
   }
}

const selectedCountry = (state = initialState, action) => {
   switch (action.type) {
      case 'selectedCountry/setCountry':
         return {
            ...state,
            country: action.payload
         }
      case 'selectedCountry/setCountryName':
         return {
            ...state,
            name: action.payload
         }
      default:
         return state
   }
}

export default selectedCountry