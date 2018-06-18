/**
 * @file Upload banner step
 */
import * as React from "react";
import {connect} from "react-redux";
import I18n from "../../../../services/i18n/index";
import "./style.less";
import {
    ControllersApi,
    OrmCampaign,
    OrmCreativeCampaignResult,
    ControllersCreateBannerResponseInner
} from "../../../../api/api";
import STEPS from "../../steps";
import {RootState} from "../../../../redux/reducers/index";
import {setCurrentStep, setCurrentCampaign, setSelectedCampaignId} from "../../../../redux/campaign/actions/index";
import {setBreadcrumb} from "../../../../redux/app/actions/index";
import UploadBanner from "./UploadBanner";
import UploadVideo from "./UploadVideo";
import {AdTemplate, TEMPLATE, CAMPAIGN_TYPE} from "./templateComponent";
import StickyFooter from "../../components/StickyFooter";
import Translate from "../../../../components/i18n/Translate";
// import UploadVideoInBanner from "./UploadVideoInBanner";
import UploadAdContent from "./Containers/UploadAdContent";
// import UploadDynamicBanner from "./UploadDynamicBanner";
import UploadUniversalApp from "./UploadUniversalApp";
import Icon from "../../../../components/Icon";
import UploadsList from "./UploadsList";


interface IProps {
    setBreadcrumb: (name: string, title: string, parent: string) => void;
    setCurrentCampaign: (campaign: OrmCampaign) => void;
    currentCampaign: OrmCampaign;
    setCurrentStep: (step: STEPS) => {};
    setSelectedCampaignId: (id: number | null) => {};
    currentStep: STEPS;
    selectedCampaignId: number | null;
    match: any;
    history: any;
    template?: TEMPLATE;
}

/**
 * @interface IState
 * @desc define state object
 */
interface IState {
    currentCampaign: OrmCampaign;
    template: TEMPLATE;
    creative?: OrmCreativeCampaignResult;
    currentCreative?: ControllersCreateBannerResponseInner;
    currentCreativeId?: number;
    loadCreative: boolean;
}

@connect(mapStateToProps, mapDispatchToProps)
class UploadComponent extends React.Component <IProps, IState> {
    private i18n = I18n.getInstance();

    /**
     * @constructor
     * @desc Set initial state and binding
     * @param {IProps} props
     */
    constructor(props: IProps) {
        super(props);
        this.state = {
            currentCampaign: props.currentCampaign && props.currentCampaign.id === this.props.match.params.id ? props.currentCampaign : null,
            template: props.template ? props.template : TEMPLATE.NONE,
            loadCreative: true,
            currentCreativeId: props.match.params.creative_id ? props.match.params.creative_id : null,
        };
    }

    componentWillReceiveProps(props: IProps) {
        if (props.match.params.creative_id) {
            this.loadCreatives();
        } else if (!props.match.params.creative_id && !!this.state.currentCreative) {
            this.loadCreatives();
            this.setState({
                currentCreative: null,
                template: TEMPLATE.NONE,
            });
        }
    }

    public componentDidMount() {
        this.props.setCurrentStep(STEPS.UPLOAD);
        this.props.setBreadcrumb("upload", this.i18n._t("Upload").toString(), "campaign");
        if (this.props.match.params.id) {
            this.loadCreatives();
            this.props.setSelectedCampaignId(this.props.match.params.id);
            const api = new ControllersApi();
            api.campaignGetIdGet({id: this.props.match.params.id})
                .then((campaign) => {
                    this.props.setBreadcrumb("campaignTitle", campaign.title, "upload");
                    this.setState({
                        currentCampaign: campaign,
                    });
                    console.log(campaign);
                    this.props.setCurrentCampaign(campaign as OrmCampaign);
                });
        }
    }

    /**
     * @func handleDragOver Important drop wont fire without this
     */
    private handleDragOver(e) {
        e.preventDefault();
    }

    private loadCreatives() {
        const controllerApi = new ControllersApi();
        controllerApi.campaignCreativeIdGet({id: this.props.match.params.id})
            .then((creatives: OrmCreativeCampaignResult) => {
                this.setState({
                    creative: creatives,
                    loadCreative: false,
                }, this.checkSelectedCreative.bind(this));
            })
            .catch(() => {
                this.setState({
                    loadCreative: false,
                });
            });
    }

