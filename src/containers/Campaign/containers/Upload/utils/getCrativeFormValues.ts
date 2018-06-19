import {ControllersCreateBannerResponseInner} from "../../../../../api/api";

interface ICreativeFormValues {
    cta?: string;
    description?: string;
    downloads?: number;
    imageHorizontalUrl?: string;
    iconUrl?: string;
    phone?: number;
    price?: number;
    salePrice?: string;
    title?: string;
    imageVerticalUrl?: string;

    id?: number;
    maxBid?: number;
    adName?: string;
    utm?: string;

    videoUrl?: string;
    logoUrl?: string;
    rating?: number;
}


export default function (creative: ControllersCreateBannerResponseInner): ICreativeFormValues {
    let values: ICreativeFormValues = {};

    if (!creative || !creative.creative) {
        return {};
    }

    if (creative.assets.cta) values.cta = creative.assets.cta[0]["val"];
    if (creative.assets.description) values.description = creative.assets.description[0]["val"];
    if (creative.assets.downloads) values.downloads = creative.assets.downloads[0]["val"];
    if (creative.assets.h_image) values.imageHorizontalUrl = creative.assets.h_image[0]["val"];
    if (creative.assets.icon) values.iconUrl = creative.assets.icon[0]["val"];
    if (creative.assets.phone) values.phone = creative.assets.phone[0]["val"];
    if (creative.assets.price) values.price = creative.assets.price[0]["val"];
    if (creative.assets.saleprice) values.salePrice = creative.assets.saleprice[0]["val"];
    if (creative.assets.title) values.title = creative.assets.title[0]["val"];
    if (creative.assets.v_image) values.imageVerticalUrl = creative.assets.v_image[0]["val"];

    if (creative.creative.id) values.id = creative.creative.id;
    if (creative.creative.max_bid) values.maxBid = creative.creative.max_bid;
    if (creative.creative.name) values.adName = creative.creative.name;
    if (creative.creative.url) values.utm = creative.creative.url;

    if (creative.assets.rating) values.rating = parseFloat(creative.assets.rating[0]["val"]);
    if (creative.assets.logo) values.logoUrl = creative.assets.logo[0]["val"];
    if (creative.assets.video) values.logoUrl = creative.assets.video[0]["val"];

    return values;
}
