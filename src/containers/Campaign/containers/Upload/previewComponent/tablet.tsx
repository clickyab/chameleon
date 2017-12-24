/**
 * @file Tablet
 */
import * as React from "react";
import Translate from "../../../../../components/i18n/Translate";
import Icon from "../../../../../components/Icon";

export let TabletPreview = (item) => {
    return (
        <svg viewBox="0 0 400 594" version="1.1">
            <g id="Advertiser---Create-Campaign" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="XLarge-(Large-Desktop)" transform="translate(-237.000000, -323.000000)" fill="#EEEFF0">
                    <g id="step-6---if-camp-type-=-web" transform="translate(16.000000, 92.000000)">
                        <g id="if-campaign-type-native" transform="translate(0.000000, 83.000000)">
                            <g id="iPad" transform="translate(221.000000, 148.000000)">
                                <foreignObject x="25" y="50" width="88%" height="80%" style={{overflow: "hidden"}} >
                                    <div className="svg-tablet-content-wrapper">
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
                                <path d="M369.629606,0 L30.370394,0 C13.624547,0 0,13.6283444 0,30.3807548 L0,562.811585 C0,579.563145 13.624547,593.191489 30.370394,593.191489 L369.629606,593.191489 C386.375453,593.191489 400,579.563145 400,562.811585 L400,30.3807548 C400,13.6283444 386.375453,0 369.629606,0 M203.915867,32.7206148 C203.915867,34.8835605 202.162633,36.6373923 200.000425,36.6373923 C197.838217,36.6373923 196.084983,34.8835605 196.084983,32.7206148 C196.084983,30.557669 197.838217,28.8038373 200.000425,28.8038373 C202.162633,28.8038373 203.915867,30.557669 203.915867,32.7206148 L203.915867,32.7206148 Z M214.80003,562.611706 C214.80003,554.43538 208.173963,547.807053 200.000425,547.807053 C191.826887,547.807053 185.20082,554.43538 185.20082,562.611706 C185.20082,570.788032 191.826887,577.41636 200.000425,577.41636 C208.173963,577.41636 214.80003,570.788032 214.80003,562.611706 L214.80003,562.611706 Z M213.071163,562.611706 C213.071163,555.390525 207.219143,549.536509 200.000425,549.536509 C192.781707,549.536509 186.929687,555.390525 186.929687,562.611706 C186.929687,569.832887 192.781707,575.686903 200.000425,575.686903 C207.219143,575.686903 213.071163,569.832887 213.071163,562.611706 L213.071163,562.611706 Z M377.52766,59.2994162 C378.05397,59.2994162 378.482501,59.7280928 378.482501,60.2545826 L378.482501,531.874571 C378.482501,532.401061 378.05397,532.829738 377.52766,532.829738 L23.004602,532.829738 C22.4782918,532.829738 22.0497614,532.401061 22.0497614,531.874571 L22.0497614,60.2545826 C22.0497614,59.7280928 22.4782918,59.2994162 23.004602,59.2994162 L377.52766,59.2994162" id="iPad-air"></path>
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    );
};