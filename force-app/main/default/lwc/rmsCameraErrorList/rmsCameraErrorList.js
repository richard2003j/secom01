/* eslint-disable vars-on-top */
/* eslint-disable no-alert */
/* eslint-disable eqeqeq */
/* eslint-disable camelcase */
import { LightningElement, api, track } from "lwc";
import { loadStyle } from "lightning/platformResourceLoader";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import RMS_Assets from "@salesforce/resourceUrl/RMS_Assets";
import getSightsCameraInfList from "@salesforce/apex/RMS_CameraErrorListCtrl.getSightsCameraInfList";
import getSightsCameraErrorInf from "@salesforce/apex/RMS_CameraErrorListCtrl.getSightsCameraErrorInf";
import updateSightsCameraErrorInf from "@salesforce/apex/RMS_CameraErrorListCtrl.updateSightsCameraErrorInf";

export default class RmsCameraErrorList extends LightningElement {
  // 画面で表示しているレコードID（自動で取得してくれる）
  @api recordId;

  // 画面設定パラメータ
  // タイトル表示フラグ
  @api showTitle;

  // lightning-datatableのカラム情報設定
  sightsCameraErrorColumns = [];

  // Sightsカメラ情報レコード
  @track sightsCameraInfList = [];
  // Sightsカメラ異常状態レコード
  @track sightsCameraErrorInf = null;
  // 表示用Sightsカメラ異常状態レコード
  @track sightsCameraErrorInfList = [];

  // 初期表示完了フラグ
  initialized = false;

  // インライン編集中の値
  draftValues = [];

  // 画面描画時にCallされるもの
  renderedCallback() {
    if (this.initialized) {
      return;
    }
    Promise.all([
      loadStyle(
        this,
        RMS_Assets + "/css/rmsCameraErrorList.css?t=" + new Date().getTime()
      )
    ])
      .then(() => {
        // 静的リソース読み込み完了
        this.initialized = true;

        // 初期処理を実行
        this.doInit();
      })
      .catch((error) => {
        console.log("error:" + error);
        this.showToast("エラー", "css読み込み失敗", "error", "pester");
      });
  }

  doInit() {
    //console.log('★' + 'doInit');
    this.getSightsCameraInfList();
  }

  /**
   * Sightsカメラ情報取得
   */
  getSightsCameraInfList() {
    //console.log('★' + 'getSightsCameraInfList');
    // Apexメソッドを直接呼び出す
    getSightsCameraInfList({
      recordId: this.recordId
    })
      .then((data) => {
        // 正常
        this.sightsCameraInfList = data;
        //console.log('★' + 'this.sightsCameraInfList');
        //console.log(JSON.stringify(this.sightsCameraInfList, null , "\t"));

        if (this.sightsCameraInfList.length > 0) {
          // Sightsカメラ情報が紐づいている場合、異常状態を取得
          this.getSightsCameraErrorInfList(this.sightsCameraInfList);
        }
      })
      .catch((error) => {
        // エラー
        console.log("error:" + error);
        this.showToast("エラー", error.message, "error", "pester");
      });
  }

  /**
   * Sightsカメラ異常状態取得
   */
  getSightsCameraErrorInfList(sightsCameraInf) {
    //console.log('★' + 'getSightsCameraErrorInfList');
    // Apexメソッドを直接呼び出す
    getSightsCameraErrorInf({
      sightsCameraInfList: sightsCameraInf
    })
      .then((data) => {
        // 正常
        if (data) {
          this.sightsCameraErrorInf = data;
          this.generateSightsCameraErrorResult(data);
        }
      })
      .catch((error) => {
        // エラー
        console.log("error:" + error.message);
        this.showToast("エラー", error.message, "error", "pester");
      });
  }

