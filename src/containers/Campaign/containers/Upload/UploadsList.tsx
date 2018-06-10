import * as React from "react";
import {OrmCreativeCampaignResultCreatives} from "../../../../api/api";
import CONFIG from "../../../../constants/config";
import Translate from "../../../../components/i18n/Translate";
import {Row, Col} from "antd";
import CreativeBoxRow from "./Components/CreativeBoxRow/index";


interface IProps {
    creatives: Array<OrmCreativeCampaignResultCreatives>;
}

const UploadsList = function (props: IProps) {
    return (
        <div dir={CONFIG.DIR} className="upload-content">
            <div className="title">
                <h2><Translate value="Media upload"/></h2>
            </div>
            <Row type="flex" gutter={16}>
                {props.creatives.map((creative) => (
                    <Col span={12}>
                        <CreativeBoxRow creative={creative} />
                    </Col>
                ))}
                {props.creatives.map((creative) => (
                    <Col span={12}>
                        <CreativeBoxRow creative={creative} />
                    </Col>
                ))}  {props.creatives.map((creative) => (
                    <Col span={12}>
                        <CreativeBoxRow creative={creative} />
                    </Col>
                ))}  {props.creatives.map((creative) => (
                    <Col span={12}>
                        <CreativeBoxRow creative={creative} />
                    </Col>
                ))}  {props.creatives.map((creative) => (
                    <Col span={12}>
                        <CreativeBoxRow creative={creative} />
                    </Col>
                ))}  {props.creatives.map((creative) => (
                    <Col span={12}>
                        <CreativeBoxRow creative={creative} />
                    </Col>
                ))}  {props.creatives.map((creative) => (
                    <Col span={12}>
                        <CreativeBoxRow creative={creative} />
                    </Col>
                ))}
            </Row>
        </div>
    );
};


export default UploadsList;
