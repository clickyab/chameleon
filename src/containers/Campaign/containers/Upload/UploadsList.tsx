import * as React from "react";
import {OrmCampaign, ControllersCreateBannerResponseInner} from "../../../../api/api";
import CONFIG from "../../../../constants/config";
import Translate from "../../../../components/i18n/Translate/index";
import {Row, Col} from "antd";
import CreativeBoxRow from "./Components/CreativeBoxRow/index";


interface IProps {
    creatives: Array<ControllersCreateBannerResponseInner>;
    campaign: OrmCampaign;
}

const UploadsList = function (props: IProps) {
    return (
        <div dir={CONFIG.DIR} className="upload-content">
            <div className="title">
                <h2><Translate value="Media upload"/></h2>
            </div>
            <Row type="flex" gutter={16}>
                {props.creatives.map((creative) => (
                    <Col key={creative.creative.id} span={12}>
                        <CreativeBoxRow creative={creative} campaign={props.campaign} />
                    </Col>
                ))}
            </Row>
        </div>
    );
};


export default UploadsList;
