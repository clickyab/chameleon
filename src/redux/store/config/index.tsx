import { createStore, applyMiddleware, Store } from "redux";
import { logger } from "../../../middleware";
import rootReducer, { RootState } from "../../reducers";

/**
 *  initial store with middleware
 *  @func
 *
 *  @param {RootState}  initialState
 *
 * @returns {Store}
 */
export default function configureStore(initialState?: RootState): Store<RootState> {
  const create = window.devToolsExtension
    ? window.devToolsExtension()(createStore)
    : createStore;

  // Add middleware
  const createStoreWithMiddleware = applyMiddleware(logger)(create);

  // Create store with initial object
  const store = createStoreWithMiddleware(rootReducer, initialState) as Store<RootState>;

  if (module.hot) {
    module.hot.accept("../../reducers", () => {
      const nextReducer = require("../../reducers");
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