  /**
   * 表示用に整形
   */
  generateSightsCameraErrorResult(record) {
    var shock_column, signal_lost_column, tamper_column, temperature_column;
    this.sightsCameraErrorInfList = [];
    this.sightsCameraErrorColumns = [];
    let tmpRec = Object.assign({}, record);

    // 衝撃検知のカラム設定
    if (record.shock__c == 0) {
      // 異常なし
      tmpRec.shock = "異常なし";
      shock_column = {
        label: "衝撃検知",
        fieldName: "shock",
        hideDefaultActions: true
      };
    } else {
      // 異常あり
      tmpRec.shock = "異常あり";
      shock_column = {
        label: "衝撃検知",
        fieldName: "shock",
        cellAttributes: {
          iconName: "action:close"
        },
        hideDefaultActions: true,
        type: "button",
        typeAttributes: { label: "異常あり", name: "shock_recover" }
      };
    }

    // 映像入力ロストのカラム設定
    if (record.signal_lost__c == 0) {
      // 異常なし
      tmpRec.signal_lost = "異常なし";
      signal_lost_column = {
        label: "映像入力ロスト",
        fieldName: "signal_lost",
        hideDefaultActions: true
      };
    } else {
      // 異常あり
      tmpRec.signal_lost = "異常あり";
      signal_lost_column = {
        label: "映像入力ロスト",
        fieldName: "signal_lost",
        cellAttributes: {
          iconName: "action:close"
        },
        hideDefaultActions: true,
        type: "button",
        typeAttributes: { label: "異常あり", name: "signal_lost_recover" }
      };
    }

    // 画策検知のカラム設定
    if (record.tamper__c == 0) {
      // 異常なし
      tmpRec.tamper = "異常なし";
      tamper_column = {
        label: "画策検知",
        fieldName: "tamper",
        hideDefaultActions: true
      };
    } else {
      // 異常あり
      tmpRec.tamper = "異常あり";
      tamper_column = {
        label: "画策検知",
        fieldName: "tamper",
        cellAttributes: {
          iconName: "action:close"
        },
        hideDefaultActions: true,
        type: "button",
        typeAttributes: {
          label: "異常あり",
          name: "tamper_recover"
        }
      };
    }

    // 温度異常のカラム設定
    if (record.temperature__c == 0) {
      // 異常なし
      tmpRec.temperature = "異常なし";
      temperature_column = {
        label: "温度異常",
        fieldName: "temperature",
        hideDefaultActions: true
      };
    } else {
      // 異常あり
      tmpRec.temperature = "異常あり";
      temperature_column = {
        label: "温度異常",
        fieldName: "temperature",
        cellAttributes: {
          iconName: "action:close"
        },
        hideDefaultActions: true,
        type: "button",
        typeAttributes: { label: "異常あり", name: "temperature_recover" }
      };
    }
    this.sightsCameraErrorColumns.push(shock_column);
    this.sightsCameraErrorColumns.push(signal_lost_column);
    this.sightsCameraErrorColumns.push(tamper_column);
    this.sightsCameraErrorColumns.push(temperature_column);

    this.sightsCameraErrorInfList.push(tmpRec);
  }

  handleRowAction(event) {
    var tmpRec = Object.assign({}, this.sightsCameraErrorInf);
    var header;
    const actionName = event.detail.action.name;

    if (actionName === "shock_recover") {
      header = "衝撃検知";
      tmpRec.shock__c = 0;
    } else if (actionName === "signal_lost_recover") {
      header = "映像入力ロスト";
      tmpRec.signal_lost__c = 0;
    } else if (actionName === "tamper_recover") {
      header = "画策検知";
      tmpRec.tamper__c = 0;
    } else if (actionName === "temperature_recover") {
      header = "温度異常";
      tmpRec.temperature__c = 0;
    }

    if (window.confirm(header + "を「異常なし」に更新しますか？")) {
      this.updateSightsCameraErrorInf(tmpRec);
    }
  }

  /**
   * Sightsカメラ異常状態更新
   */
  updateSightsCameraErrorInf(record) {
    updateSightsCameraErrorInf({
      sigthsCameraErrorInf: record
    })
      .then((data) => {
        // 正常
        if (data) {
          this.sightsCameraErrorInf = data;
          this.generateSightsCameraErrorResult(data);
          this.showToast(
            "成功",
            "Sightsカメラ異常状態レコードの更新に成功しました。",
            "success",
            "pester"
          );
        } else {
          this.showToast(
            "エラー",
            "Sightsカメラ異常状態レコードの更新に失敗しました。",
            "error",
            "pester"
          );
        }
      })
      .catch((error) => {
        // エラー
        console.log("error:" + error.message);
        this.showToast("エラー", error.message, "error", "pester");
      });
  }

  /*
   *トーストによるメッセージ表示
   */
  showToast(title, message, varient, mode) {
    const event = new ShowToastEvent({
      title: title,
      message: message,
      variant: varient, //info/success/warning/error
      mode: mode //sticky クローズボタンを押すまで表示
      //pester 3秒間表示
      //dismissable sticky+pester
    });
    this.dispatchEvent(event);
  }

  /**
   * Objectの比較
   */
  isSameObject(obj1, obj2) {
    var obj1_keys = Object.keys(obj1);
    var obj2_keys = Object.keys(obj2);

    // キーの数を比較
    if (obj1_keys.length !== obj2_keys.length) {
      return false;
    }

    // 値を比較
    for (let k of obj1_keys) {
      if (obj1[k] !== obj2[k]) {
        return false;
      }
    }

    return true;
  }
}