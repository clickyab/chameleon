import * as React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import {RootState} from "../../../../redux/reducers/index";
import {Form} from "antd";
import {Row, Switch, Col} from "antd";
import I18n from "../../../../services/i18n/index";
import {Select} from "antd";
import CONFIG from "../../../../constants/config";
import {
  ControllersApi, ControllersWhiteBlackLists, ControllersWhiteBlackListsInner,
  OrmCampaign
} from "../../../../api/api";
import DataTable from "../../../../components/DataTable/index";

import {setBreadcrumb} from "../../../../redux/app/actions/index";
import Modal from "../../../../components/Modal/index";
import Icon from "../../../../components/Icon/index";
import Translate from "../../../../components/i18n/Translate/index";
import {TextField} from "material-ui";

const Option = Select.Option;

const FormItem = Form.Item;


interface IOwnProps {
  match?: any;
  history?: any;
}

interface IProps {
  match: any;
  history: any;
  setBreadcrumb: (name: string, title: string, parent: string) => void;
  onEditListClick?: (list: ControllersWhiteBlackListsInner) => void;
}

interface IState {
  listName: string;
  whiteList: boolean;
  listOFLists?: ControllersWhiteBlackLists;
  listID?: number;
  updateList: boolean;
  openArchiveModal: boolean;
  copyListName: string;
  copyListNameError: string;
}


@connect(mapStateToProps, mapDispatchToProps)
class ListOfInventories extends React.Component <IProps, IState> {

  private i18n = I18n.getInstance();
  private checkedItems = [];
  private controllerApi = new ControllersApi();

  constructor(props: IProps) {
    super(props);
    this.state = {
      openArchiveModal: false,
      listName: "",
      whiteList: true,
      listOFLists: [],
      updateList: false,
      copyListName: "",
      copyListNameError: null,
    };
  }

  public componentDidMount() {
    this.props.setBreadcrumb("explore", this.i18n._t("Explore").toString(), "home");
    this.controllerApi.inventoryPresetsGet({})
      .then(data => {
        this.setState({
          listOFLists: data,
        });
      });
  }


  /**
   * @func
   * @description handle select publisher list's items
   * @param {string[]} keys
   * @param {any[]} rows
   */
  onSelectRow(keys: string[], rows: any[]) {
    this.checkedItems = keys;
  }

  public render() {
    return (
      <div dir={CONFIG.DIR}>

        <Row type="flex" align="middle">
          <DataTable
            infinite={true}
            name="publisherList"
            onSelectRow={this.onSelectRow.bind(this)}
            definitionFn={this.controllerApi.inventoryListDefinitionGet}
            dataFn={this.controllerApi.inventoryListGet}
            actionsFn={{
              "edit": (v, r) => {
                console.log(r);
                this.props.onEditListClick(r);
              },
              "archive": (v, r) => {
                console.log(r);
                this.setState({openArchiveModal: true});
              }
            }}
            customRenderColumns={{
              "status": (value: string): JSX.Element => {
                let switchValue = value ? true : false;
                return <div><Switch className={CONFIG.DIR === "rtl" ? "switch-rtl" : "switch"}
                                    checked={switchValue}/></div>;
              }
            }}
          />
        </Row>
        <Modal title={null}
               type={"prompt"}
               okText={this.i18n._t("Yes").toString()}
               okType={"danger"}
               visible={this.state.openArchiveModal}
               onOk={() => {
                 this.setState({openArchiveModal: false});
               }}
               onCancel={() => {
                 this.setState({openArchiveModal: false});
               }}
        >
          <Row>
            <Col span={20}>
              <div>
                <Translate value={"Are you sure about remove <b>\"%s\"</b>?"} html={true} params={["sss"]}/>
              </div>
              <div>
                <Translate value={"You can't undo this action after confirm."}/>
              </div>
            </Col>
            <Col span={4}>
              <Icon name={"cif-edit"} fontsize={30}/>
            </Col>
          </Row>
        </Modal>
        <Modal title={this.i18n._t("Create a copy from: %s", {params: ["sss"]})}
               okText={this.i18n._t("Save").toString()}
               visible={this.state.openArchiveModal}
               mask={true}
               style={{maxWidth: "370px"}}
               onOk={() => {

                 if (this.state.copyListName.length <= 8) {
                   this.setState({
                     copyListNameError: this.i18n._t("The name is too short.").toString(),
                   });
                 } else {
                   this.setState({
                     openArchiveModal: false,
                     copyListNameError: null,
                     copyListName: "",
                   });
                 }

               }}
               onCancel={() => {
                 this.setState({
                   openArchiveModal: false,
                   copyListNameError: null,
                   copyListName: "",
                 });
               }}
        >
          <Row>
            <Col span={24} className={"mt-1"}>
              <TextField
                fullWidth={true}
                errorText={this.state.copyListNameError}
                hintText={this.i18n._t("Input a name for new list...")}
                autoFocus={true}
                onChange={(event, val) => {
                  this.setState({
                    copyListName: val,
                  });
                }}
              />
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }
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
    setBreadcrumb: (name: string, title: string, parent: string) => dispatch(setBreadcrumb({name, title, parent})),
  };
}

export default withRouter(ListOfInventories as any);
