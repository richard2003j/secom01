import { LightningElement, api, wire } from "lwc";
import { getRecord, getFieldValue } from "lightning/uiRecordApi";
// 3Qデモ用に静的リソースから固定で画像読み込み
import cameraNomalViewUrl from "@salesforce/resourceUrl/RMS_CameraNormalView";

const DEVICE_MNG_ID = "DEVICE_MNG__x.device_mng_id__c";
const deviceFields = [DEVICE_MNG_ID];

export default class RmsCameraNomalStatus extends LightningElement {
  // 画面で表示しているレコードID
  @api recordId;

  // 画面設定パラメータ
  // タイトル表示フラグ
  @api showTitle;
  // 画像サイズ(幅)
  @api imageSize;

  // 3Qデモ用に静的リソースから固定で画像読み込み
  cameraNomalViewImage;
  notFoundViewImage = cameraNomalViewUrl + "/no-image.png";

  device_mng_id;
  @wire(getRecord, { recordId: "$recordId", fields: deviceFields })
  loadDeviceMng({ error, data }) {
    if (error) {
      //TODO: handle error
    } else if (data) {
      this.device_mng_id = getFieldValue(data, DEVICE_MNG_ID);
      console.log("device_mng_id: " + this.device_mng_id);
      this.cameraNomalViewImage =
        cameraNomalViewUrl + "/" + this.device_mng_id + ".png";
    }
  }

  getErrorImage() {
    return (this.cameraNomalViewImage = cameraNomalViewUrl + "/no-image.png");
  }
}