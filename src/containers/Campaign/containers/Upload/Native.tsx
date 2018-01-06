/**
 * @file Native
 */
import * as React from "react";
import Image from "react-image-file";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import {Upload, Row, Col, notification, Card, Progress, Button, Form, Spin} from "antd";
import Translate from "../../../../components/i18n/Translate/index";
import CONFIG from "../../../../constants/config";
import {default as UploadService, UPLOAD_MODULES, UploadState, UPLOAD_STATUS} from "../../../../services/Upload/index";
import I18n from "../../../../services/i18n/index";
import UtmModal from "./UtmModal";
import "./style.less";
import Modal from "../../../../components/Modal/index";
import Icon from "../../../../components/Icon/index";
import {ControllersApi, OrmCampaign} from "../../../../api/api";
import STEPS from "../../steps";
import {RootState} from "../../../../redux/reducers/index";
import {setCurrentStep, setCurrentCampaign, setSelectedCampaignId} from "../../../../redux/campaign/actions/index";
import {RaisedButton, TextField} from "material-ui";
import Tooltip from "../../../../components/Tooltip";
import {DesktopPreview} from "./previewComponent/desktop";
import {TabletPreview} from "./previewComponent/tablet";
import {PhonePreview} from "./previewComponent/phone";

/**
 * @interface IProps
 * @desc define Prop object
 */
interface IProps {
    currentCampaign?: OrmCampaign;
    setCurrentStep?: (step: STEPS) => {};
    form?: any;
    setSelectedCampaignId?: (id: number | null) => {};
    currentStep?: STEPS;
    selectedCampaignId?: number | null;
    match?: any;
    history?: any;
    nativeItems?: NativeAdd[];
    previewType?: PREVIEW;
}

interface NativeAdd {
    id: string | number;
    img_url: string;
    url: string;
    description: string;
}

let a: NativeAdd[] = [
    {id: "1", img_url: "http://via.placeholder.com/170x105", url: "http://google.com", description: "god speaking"},
    {id: "2", img_url: "http://via.placeholder.com/170x105", url: "http://bing.com", description: "evil speaking"},
    {id: "3", img_url: "http://via.placeholder.com/170x105", url: "http://matlab.com", description: "logic"},
];

enum PREVIEW {DESKTOP, TABLET, PHONE}

/**
 * @interface IState
 * @desc define state object
 */
interface IState {
    currentCampaign: OrmCampaign;
    nativeItems: NativeAdd[];
    addTextField: string | null;
    previewType: PREVIEW;
    inputIndex: number | null;
}

