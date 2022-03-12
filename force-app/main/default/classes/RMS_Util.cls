public with sharing class RMS_Util {
  /**
   * 機器管理レコードの取得
   * device_mng_id__c を使用したいため取得している
   *
   * @param recordId 画面表示している機器管理レコードのId
   * @return 画面表示している機器管理レコードList（1件のみ）
   */
  public static List<DEVICE_MNG__x> getDeviceMng(String recordId) {
    // prettier-ignore
    List<DEVICE_MNG__x> deviceMngList = [
        SELECT
          device_mng_id__c
        FROM
          DEVICE_MNG__x
        WHERE
          Id = :recordId
      ];
    return deviceMngList;
  }

  /**
   * Sightsカメラ情報レコードの取得
   * sights_camera_inf_id__c を使用したいため取得している
   *
   * @param deviceMng 画面表示している機器管理レコード
   * @return 画面表示している機器管理レコードに紐づくSightsカメラ情報レコードList（1件のみ）
   */
  public static List<SIGHTS_CAMERA_INF__x> getSightsCameraInfListByDeviceMngId(
    DEVICE_MNG__x deviceMng
  ) {
    // prettier-ignore
    List<SIGHTS_CAMERA_INF__x> sightsCameraInfList = [
        SELECT
          sights_camera_inf_id__c
        FROM
          SIGHTS_CAMERA_INF__x
        WHERE
          device_mng_id__c = :deviceMng.device_mng_id__c
      ];
    return sightsCameraInfList;
  }
}