import * as React from "react";
import * as ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {Router, Route, Switch} from "react-router";
import {createBrowserHistory} from "history";
import {store} from "./redux/store";
import App from "./containers/App";
import {LocaleProvider} from "antd";
import enUS from "antd/lib/locale-provider/en_US";

import injectTapEventPlugin = require("react-tap-event-plugin");

injectTapEventPlugin();

const history = createBrowserHistory();


ReactDOM.render(
  <Provider store={store}>
    <LocaleProvider locale={enUS}>
      <Router history={history}>
        <Switch>
          <Route path="/" component={App}/>
        </Switch>
      </Router>
    </LocaleProvider>
  </Provider>,
  document.getElementById("root"),
);
