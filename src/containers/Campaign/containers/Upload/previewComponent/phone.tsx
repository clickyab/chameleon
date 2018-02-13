/**
 * @file Phone
 */
import * as React from "react";
import Translate from "../../../../../components/i18n/Translate";
import Icon from "../../../../../components/Icon";

export let PhonePreview = (item) => {
    return (
        <svg viewBox="0 0 250 509" version="1.1">
            <g id="Advertiser---Create-Campaign" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="XLarge-(Large-Desktop)" transform="translate(-277.000000, -355.000000)" fill="#EEEFF0">
                    <g id="step-6---if-camp-type-=-web" transform="translate(-19.000000, 124.000000)">
                        <g id="if-campaign-type-native" transform="translate(0.000000, 83.000000)">
                            <g id="iPhone" transform="translate(296.000000, 148.000000)">
                                <foreignObject x="25" y="25" width="80%" height="83%" style={{overflow: "hidden"}} >
                                    <div className="svg-phone-content-wrapper">
                                        <p className="sample-text">
                                            <Translate value={
                                                "\n" +
                                                "We Have Provided Advertisers And Publishers With Innovative And Creative Solutions On Web And Mobile. \n" +
                                                "\n" +
                                                "Clickyab Has +45 Employees And +600 Sale Experts Across Iran. According To The Ad Market Volume, Clickyab Is One Of The Biggest Technology Companies In Digital Advertising In Iran."}/>
                                        </p>
                                        <div className="clickyab-title">
                                            <div className="sub-title"><Translate value={"Post from all of web"}/></div>
                                            <Translate value={"clickyab"}/>
                                            <Icon name={"cif-cylogo-without-typo"}/>
                                        </div>
                                            <div className="add-container">
                                                <div className="add-item">
                                                    {item !== undefined &&
                                                    <div>
                                                        <img src={item.image} />
                                                        <p>{item.title}</p>
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
                                <path d="M248.490946,145.463511 L248.490946,480.12069 C248.490946,495.860805 235.731061,508.62069 219.990946,508.62069 L219.990946,508.62069 L30.0090543,508.62069 C14.268939,508.62069 1.50905433,495.860805 1.50905433,480.12069 L1.50905433,480.12069 L1.50905433,191.610556 C0.66981613,191.610556 0,190.934672 0,190.100928 L0,155.50031 C0,154.675759 0.675626635,153.990682 1.50905433,153.990682 L1.50905433,145.463511 C0.66981613,145.463511 0,144.787628 0,143.953883 L0,109.353265 C0,108.528715 0.675626635,107.843637 1.50905433,107.843637 L1.50905433,84.7701149 C0.66981613,84.7701149 0,84.0930654 0,83.2578824 L0,65.7168167 C0,64.8888361 0.675626635,64.2045841 1.50905433,64.2045841 L1.50905433,28.5 L1.50905433,28.5 C1.50905433,12.7598846 14.268939,6.44412596e-15 30.0090543,3.55271368e-15 L30.0090543,0 L219.990946,3.55271368e-15 C235.731061,6.61301393e-16 248.490946,12.7598846 248.490946,28.5 L248.490946,28.5 L248.490946,107.843637 C249.330184,107.843637 250,108.519521 250,109.353265 L250,143.953883 C250,144.778434 249.324373,145.463511 248.490946,145.463511 Z M16.5995976,61.6965925 L16.5995976,445.9209 L233.400402,445.9209 L233.400402,61.6965925 L16.5995976,61.6965925 Z M124.748491,493.071142 C135.305242,493.071142 143.863179,484.53736 143.863179,474.010406 C143.863179,463.483452 135.305242,454.94967 124.748491,454.94967 C114.19174,454.94967 105.633803,463.483452 105.633803,474.010406 C105.633803,484.53736 114.19174,493.071142 124.748491,493.071142 Z M124.748491,491.064749 C115.302977,491.064749 107.645875,483.429259 107.645875,474.010406 C107.645875,464.591553 115.302977,456.956063 124.748491,456.956063 C134.194005,456.956063 141.851107,464.591553 141.851107,474.010406 C141.851107,483.429259 134.194005,491.064749 124.748491,491.064749 Z M85.5130785,36.1150786 C87.7355523,36.1150786 89.5372233,34.3184928 89.5372233,32.102292 C89.5372233,29.8860913 87.7355523,28.0895055 85.5130785,28.0895055 C83.2906046,28.0895055 81.4889336,29.8860913 81.4889336,32.102292 C81.4889336,34.3184928 83.2906046,36.1150786 85.5130785,36.1150786 Z M125.251509,18.5591376 C126.640555,18.5591376 127.7666,17.4362715 127.7666,16.051146 C127.7666,14.6660205 126.640555,13.5431545 125.251509,13.5431545 C123.862463,13.5431545 122.736419,14.6660205 122.736419,16.051146 C122.736419,17.4362715 123.862463,18.5591376 125.251509,18.5591376 Z M107.140132,30.0958988 C106.0304,30.0958988 105.130785,30.9864662 105.130785,32.102292 C105.130785,33.2103924 106.027706,34.1086853 107.140132,34.1086853 L143.362886,34.1086853 C144.472618,34.1086853 145.372233,33.2181179 145.372233,32.102292 C145.372233,30.9941917 144.475312,30.0958988 143.362886,30.0958988 L107.140132,30.0958988 Z" id="Apple-iPhone-6-plus"></path>
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    );
};
