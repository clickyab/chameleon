import * as React from "react";
import "./style.less";
import Translate from "../../../../../components/i18n/Translate";
import Banner from "./image/banner";
import Vast from "./image/vast";
import AdContent from "./image/adcontent";
import VideoInBanner from "./image/videoInBanner";
import DynamicBanner from "./image/DynamicBanner";

export const enum TEMPLATE {
    NONE = "NONE",
    BANNER = "BANNER",
    VAST = "VAST",
    AD_CONTENT = "AD_CONTENT",
    VIDEO_IN_BANNER = "VIDEO_IN_BANNER",
    DYNAMIC_BANNER = "DYNAMIC_BANNER"
}

interface IProps {
    template: TEMPLATE;
    onchange?: () => void;
}

interface IState {
    template: TEMPLATE;
}

export class AdTemplate extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
            template : props.template ? props.template : TEMPLATE.NONE
        };
    }

    private handleActiveTemp(index: TEMPLATE , event?) {
        this.setState({
            template: index
        });
        if (event) {
            event.dataTransfer.setData("template", JSON.stringify(index));
        }
        console.log("test");
    }
    render() {
        return (
            <div className="template-wrapper">
                <div className="title"><Translate value="Ad Type"/></div>
                <div draggable={true}
                     className={`template-type${this.state.template === TEMPLATE.BANNER ? " active" : (this.state.template !== TEMPLATE.NONE) ? " disable" : ""}`}
                     onClick={() => this.handleActiveTemp(TEMPLATE.BANNER)}
                     onDragStart={(e) => this.handleActiveTemp(TEMPLATE.BANNER, e) }>
                    <Banner/>
                </div>
                <div draggable={true} className={`template-type${this.state.template === TEMPLATE.VAST ? " active" : (this.state.template !== TEMPLATE.NONE) ? " disable" :  ""}`}
                     onClick={() => this.handleActiveTemp(TEMPLATE.VAST)}
                     onDragStart={(e) => this.handleActiveTemp(TEMPLATE.VAST, e) }>
                    <Vast/>
                </div>
                <div draggable={true} className={`template-type${this.state.template === TEMPLATE.AD_CONTENT ? " active" : (this.state.template !== TEMPLATE.NONE) ? " disable" :  ""}`}
                     onClick={() => this.handleActiveTemp(TEMPLATE.AD_CONTENT)}
                     onDragStart={(e) => this.handleActiveTemp(TEMPLATE.AD_CONTENT, e) }>
                    <AdContent/>
                </div>
                <div draggable={true} className={`template-type${this.state.template === TEMPLATE.VIDEO_IN_BANNER ? " active" : (this.state.template !== TEMPLATE.NONE) ? " disable" :  ""}`}
                     onClick={() => this.handleActiveTemp(TEMPLATE.VIDEO_IN_BANNER)}
                     onDragStart={(e) => this.handleActiveTemp(TEMPLATE.VIDEO_IN_BANNER, e) }>
                    <VideoInBanner />
                </div>
                <div draggable={true} className={`template-type${this.state.template === TEMPLATE.DYNAMIC_BANNER ? " active" : (this.state.template !== TEMPLATE.NONE) ? " disable" :  ""}`}
                     onClick={() => this.handleActiveTemp(TEMPLATE.DYNAMIC_BANNER)}
                     onDragStart={(e) => this.handleActiveTemp(TEMPLATE.DYNAMIC_BANNER, e) }>
                    <DynamicBanner />
                </div>
            </div>
        );
    }
}