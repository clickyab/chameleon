import * as React from "react";
import * as ReactCrop from "react-image-crop";
import Spin from "antd/es/spin";

interface IProps {
  source: string;
  onChange: (file: Blob) => void;
  crop?: ICrop;
  aspect?: number;
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
}

export default class Cropper extends React.Component<IProps, IState> {
  sourceImage: any = null;
  imageRef: any = null;

  constructor(props: IProps) {
    super(props);
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
  }

  componentWillReceiveProps(props: IProps) {
    if (this.state.source !== props.source) {
      this.setState({
        source: props.source,
      }, this.loadImg);

    }
  }

  componentDidMount() {
    // this.imageRef.imageRef.setAttribute("crossorigin", "anonymous");
    this.loadImg();
  }

  cropImageSource(crop: ICrop) {
    this.getCroppedImg(crop, "file.jpg")
      .then(file => {
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
      this.cropImageSource(this.state.crop);

      let width = 80;
      let height = 80;
      if (this.props.aspect) {
        let Wshadow = 0.8 * img.width;
        let Hshadow = Wshadow / this.props.aspect;
        height = Hshadow / img.height * 100;
      }

      this.setState({
        crop: {
          x: 10,
          y: 10,
          width: width,
          height: height,
          aspect: this.props.aspect || null
        },
        loading: false,
      }, () => {
        this.cropImageSource(this.state.crop);
      });
    });
  }

  getCroppedImg(pixelCrop, fileName): Promise<Blob> {

    const canvas = document.createElement("canvas");
    canvas.width = pixelCrop.width * this.sourceImage.width / 100;
    canvas.height = pixelCrop.height * this.sourceImage.height / 100;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      this.sourceImage,
      pixelCrop.x * this.sourceImage.width / 100,
      pixelCrop.y * this.sourceImage.height / 100,
      pixelCrop.width * this.sourceImage.width / 100,
      pixelCrop.height * this.sourceImage.height / 100,
      0,
      0,
      pixelCrop.width * this.sourceImage.width / 100,
      pixelCrop.height * this.sourceImage.height / 100,
    );

    // As a blob
    return new Promise((resolve, reject) => {
        canvas.toBlob((file: any) => {
          if (file)
            file.name = fileName;
          console.log(file);
          resolve(file);
        }, "image/jpeg");
      }
    );
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
            onChange={(crop: ICrop) => {
              this.setState({crop}, () => {
                this.cropImageSource(crop);
              });
            }}
          />
        </Spin>
      </div>
    );
  }

}
