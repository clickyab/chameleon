/**
 * @file Icon directive
 * @desc Placeholder For Icons - also convert them
 * @example <Icon value="arrow" />
 */
import * as React from "react";
import Colors = __MaterialUI.Styles.Colors;


/**
 * props interface
 */
interface IProps {
    name: string ;
    color?: string;
    className?: string ;
    fontsize?: number;
    onClick?: React.MouseEventHandler<any>;
}
/**
 * will map icons with source file
 * @param {string} get name
 */


export default class Icon extends React.Component<IProps, null> {
    /**
     * render span element with converted Icon
     * @returns {any}
     */

    public render() {
        return (
            <i onClick={this.props.onClick}
               className={`${(this.props.className) ? ( this.props.className + " " ) : ""}${this.props.name}`}
               style={{ color: this.props.color , fontSize: this.props.fontsize}}  />
        );
    }
}

