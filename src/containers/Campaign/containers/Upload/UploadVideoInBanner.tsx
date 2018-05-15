/**
 * @file Upload Video step
 */
import * as React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import VideoSize from "./size/CONST_VIDEOsize";
import {IStateUpload} from "./UploadBanner";
import {Upload, Row, Col, notification, Progress, Button, Form, Spin} from "antd";
import Translate from "../../../../components/i18n/Translate/index";
import CONFIG from "../../../../constants/config";
import {UploadState} from "../../../../services/Upload/index";
import I18n from "../../../../services/i18n/index";
import "./style.less";
import {ControllersApi, OrmCampaign} from "../../../../api/api";
import STEPS from "../../steps";
import {RootState} from "../../../../redux/reducers/index";
import {setCurrentStep, setCurrentCampaign, setSelectedCampaignId} from "../../../../redux/campaign/actions/index";
import InputLimit from "../../components/InputLimit/InputLimit";
import UTMDynamicForm, {InputInfo} from "./UtmDynamicForm";
import {UTMInfo} from "./UtmForm";
import UploadFile, {FILE_TYPE} from "../../components/UploadFile";
import CreativeGeneralInfo from "../../../../components/CreativeGeneralInfo";
import {UPLOAD_MODULES} from "../../components/UploadFile";

const FormItem = Form.Item;

/**
 * @interface IFileItem
 * @desc define single file object
 */
export interface IFileItem {
    id?: number | string;
    fileObject?: any;
    state?: UploadState;
    utm?: string;
    name: string;
    width?: number;
    height?: number;
    cta?: string;
    edited?: boolean;
}

interface IProps {
    currentCampaign: OrmCampaign;
    setCurrentStep?: (step: STEPS) => {};
    form?: any;
    setSelectedCampaignId?: (id: number | null) => {};
    currentStep?: STEPS;
    selectedCampaignId?: number | null;
    match?: any;
    history?: any;
}

/**
 * @interface IState
 * @desc define state object
 */
interface IState extends IStateUpload {
}

@connect(mapStateToProps, mapDispatchToProps)
class UploadVideoInBanner extends React.Component <IProps, IState> {
    private i18n = I18n.getInstance();
    private FormObject: InputInfo[] = [{
        title: this.i18n._t("Title") as string,
        name: "title",
        type: "limiter",
        limit: 50,
        placeholder: this.i18n._t("Ad title") as string,
        required: true,
    },
         {
            title: this.i18n._t("Call to Action text") as string,
            name: "cta",
            type: "limiter",
            limit: 15,
            placeholder: this.i18n._t("example: online shopping") as string,
            required: true,
        },
        {
            title: this.i18n._t("URL") as string,
            name: "url",
            type: "url" ,
            required: true,
        }
    ];

    /**
     * @constructor
     * @desc Set initial state and binding
     * @param {IProps} props
     */
    constructor(props: IProps) {
        super(props);
        this.state = {
            currentCampaign: props.currentCampaign && props.currentCampaign.id === this.props.match.params.id ? props.currentCampaign : null,
            files: [],
            openImageModal: false,
            fileSelected: null,
        };
    }


    public componentDidMount() {
        this.setState({
            currentCampaign: this.props.currentCampaign,
        });
    }



    private handleSubmit() {

        let banners = [];
        this.state.files.map((file) => {
            banners.push({
                utm: file.utm,
                src: file.state.url,
                id: file.id.toString().indexOf("tmp_") === 0 ? null : file.id,
            });
        });


    }

    /**
     * @func render
     * @desc render component
     * @returns {any}
     */
    public render() {

        const {getFieldDecorator} = this.props.form;
        if (this.props.match.params.id && !this.state.currentCampaign) {
            return <Spin/>;
        }

        return (
            <div dir={CONFIG.DIR} className="upload-content">
                <div className="title">
                    <h2><Translate value="Media upload"/></h2>
                </div>
                <Row type="flex" gutter={16}>
                    <Col span={16} offset={8}>
                        <span className="span-block upload-media mb-1"><Translate value={"Upload media"}/></span>
                    </Col>
                    <Col span={24} className={"column-border-bottom"}>
                        <Row type={"flex"} gutter={16}>
                            <Col span={8}>
                              <UploadFile label={this.i18n._t("video") as string}
                                          required={true}
                                          exactDimension={{width: 640 , height: 360}}
                                          fileType={[FILE_TYPE.VID_MP4]}
                                          uploadModule={UPLOAD_MODULES.BANNER_VIDEO}
                              />
                            </Col>
                            <Col span={8}>
                              <UploadFile label={this.i18n._t("video poster(wide with 16:9 aspect ratio)") as string}
                                          minDimension={{width: 640 , height: 360}}
                                          required={true}
                                          fileType={[FILE_TYPE.IMG_JPG, FILE_TYPE.IMG_PNG, FILE_TYPE.IMG_GIF]}
                                          uploadModule={UPLOAD_MODULES.BANNER_IMAGE}
                              />
                            </Col>
                            <Col span={8}>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={24} className={"column-border-bottom uploaders-container"}>
                            <Col span={8} offset={16}>
                                <Col span={24}>
                                    <div className="upload-setting">
                        <span className="upload-title-setting span-block">
                           <Translate value={"Ad general information"}/>
                        </span>
                                    </div>
                                </Col>
                                <CreativeGeneralInfo form={this.props.form}/>
                            </Col>
                    </Col>
                    <Col span={8}>
                        <Row className="upload-setting">
                            <UTMDynamicForm form={this.props.form} inputObject={this.FormObject} />
                        </Row>
                    </Col>
                    <Row type="flex" align="middle" className="full-width mb-3">
                        <Button className="btn-general btn-submit ml-1"
                                onClick={this.handleSubmit.bind(this)}
                        >
                            <Translate value={"Save and creat new ad"}/>
                        </Button>
                        <Button className="btn-general btn-cancel"><Translate value={"Cancel"}/></Button>
                    </Row>
                </Row>
            </div>
        );
    }
}

interface IOwnProps {
    match ?: any;
    history?: any;
}
// TODO API should Implement
function mapStateToProps(state: RootState, ownProps: IOwnProps) {
    return {
        currentStep: state.campaign.currentStep,
        selectedCampaignId: state.campaign.selectedCampaignId,
        match: ownProps.match,
        history: ownProps.history,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setCurrentStep: (step: STEPS) => dispatch(setCurrentStep(step)),
        setSelectedCampaignId: (id: number | null) => dispatch(setSelectedCampaignId(id)),
    };
}


export default Form.create<IProps>()(withRouter(UploadVideoInBanner as any));
