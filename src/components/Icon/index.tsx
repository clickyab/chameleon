/**
 * @file Icon directive
 * @desc Placeholder For Icons - also convert them
 * @example <Icon value="arrow" />
 */
import * as React from "react";


/**
 * props interface
 */
interface IconProps {
    value: string ;
}

export default class Icon extends React.Component<IconProps, null> {

    /**
     * render span element with converted Icon
     * @returns {any}
     */
    public render() {
        return (
            <span>
           </span>
        );
    }
}
