import * as React from "react";
import "./style.less";
import Translate from "../../../../../components/i18n/Translate";
import Banner from "./image/banner";
import Vast from "./image/vast";
import AdContent from "./image/adcontent";
import VideoInBanner from "./image/videoInBanner";
import DynamicBanner from "./image/DynamicBanner";
import App from "./image/app";

export enum CAMPAIGN_TYPE  {WEB = "web" , APP = "app"}
export const enum TEMPLATE {
    NONE = "NONE",
    BANNER = "BANNER",
    VAST = "VAST",
    AD_CONTENT = "AD_CONTENT",
    VIDEO_IN_BANNER = "VIDEO_IN_BANNER",
    DYNAMIC_BANNER = "DYNAMIC_BANNER",
    UNIVERSAL_APP  = "UNIVERSAL_APP"
}

interface IProps {
    template: TEMPLATE;
    onChange?: (index) => void;
    campaignType: CAMPAIGN_TYPE ;
}

interface IState {
    template: TEMPLATE;
}

export class AdTemplate extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
            template: props.template ? props.template : TEMPLATE.NONE
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.template) {
            this.setState({
                template: nextProps.template
            });
        }
    }

    private handleActiveTemp(index: TEMPLATE, event?) {
        if (event) {
            event.dataTransfer.setData("template", JSON.stringify(index));
        }
        else {
            this.setState({
                template: index
            });
            if (this.props.onChange) {
                this.props.onChange(index);
            }
        }
    }

    render() {
        return (
            <div className="template-wrapper">
                <div className="title"><Translate value="Ad Type"/></div>
                {this.props.campaignType === CAMPAIGN_TYPE.WEB &&
                <div>
                    <div draggable={true}
                         className={`template-type${this.state.template === TEMPLATE.BANNER ? " active" : (this.state.template !== TEMPLATE.NONE) ? " disable" : ""}`}
                         onClick={() => this.handleActiveTemp(TEMPLATE.BANNER)}
                         onDragStart={(e) => this.handleActiveTemp(TEMPLATE.BANNER, e)}>
                        <Banner/>
                    </div>
                    <div draggable={true}
                         className={`template-type${this.state.template === TEMPLATE.VAST ? " active" : (this.state.template !== TEMPLATE.NONE) ? " disable" : ""}`}
                         onClick={() => this.handleActiveTemp(TEMPLATE.VAST)}
                         onDragStart={(e) => this.handleActiveTemp(TEMPLATE.VAST, e)}>
                        <Vast/>
                    </div>
                    <div draggable={true}
                         className={`template-type${this.state.template === TEMPLATE.AD_CONTENT ? " active" : (this.state.template !== TEMPLATE.NONE) ? " disable" : ""}`}
                         onClick={() => this.handleActiveTemp(TEMPLATE.AD_CONTENT)}
                         onDragStart={(e) => this.handleActiveTemp(TEMPLATE.AD_CONTENT, e)}>
                        <AdContent/>
                    </div>
                    <div draggable={true}
                         className={`template-type${this.state.template === TEMPLATE.VIDEO_IN_BANNER ? " active" : (this.state.template !== TEMPLATE.NONE) ? " disable" : ""}`}
                         onClick={() => this.handleActiveTemp(TEMPLATE.VIDEO_IN_BANNER)}
                         onDragStart={(e) => this.handleActiveTemp(TEMPLATE.VIDEO_IN_BANNER, e)}>
                        <VideoInBanner/>
                    </div>
                    <div draggable={true}
                         className={`template-type${this.state.template === TEMPLATE.DYNAMIC_BANNER ? " active" : (this.state.template !== TEMPLATE.NONE) ? " disable" : ""}`}
                         onClick={() => this.handleActiveTemp(TEMPLATE.DYNAMIC_BANNER)}
                         onDragStart={(e) => this.handleActiveTemp(TEMPLATE.DYNAMIC_BANNER, e)}>
                        <DynamicBanner/>
                    </div>
                </div>
                }
                {this.props.campaignType === CAMPAIGN_TYPE.APP &&
                <div>
                    <div draggable={true}
                         className={`template-type${this.state.template === TEMPLATE.BANNER ? " active" : (this.state.template !== TEMPLATE.NONE) ? " disable" : ""}`}
                         onClick={() => this.handleActiveTemp(TEMPLATE.BANNER)}
                         onDragStart={(e) => this.handleActiveTemp(TEMPLATE.BANNER, e)}>
                        <Banner/>
                    </div>
                    <div draggable={true}
                         className={`template-type${this.state.template === TEMPLATE.UNIVERSAL_APP ? " active" : (this.state.template !== TEMPLATE.NONE) ? " disable" : ""}`}
                         onClick={() => this.handleActiveTemp(TEMPLATE.UNIVERSAL_APP)}
                         onDragStart={(e) => this.handleActiveTemp(TEMPLATE.UNIVERSAL_APP, e)}>
                        <App/>
                    </div>
                </div>
                }
            </div>
        );
    }
}