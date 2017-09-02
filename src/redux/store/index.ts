import {loadState, saveState} from "./localStorage/index";
import configureStore from "./config/index";
import {RootState} from "../reducers/index";
import {Store} from "redux";

// Load initial state from local storage if exist
const initialState: RootState = loadState();

// Pass initial state to store config
export const store: Store<RootState> = configureStore(initialState);

// Sync store with local storage
store.subscribe(() => {
  saveState(store.getState())
});