@connect(mapStateToProps, mapDispatchToProps)
class NativeComponent extends React.Component <IProps, IState> {
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
            nativeItems: props.nativeItems ? props.nativeItems : a,
            addTextField: null,
            previewType: props.previewType ? props.previewType : PREVIEW.DESKTOP,
            inputIndex: null,
        };
    }

    public componentDidMount() {
        this.setState({
            currentCampaign: this.props.currentCampaign,
        });
    }

    private handleBack() {
        this.props.setCurrentStep(STEPS.SELECT_PUBLISHER);
        this.props.history.push(`/campaign/select-publisher/${this.props.match.params.id}`);
    }

    private handleSubmit() {
        console.log("submited");
    }

    private handlePreview(preview: PREVIEW): void {
        this.setState({previewType: preview});
    }

    /**
     * @func handleAdd
     * @desc add new item to state
     */
    private handleAdd(): void {
        let inputData = {id: "", img_url: "", url: "", description: ""};
        inputData.img_url = this.state.addTextField;
        let tempData = this.state.nativeItems;
        tempData.push(inputData);
        this.setState({nativeItems: tempData});
    }
    /**
     * @func removeItem
     * @desc remove item after click on x icon
     */
    private removeItem(item) {
        let index: number = this.state.nativeItems.indexOf(item);
        if (index >= 0) {
            let tempState = this.state.nativeItems;
            tempState.splice(index, 1);
            this.setState({nativeItems: tempState});
        }
    }
    // TODO: Remove this part only for Demo
    private handleAddField(value) {
        this.setState({addTextField: value});
    }
    /**
     * @func handleDescChange
     * @desc handle Description change of item onChange
     */
    public handleDescChange(e, item) {
        let index: number = this.state.nativeItems.indexOf(item);
        if (index >= 0 && e.target.value.length <= 50) {
            let tempState = this.state.nativeItems;
            tempState[index].description = e.target.value;
            this.setState({nativeItems: tempState});
        }
    }
    /**
     * @func handleUrlChange
     * @desc handle url of item onChange
     */
    public handleUrlChange(e, item) {
        let index: number = this.state.nativeItems.indexOf(item);
        if (index >= 0 && e.target.value.length <= 50) {
            let tempState = this.state.nativeItems;
            tempState[index].url = e.target.value;
            this.setState({nativeItems: tempState});
        }
    }
    /**
     * @func handleEnable
     * @desc Enable input of url items (Set index onClick of edit icon)
     */
    public handleEnable(index) {
        this.setState({inputIndex: index});
    }
    /**
     * @func handleDisable
     * @desc Disable input of url items (Set index to null)
     */
    public handleDisable() {
        this.setState({inputIndex: null});
    }

    public createMap(): JSX.Element[] {
        return this.state.nativeItems.map((item) => {
            return (
                <Row type="flex" className="native-item-wrapper" key={item.id} gutter={24}>
                    <div className="native-img-wrapper">
                        <div className="img-container"><img className="native-img" src={item.img_url}/></div>
                    </div>
                    <div className="native-info-col">
                        <Row align="middle" className={"pt-1 pb-1"}>
                            <Row>
                                <Col span={5} className="native-item-icon">
                                    <Icon name={"cif-closelong"} onClick={() => this.removeItem(item)}/>
                                    <Icon name={"cif-edit"} className={this.state.inputIndex === item.id ? "selected-edit" : ""} onClick={() => this.handleEnable(item.id)}/>
                                </Col>
                                <Col span={19} className="native-item-url">
                                    <TextField
                                        className="native-url-input"
                                        fullWidth={true}
                                        defaultValue={item.url}
                                        disabled={this.state.inputIndex !== item.id}
                                        onBlur={() => this.handleDisable()}
                                        onChange={(e, value) => this.handleUrlChange(e, item)}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <TextField
                                        className="native-input"
                                        fullWidth={true}
                                        defaultValue={item.description}
                                        onChange={(e, value) => this.handleDescChange(e, item)}
                                    />
                                    <span
                                        className={`item-desc-num ${ (item.description.length > 10) ? "green" : "red"}`}>
                                        {item.description.length}
                                    </span>
                                </Col>
                            </Row>
                        </Row>
                    </div>
                </Row>
            );
        });
    }

    public render() {

        if (this.props.match.params.id && !this.state.currentCampaign) {
            return <Spin/>;
        }

        return (
            <div dir={CONFIG.DIR} className="campaign-content">
                <div className="campaign-title">
                    <h2><Translate value="Uplaod banner"/></h2>
                    <p><Translate value="Upload banner description"/></p>
                </div>
                <Row type="flex" gutter={32} justify="center">
                    <Col sm={{span: 24}} md={{span: 12}}>
                        <Row>
                            <Row className="native-title">
                                <Translate value={"Your content"}/>
                            </Row>
                            {this.createMap()}
                        </Row>
                        <Row type="flex" className={"mt-2"} gutter={12} align="middle">
                            <Col span={4}>
                                <label>
                                    <Tooltip/>
                                    <Translate value={"URL"}/>
                                </label>
                            </Col>
                            <Col span={17}>
                                <TextField
                                    fullWidth={true}
                                    hintText={<Translate
                                        value={"http://example.com/search/?utm_source=summer&utm..."}/>}
                                    onChange={(e, value) => this.handleAddField(value)}
                                    className="url-textfield"
                                />
                            </Col>
                            <Col span={3}>
                                <RaisedButton
                                    label={<Translate value="Add"/>}
                                    primary={false}
                                    className="btn-add-url"
                                    icon={<Icon name="cif-plusregular plus-icon "/>}
                                    onClick={() => this.handleAdd()}
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col sm={{span: 24}} md={{span: 12}}>
                        <Row type="flex" justify="center" style={{height: "100%"}} gutter={21}>
                            <Col span={20}>
                                <div className="native-svg-wrapper">
                                    {this.state.previewType === PREVIEW.DESKTOP &&
                                    <div className="display-wrapper">
                                        {DesktopPreview(this.state.nativeItems[this.state.nativeItems.length - 1])}
                                    </div>
                                    }
                                    {this.state.previewType === PREVIEW.TABLET &&
                                    <div className="tablet-wrapper">
                                        {TabletPreview(this.state.nativeItems[this.state.nativeItems.length - 1])}
                                    </div>
                                    }
                                    {this.state.previewType === PREVIEW.PHONE &&
                                    <div className="phone-wrapper">
                                        {PhonePreview(this.state.nativeItems[this.state.nativeItems.length - 1])}
                                    </div>
                                    }
                                </div>
                            </Col>
                            <Col span={1} className="icon-native-wrapper">
                                <Icon name={"cif-edit  icon-native"} onClick={() => {
                                    this.handlePreview(PREVIEW.DESKTOP);
                                }}/>
                                <Icon name={"cif-edit  icon-native"} onClick={() => {
                                    this.handlePreview(PREVIEW.TABLET);
                                }}/>
                                <Icon name={"cif-edit  icon-native"} onClick={() => {
                                    this.handlePreview(PREVIEW.PHONE);
                                }}/>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row type="flex">
                    <Col span={4}>
                        <RaisedButton
                            onClick={this.handleBack.bind(this)}
                            label={<Translate value="Back"/>}
                            primary={false}
                            className="button-back-step"
                            icon={<Icon name={"cif-arrowleft-4"} className={"back-arrow"}/>}
                        />
                    </Col>
                    <Col span={20}>
                        <RaisedButton
                            onClick={this.handleSubmit.bind(this)}
                            label={<Translate value="Next Step"/>}
                            primary={true}
                            className="button-next-step"
                            icon={<Icon name="cif-arrow-left" className={"arrow-next-step"}/>}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}

interface IOwnProps {
    match ?: any;
    history?: any;
}

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


export default Form.create<IProps>()(withRouter(NativeComponent as any));
