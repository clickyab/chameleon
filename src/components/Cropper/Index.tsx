import * as React from "react";
import * as ReactCrop from "react-image-crop";
import Spin from "antd/es/spin";
import FileSizeConvector from "../../services/Utils/FileSizeConvertor";
import debounce from "../../services/Utils/debounce";


interface IProps {
    source: string;
    onChange?: (file: Blob) => void;
    crop?: ICrop;
    aspect?: number;
    type?: string;
    width?: number;
    minWidth?: number;
    maxWidth?: number;
    height?: number;
    minHeight?: number;
    maxHeight?: number;
}

interface ICrop {
    x: number;
    y: number;
    width: number;
    height: number;
    aspect?: number;
}

interface IState {
    crop?: ICrop;
    source: string;
    preView?: string;
    loading: boolean;
    selectedWidth?: number;
    selectedHeight?: number;
    fileSize?: number;

}

export default class Cropper extends React.Component<IProps, IState> {
    sourceImage: any = null;
    imageRef: any = null;
    type: string;

    constructor(props: IProps) {
        super(props);
        this.type = props.type || "image/png";
        this.state = {
            loading: true,
            source: props.source,
            crop: {
                x: 10,
                y: 10,
                width: 60,
                height: this.props.aspect ? 60 / this.props.aspect : 100,
                aspect: this.props.aspect || null
            }
        };

        this.cropImageSource = debounce(this.cropImageSource.bind(this), 100);
    }

    componentWillReceiveProps(props: IProps) {
        if (this.state.source !== props.source) {
            this.setState({
                source: props.source,
            }, this.loadImg);

        }
    }

    componentDidMount() {
        this.loadImg();
    }

    cropImageSource(crop: ICrop) {
        this.getCroppedImg(crop)
            .then(file => {
                this.setState({
                    selectedWidth: Math.round(crop.width * this.sourceImage.width / 100),
                    selectedHeight: Math.round(crop.height * this.sourceImage.height / 100),
                    fileSize: file.size
                });
                if (this.props.onChange) {
                    this.props.onChange(file);
                }
            });
    }

    loadImg() {
        this.setState({
            loading: true,
        });
        const img = new Image();
        img.setAttribute("crossorigin", "anonymous");

        // fixme:: remove this fu**ing bullshit after fix cors
        img.src = this.state.source;
        img.addEventListener("load", () => {
            this.sourceImage = img;
            // this.cropImageSource(this.state.crop);

            let width = 80;
            let height = 80;

            if (this.props.aspect && this.sourceImage.width <= this.sourceImage.height) {
                height = this.props.aspect * this.sourceImage.width * 80 / this.sourceImage.height;
            } else if (this.props.aspect && this.sourceImage.width > this.sourceImage.height) {
                width = this.props.aspect * this.sourceImage.height * 80 / this.sourceImage.width;
            }

            this.setState({
                crop: {
                    x: 10,
                    y: 10,
                    width: this.props.aspect ? width : 80,
                    height: this.props.aspect ? height : 80,
                    aspect: this.props.aspect || null,
                },
                selectedWidth: width * this.sourceImage.width / 100,
                selectedHeight: height * this.sourceImage.height / 100,
                loading: false,
            }, () => {
                this.cropImageSource(this.state.crop);
            });
        });
    }

    getCroppedImg(pixelCrop): Promise<Blob> {

        const canvas = document.createElement("canvas");
        canvas.width = this.resizeToWidth(pixelCrop.width * this.sourceImage.width / 100);
        canvas.height = this.resizeToHeight(pixelCrop.height * this.sourceImage.height / 100);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(
            this.sourceImage,
            pixelCrop.x * this.sourceImage.width / 100,
            pixelCrop.y * this.sourceImage.height / 100,
            pixelCrop.width * this.sourceImage.width / 100,
            pixelCrop.height * this.sourceImage.height / 100,
            0,
            0,
            this.resizeToWidth(pixelCrop.width * this.sourceImage.width / 100),
            this.resizeToHeight(pixelCrop.height * this.sourceImage.height / 100),
        );
        // As a blob
        return new Promise((resolve, reject) => {
                canvas.toBlob((file: any) => {
                    if (file) file.name = "file." + this.extentionGenerate(this.type);
                    resolve(file);
                }, this.type);
            }
        );
    }

    private resizeToWidth(originalSelectedWidth: number): number {
        if (this.props.width) {
            return this.props.width;
        }
        if (this.props.minWidth && this.props.minWidth >= originalSelectedWidth) {
            return this.props.minWidth;
        }
        if (this.props.maxWidth && this.props.maxWidth <= originalSelectedWidth) {
            return this.props.maxWidth;
        }
        return originalSelectedWidth;
    }

    private resizeToHeight(originalSelectedHeight: number): number {
        if (this.props.height) {
            return this.props.height;
        }
        if (this.props.minHeight && this.props.minHeight >= originalSelectedHeight) {
            return this.props.minHeight;
        }
        if (this.props.maxHeight && this.props.maxHeight <= originalSelectedHeight) {
            return this.props.maxHeight;
        }
        return originalSelectedHeight;
    }

    extentionGenerate(type): string {
        switch (type) {
            case "image/png":
                return "png";
            case "image/jpeg":
                return "jpg";
        }
    }

    render() {
        return (
            <div>
                <Spin spinning={this.state.loading}>
                    <ReactCrop
                        ref={(input) => {
                            this.imageRef = input;
                        }}
                        src={this.state.source}
                        crop={this.state.crop}
                        onDragEnd={(status) => {
                            console.log(status);
                        }}
                        onChange={(crop: ICrop) => {
                            this.setState({crop}, () => {
                                this.cropImageSource(crop);
                            });
                        }}
                    />
                    {this.state.selectedWidth} × {this.state.selectedHeight} px
                    <br/>
                    {FileSizeConvector(this.state.fileSize)}
                </Spin>
            </div>
        );
    }

}
