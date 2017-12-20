/**
 * @file Desktop
 */
import * as React from "react";
import Translate from "../../../../../components/i18n/Translate";
import Icon from "../../../../../components/Icon";

export let DesktopPreview = (item) => {
    return (
        <svg viewBox="0 0 700 558" version="1.1">
            <g id="Advertiser---Create-Campaign" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="XLarge-(Large-Desktop)" transform="translate(-105.000000, -323.000000)" fill="#EEEFF0">
                    <g id="step-6---if-camp-type-=-web" transform="translate(16.000000, 92.000000)">
                        <g id="if-campaign-type-native" transform="translate(0.000000, 83.000000)">
                            <g id="iMac" transform="translate(89.000000, 148.000000)">
                                <foreignObject x="25" y="24" width="93%" height="80%" style={{overflow: "hidden"}} >
                                    <div className="svg-display-content-wrapper">
                                        <p className="sample-text">
                                            <Translate value={"Founded In May 2014 In Tehran; Clickyab Is A Young Business With The Highest Standards In Iran And Displays More Than Three Billion Ads Every Month. \n" +
                                            "\n" +
                                            "Clickyab Was Founded In May 2014 In Tehran; It Is A Young Business And The Only Platform That Has Launched The “Bidding Pricing” System With The Highest Standards In Iran And Displays More Than Three Billion Ads Every Month. \n" +
                                            "\n" +
                                            "We Have Provided Advertisers And Publishers With Innovative And Creative Solutions On Web And Mobile. \n" +
                                            "\n" +
                                            "Clickyab Has +45 Employees And +600 Sale Experts Across Iran. According To The Ad Market Volume, Clickyab Is One Of The Biggest Technology Companies In Digital Advertising In Iran."}/>
                                        </p>
                                        <div className="clickyab-title">
                                            <div className="sub-title"><Translate value={"Post from all of web"}/></div>
                                            <Translate value={"Recomended by clickyab"}/>
                                            <Icon name={"cif-cylogo-without-typo"}/>
                                        </div>
                                        <div className="native-content">
                                            <div className="add-container">
                                                <div className="add-item">
                                                    {item !== undefined &&
                                                    <div>
                                                        <img src={item.img_url} />
                                                        <p>{item.description}</p>
                                                    </div>
                                                    }
                                                    {item === undefined &&
                                                    <div>
                                                        <div className="placeholder-native"><Translate value={"Image of your add"}/>
                                                        </div>
                                                        <p>Lorem ipsum dolor sit amet.</p>
                                                    </div>
                                                    }
                                                </div>
                                            </div>
                                            <div className="add-container">
                                                <div className="add-item">
                                                    <img src="http://via.placeholder.com/170x105" />
                                                    <p>Lorem ipsum dolor sit amet.</p>
                                                </div>
                                            </div>
                                            <div className="add-container">
                                                <div className="add-item">
                                                    <img src="http://via.placeholder.com/170x105" />
                                                    <p>Lorem ipsum dolor sit amet.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="sample-text mt-1">
                                            <Translate value={"Founded In May 2014 In Tehran; Clickyab Is A Young Business With The Highest Standards In Iran And Displays More Than Three Billion Ads Every Month. \n" +
                                            "\n" +
                                            "Clickyab Was Founded In May 2014 In Tehran; It Is A Young Business And The Only Platform That Has Launched The “Bidding Pricing” System With The Highest Standards In Iran And Displays More Than Three Billion Ads Every Month. \n" +
                                            "\n" +
                                            "We Have Provided Advertisers And Publishers With Innovative And Creative Solutions On Web And Mobile. \n" +
                                            "\n" +
                                            "Clickyab Has +45 Employees And +600 Sale Experts Across Iran. According To The Ad Market Volume, Clickyab Is One Of The Biggest Technology Companies In Digital Advertising In Iran."}/>
                                        </p>
                                    </div>
                                </foreignObject>
                                <path d="M263.967508,552.978056 C269.967501,551.703102 274.637589,546.672352 275.263323,540.344828 L281.006854,481.818182 L17.8683386,481.818182 C7.99992767,481.818182 0,473.818254 0,463.949843 L0,17.8683386 C0,7.99992767 7.99992767,0 17.8683386,0 L682.131661,0 C692.000072,0 700,7.99992767 700,17.8683386 L700,463.949843 C700,473.818254 692.000072,481.818182 682.131661,481.818182 L418.993146,481.818182 L424.736677,540.344828 C425.362411,546.672352 430.032499,551.703102 436.032492,552.978056 L475.39185,552.978056 L475.39185,557.99373 L224.60815,557.99373 L224.60815,552.978056 L263.967508,552.978056 Z M350,9.87460815 C348.78809,9.87460815 347.805643,10.8570554 347.805643,12.0689655 C347.805643,13.2808756 348.78809,14.2633229 350,14.2633229 C351.21191,14.2633229 352.194357,13.2808756 352.194357,12.0689655 C352.194357,10.8570554 351.21191,9.87460815 350,9.87460815 L350,9.87460815 Z M342.163009,12.0689655 C342.163009,11.5495755 341.741961,11.1285266 341.222571,11.1285266 C340.70318,11.1285266 340.282132,11.5495755 340.282132,12.0689655 C340.282132,12.5883556 340.70318,13.0094044 341.222571,13.0094044 C341.741961,13.0094044 342.163009,12.5883556 342.163009,12.0689655 Z M418.993146,481.818182 L418.962382,481.504702 L281.037618,481.504702 L281.006854,481.818182 L418.993146,481.818182 Z M263.967508,552.978056 C262.999737,553.183701 261.997366,553.291634 260.971787,553.291536 L439.028213,553.291536 C438.002634,553.291634 437.000263,553.183701 436.032492,552.978056 L263.967508,552.978056 Z M682.439067,23.0343726 L17.5609326,23.0343726 L17.5609326,459 L682.439067,459 L682.439067,23.0343726 Z" id="Combined-Shape"></path>
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    );
};