import { createStore } from 'redux'
import { composeWithDevTools } from '@redux-devtools/extension';
import rootReducer from './reducer'
//import initSubscriber from 'redux-subscriber'

const store = createStore(
    rootReducer,
    composeWithDevTools(),
  );

//initSubscriber(store)

export default store;
