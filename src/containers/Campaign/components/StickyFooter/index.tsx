/**
 * @file Sticky Footer on create campaign,
 * can change to any kind of footer from now on
 */
import * as React from "react";
import {RaisedButton} from "material-ui";
import "./style.less";
import Translate from "../../../../components/i18n/Translate";
import Icon from "../../../../components/Icon";
import CONFIG from "../../../../constants/config";
import I18n from "../../../../services/i18n";
import {RootState} from "../../../../redux/reducers";
import {connect} from "react-redux";

/**
 * @interface IProps
 * @param {backBtn} is there back button on footer
 * @param {nextAction} get function for next button  onclick action
 * @param {nextTitle} get extra text for appending to next button
 * @param {backAction} get get function for back button  onclick action
 */
interface IProps {
    backBtn?: boolean;
    nextAction: any;
    nextTitle?: string;
    backAction?: any;
    disable?: boolean;
    customClass?: string;
    menuCollapse?: boolean;
}
interface IState {
    collapse: boolean;
}

/**
 * @calss StickyFooter class
 * @desc render forward and back buttons
 */
@connect(mapStateToProps)
class StickyFooter extends React.Component<IProps, IState> {
    /**
     * i18n instance
     * @type {I18n}
     */
    i18n = I18n.getInstance();
   constructor(props) {
       super(props);
       this.state = {
           collapse : props.menuCollapse
       };
   }
    componentWillReceiveProps(nexProps) {
            if (nexProps.menuCollapse === true) {
              this.setState({collapse: true});
           } else {
               this.setState({collapse: false});
           }
   }
   render() {
       return(
           <div dir={CONFIG.DIR} className={`sticky-footer ${this.props.customClass ? this.props.customClass : ""}`}>
               <div className={`footer-content ${this.state.collapse ? "footer-collapsed" : ""}`}>
               {this.props.backBtn !== false && this.props.backAction &&
               <RaisedButton
                   onClick={this.props.backAction}
                   label={this.i18n._t("Back")}
                   primary={false}
                   className="button-back-step"
                   icon={<Icon name={"cif-arrowleft-4"} className={"back-arrow"}/>}
               />
               }
                   <RaisedButton
                       onClick={this.props.nextAction}
                       label={`${this.i18n._t("Next Step")}${(this.props.nextTitle) ? " - " + this.i18n._t(this.props.nextTitle) : "" }`}
                       primary={true}
                       disabled={this.props.disable}
                       className="button-next-step"
                       icon={<Icon name="cif-arrow-left" className={"arrow-next-step"}/>}
                   />
               </div>
           </div>
       );
   }
}
/**
 * @func map Redux store state as component's props
 * @param {RootState} state
 * @param  ownProps
 * @returns {{menuCollapse: boolean}}
 */
function mapStateToProps(state: RootState, ownProps) {
    return {
        menuCollapse: state.app.menuCollapse,
    };
}
export default StickyFooter;