import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

const middleware = [thunk];
// creates empty store, no data
const store = createStore(
  rootReducer,
  {},
  compose(
    applyMiddleware(...middleware),
    //remove compose after production
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;
