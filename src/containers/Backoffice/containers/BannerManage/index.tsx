///<reference path="../../../../../node_modules/@types/react-router/index.d.ts"/>
import * as React from "react";
import {RouteComponentProps, withRouter} from "react-router";
import {connect} from "react-redux";
import {RootState} from "../../../../redux/reducers/index";
import I18n from "../../../../services/i18n/index";
import {ControllersApi, OrmCampaign, UserResponseLoginOKAccount} from "../../../../api/api";
import {Form, Row, Col, Button, Modal} from "antd";
import {setIsLogin, setUser} from "../../../../redux/app/actions/index";
import CONFIG from "../../../../constants/config";
import Translate from "../../../../components/i18n/Translate";
import Icon from "../../../../components/Icon";
import {setBreadcrumb} from "../../../../redux/app/actions";
import DataTable from "../../../../components/DataTable";
import {IActionsFn} from "../../../../components/DataTable/lib/interfaces"
import Cropper from "../../../../components/Cropper/Index";
import {setCurrentCampaign, setCurrentStep, setSelectedCampaignId} from "../../../../redux/campaign/actions";
import STEPS from "../../../Campaign/steps";
import {IFileItem} from "../../../Campaign/containers/Upload/UploadBanner";
import {UPLOAD_STATUS} from "../../../../services/Upload";

const FormItem = Form.Item;

interface IProps extends RouteComponentProps<void> {
  form: any;
  setBreadcrumb: (name: string, title: string, parent: string) => void;
  setCurrentCampaign: (campaign: OrmCampaign) => void;
  currentCampaign: OrmCampaign;
  setCurrentStep: (step: STEPS) => {};
  setSelectedCampaignId: (id: number | null) => {};
  currentStep: STEPS;
}

interface IState {
  currentCampaign?: OrmCampaign;
  approveModal: boolean;
  files?: IFileItem[];
}


@connect(mapStateToProps, mapDispatchToProps)
class ApproveRejectBanners extends React.Component<IProps, IState> {

  private i18n = I18n.getInstance();
  private controllerApi = new ControllersApi();
  private actionsFn: IActionsFn = {};

  constructor(props: IProps) {
    super(props);
    this.state = {approveModal: false};
  }

  public componentDidMount() {
    this.props.setBreadcrumb("approveBanner", this.i18n._t("Approve or reject banners").toString(), "home");
  }

  public loadBanners() {
    const controllerApi = new ControllersApi();
    console.log("camaping" , this.state.currentCampaign);
    controllerApi.campaignGetIdAdGet({
      id: this.state.currentCampaign.id.toString(),
    }).then((list) => {
      let files: IFileItem[] = [];
      list.map((item) => {
        let file: IFileItem = {
          id: item.id,
          utm: item.target,
          height: item.height,
          width: item.width,
          name: `${this.state.currentCampaign.title} ${item.width}x${item.width}`,
          state: {
            status: UPLOAD_STATUS.FINISHED,
            progress: 100,
            url: item.src,
          },
          // TODO
          cta: "",
        };
        files.push(file);
      });
      this.setState({
        files
      }, () => {
      });
    });
  }
  public render() {
    this.actionsFn["Approve/Reject"] = approveReject.bind(this);
    return (
      <Row className={"content-container"}>
        <Col>
          <div dir={CONFIG.DIR}>
            <Row className="mb-2">
              <h3><Translate value={"Approve or reject banner"}/></h3>
              <span><Translate value={"You can approve/reject advertisment in this page"}/></span>
            </Row>
              <DataTable
                name="approveBanner"
                disableSearch={true}
                dataFn={this.controllerApi.campaignListGet}
                actionsFn={this.actionsFn}
                definitionFn={this.controllerApi.campaignListDefinitionGet}/>
          </div>
        </Col>
        <Modal
          maskClosable={false}
          closable={false}
          title={this.i18n._t("Approve/Reject Banner").toString()}
          visible={this.state.approveModal}
          footer={<Button type={"primary"} onClick={() => {this.setState({approveModal : false}); }}>{this.i18n._t("Approve")}</Button>}>
          <div>
          </div>
        </Modal>
      </Row>
    );
  }
}
const approveReject = function ApproveReject(value, record, index) {
  this.props.setSelectedCampaignId(record.id);
  const api = new ControllersApi();
  api.campaignGetIdGet({id: record.id})
    .then((campaign) => {
      this.setState({
        currentCampaign: campaign,
      }, () => {
        this.loadBanners();
      });
      this.props.setCurrentCampaign(campaign as OrmCampaign);
    });
  this.setState({approveModal: true});
  console.log("files", this.state.files);
};
function mapStateToProps(state: RootState) {
  return {
    isLogin: state.app.isLogin,
    user: state.app.user,
    currentStep: state.campaign.currentStep,
    currentCampaign: state.campaign.currentCampaign,
    selectedCampaignId: state.campaign.selectedCampaignId,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setUser: (user: UserResponseLoginOKAccount) => dispatch(setUser(user)),
    setIsLogin: () => dispatch(setIsLogin()),
    setCurrentStep: (step: STEPS) => dispatch(setCurrentStep(step)),
    setSelectedCampaignId: (id: number | null) => dispatch(setSelectedCampaignId(id)),
    setCurrentCampaign: (campaign: OrmCampaign) => dispatch(setCurrentCampaign(campaign)),
    setBreadcrumb: (name: string, title: string, parent: string) => dispatch(setBreadcrumb({name, title, parent})),
  };
}

export default Form.create()(withRouter(ApproveRejectBanners as any));