    private checkSelectedCreative() {
        if (this.state.currentCreativeId) {
            let type;

            const currentCreative = this.state.creative.Creatives
                .find((creative) => (creative.creative.id.toString() === this.props.match.params.creative_id));

            if (currentCreative.creative.type === "native" && this.state.currentCampaign.kind === "app") {
                type = TEMPLATE.UNIVERSAL_APP;
            } else if (currentCreative.creative.type === "native" && this.state.currentCampaign.kind === "web") {
                type = TEMPLATE.AD_CONTENT;
            } else if (currentCreative.creative.type === "vast" && this.state.currentCampaign.kind === "web") {
                type = TEMPLATE.VAST;
            }
            if (currentCreative.creative.type === "banner") {
                type = TEMPLATE.BANNER;
            }

            this.setState({
                template: type,
                currentCreative: currentCreative,
            });
        }
    }

    private handleTemplateEvent(e) {
        this.setState({
            template: JSON.parse(e.dataTransfer.getData("template"))
        });
    }

    private handleTemplate(template) {
        this.setState({
            template: template
        });
    }

    private handleBack() {
        this.props.setCurrentStep(STEPS.TYPE);
        if (this.props.match.params.id) {
            this.props.history.push(`/campaign/select-publisher/${this.props.match.params.id}`);
        }
        else {
            this.props.history.push("/campaign/select-publisher");
        }
    }

    /**
     * @func render
     * @desc render component
     * @returns {any}
     */
    public render() {
        return (<div className="upload-wrapper">
                <AdTemplate
                    campaignType={this.props.currentCampaign ? this.props.currentCampaign.kind as CAMPAIGN_TYPE : null}
                    template={this.state.template} onChange={(temp) => this.handleTemplate(temp)}/>
                {!this.state.creative || this.state.creative.Creatives.length === 0 && this.state.template === TEMPLATE.NONE &&
                <div className={"template-drag-drop"}
                     onDragOver={this.handleDragOver}
                     onDrop={(e) => {
                         this.handleTemplateEvent(e);
                     }}>
                    <div className="vcenter">
                        <div className="dragdrop-icon">
                            <Icon name={"cif-dragdrop-zone"}/>
                            <div className="dragdrop-text">
                                <span>Drag & </span><span className="bold">DROP</span>
                            </div>
                            <span className="dragdrop-description"><Translate
                                value={"Please select your add type from right and drag and drop it over here"}/></span>
                        </div>
                    </div>
                    <StickyFooter customClass="sticky-footer-upload" backAction={this.handleBack} nextAction={() => {
                        console.log("here");
                    }}/>
                </div>
                }
                {this.state.creative && this.state.creative.Creatives.length > 0 && this.state.template === TEMPLATE.NONE &&
                <UploadsList creatives={this.state.creative.Creatives} campaign={this.state.currentCampaign}/>
                }
                {this.state.template === TEMPLATE.BANNER && this.state.currentCampaign &&
                <UploadBanner currentCampaign={this.state.currentCampaign}/>
                }
                {/*{this.state.template === TEMPLATE.VAST && this.state.currentCampaign &&*/}
                {/*<UploadVideo currentCampaign={this.state.currentCampaign} />*/}
                {/*}*/}
                {/*{this.state.template === TEMPLATE.VIDEO_IN_BANNER && this.state.currentCampaign &&*/}
                {/*<UploadVideoInBanner currentCampaign={this.state.currentCampaign} />*/}
                {/*}*/}
                {this.state.template === TEMPLATE.AD_CONTENT && this.state.currentCampaign &&
                <UploadAdContent currentCampaign={this.state.currentCampaign}
                                 currentCreative={this.state.currentCreative}/>
                }
                {/*{this.state.template === TEMPLATE.DYNAMIC_BANNER && this.state.currentCampaign &&*/}
                {/*<UploadDynamicBanner currentCampaign={this.state.currentCampaign} />*/}
                {/*}*/}
                {this.state.template === TEMPLATE.UNIVERSAL_APP && this.state.currentCampaign &&
                <UploadUniversalApp currentCampaign={this.state.currentCampaign}
                                    currentCreative={this.state.currentCreative}/>
                }
            </div>
        );
    }
}

interface IOwnProps {
    match?: any;
    history?: any;
}

function mapStateToProps(state: RootState, ownProps: IOwnProps) {
    return {
        currentStep: state.campaign.currentStep,
        currentCampaign: state.campaign.currentCampaign,
        selectedCampaignId: state.campaign.selectedCampaignId,
        match: ownProps.match,
        history: ownProps.history,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setCurrentStep: (step: STEPS) => dispatch(setCurrentStep(step)),
        setSelectedCampaignId: (id: number | null) => dispatch(setSelectedCampaignId(id)),
        setCurrentCampaign: (campaign: OrmCampaign) => dispatch(setCurrentCampaign(campaign)),
        setBreadcrumb: (name: string, title: string, parent: string) => dispatch(setBreadcrumb({name, title, parent})),
    };
}


export default UploadComponent;
