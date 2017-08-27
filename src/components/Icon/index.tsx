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
interface IconProps {
    name: string ;
    color?: string;
    className?: string ;
}

let iconMap: string[] = [] ;
iconMap["arrow"] = "arrow";
/**
 * will map icons with source file
 * @param {string} get name
 */


export default class Icon extends React.Component<IconProps, null> {
    /**
     * render span element with converted Icon
     * @returns {any}
     */

    public render() {
        let IconConvert: string = iconMap[this.props.name] ? iconMap[this.props.name] : this.props.name;
        return (
            <span className={`${(this.props.className) ? ( this.props.className ) : ""} ${iconMap}`} style={{ color: this.props.color }}>®</span>
        );
    }
}

