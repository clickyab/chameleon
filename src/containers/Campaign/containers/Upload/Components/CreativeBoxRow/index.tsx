import * as React from "react";
import {OrmCampaign, ControllersCreateBannerResponseInner} from "../../../../../../api/api";
import "./style.less";
import Icon from "../../../../../../components/Icon";
import I18n from "../../../../../../services/i18n";
import {Link} from "react-router-dom";

interface IProps {
    creative: ControllersCreateBannerResponseInner;
    campaign: OrmCampaign;
}

const CreativeBoxRow = (props: IProps) => {
    const i18n = I18n.getInstance();

    function getImgUrl() {
        if (props.creative.assets.icon) {
            return props.creative.assets.icon[0]["val"];
        } else if (props.creative.assets.image) {
            return props.creative.assets.image[0]["val"];
        }
        // todo: return video image
    }

    function getType() {
        switch (props.creative.creative.type) {
            case "native":
                return i18n._t("Native");
            case "banner":
                return i18n._t("Banner");
            case "vast":
                return i18n._t("VAST");
        }
    }

    return (
        <div className={"creative-box-row"}>
            <div>
                <span className={"creative-name"}>{props.creative.creative.name}</span>
                <span>({getType()})</span>
                <span className={"edit-btn"}>
                    <Link to={`/campaign/upload/${props.campaign.id}/creative/${props.creative.creative.id}`}>
                        <Icon name={"cif-edit"}/>
                    </Link>
                </span>
            </div>
            <hr/>
            <div className={"creative-box-content"}>
                <div className={"thumbnail"}>
                    <img src={`http://staging.crab.clickyab.ae/uploads/` + getImgUrl()}
                         alt=""/>
                </div>
                <div className={"texts"}>
                    <p>
                        {props.creative.assets["title"] && props.creative.assets["title"][0]["val"]}
                        {!props.creative.assets["title"] && <span className={"placeholder title"}></span>}
                    </p>
                    <span>
                        {props.creative.assets["description"] && props.creative.assets["description"][0]["val"]}
                        {!props.creative.assets["description"] && <span className={"placeholder description"}></span>}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CreativeBoxRow;
