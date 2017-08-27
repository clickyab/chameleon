import * as React from "react";
import {Layout} from "antd";
import I18n from "../../../../../services/i18n/index";

const {Footer} = Layout;
const i18n = I18n.getInstance();

export const PrivateFooter = (): JSX.Element => (
    <Footer>
        <ul className="pFooter">
            <li><b>{i18n._t("Clickyab@v1.1")}</b></li>
            <li><a href="">{i18n._t("contact us")}</a></li>
            <li><a href="">{i18n._t("faq")}</a></li>
            <li><a href="">{i18n._t("rules")}</a></li>
            <li><a href="">{i18n._t("blog")}</a></li>
        </ul>
    </Footer>
);

