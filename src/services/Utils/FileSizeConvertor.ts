import I18n from "../i18n/index";

const i18n = I18n.getInstance();

export default function FileSizeConvector(bytes: number, si?: boolean): string {
  const thresh = si === true ? 1000 : 1024;
  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }
  const units = si
    ? [ i18n._t("kB"), i18n._t("MB"), i18n._t("GB")]
    : [i18n._t("KiB"), i18n._t("MiB"), i18n._t("GiB")];
  let u = -1;
  do {
    bytes /= thresh;
    ++u;
  } while (Math.abs(bytes) >= thresh && u < units.length - 1);
  return bytes.toFixed(1) + " " + units[u];
}
