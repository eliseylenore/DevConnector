import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

const middleware = [thunk];
// creates empty store, no data
const store = createStore(
  () => [], 
  {}, 
  applyMiddleware(...middleware)
);

export default store;
