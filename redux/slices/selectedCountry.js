const initialState = {
   country = null
}

export const setSelectedCountry = country => {
   return {
      type: "selectedCountry/setCountry",
      payload: country,
   }
}

const selectedCountry = (state = initialState, action) => {
   switch (action.type) {
      case 'selectedCountry/setCountry':
         return {
            country: action.payload
         }
      default:
         return state
   }
}

export default selectedCountry