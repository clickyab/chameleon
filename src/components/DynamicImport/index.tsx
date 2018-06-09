import * as React from "react";

interface IState {
    Rendercomponent?: any;
}
interface IProps {
    load: () => Promise<any>;
    children?: any;
}


export default class DynamicImport extends  React.Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
            Rendercomponent: null
        };
    }

    componentDidMount () {
        this.props.load()
            .then((component) => {
                this.setState(() => ({
                    Rendercomponent: component.default ? component.default : component
                }));
            });
    }

    public render() {
        return (
                this.props.children(this.state.Rendercomponent)
        );
    }
}
