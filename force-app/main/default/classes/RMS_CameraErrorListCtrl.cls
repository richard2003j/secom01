public with sharing class RMS_CameraErrorListCtrl {
  public class UpdateResult {
    public Boolean isSuccess;
    public String message;
    public SIGHTS_CAMERA_ERROR_INF__x record;

    public UpdateResult(
      Boolean isSuccess,
      String message,
      SIGHTS_CAMERA_ERROR_INF__x record
    ) {
      this.isSuccess = isSuccess;
      this.message = message;
      this.record = record;
    }
  }

  /**
   * Sightsカメラ情報レコードの取得
   *
   * @param recordId 画面表示している機器管理レコードのId
   * @return 機器管理レコードの外部Idを持つSightsカメラ情報レコードのList
   */
  @AuraEnabled(cacheable=true)
  public static List<SIGHTS_CAMERA_INF__x> getSightsCameraInfList(
    String recordId
  ) {
    // デバイス管理の取得
    List<DEVICE_MNG__x> deviceMngList = RMS_Util.getDeviceMng(recordId);

    // Sightsカメラ情報の取得
    List<SIGHTS_CAMERA_INF__x> sightsCameraInfList = RMS_Util.getSightsCameraInfListByDeviceMngId(
      deviceMngList[0]
    );

    return sightsCameraInfList;
  }

  /**
   * Sightsカメラ異常状態レコードの取得
   *
   * @param sightsCameraInfList getSightsCameraInfListByDeviceMngId で取得したSightsカメラ情報レコードのList
   * @return Sightsカメラ異常状態レコードのList
   */
  @AuraEnabled(cacheable=true)
  public static SIGHTS_CAMERA_ERROR_INF__x getSightsCameraErrorInf(
    List<SIGHTS_CAMERA_INF__x> sightsCameraInfList
  ) {
    // Sightsカメラ異常状態の取得
    List<SIGHTS_CAMERA_ERROR_INF__x> sigthsCameraErrorInfList = getSightsCameraErrorInfListByCameraInf(
      sightsCameraInfList[0]
    );

    if (sigthsCameraErrorInfList.size() > 0) {
      return sigthsCameraErrorInfList[0];
    }
    return null;
  }

  /**
   * Sightsカメラ異常状態レコードの取得
   * device_mng_id__c を使用したいため取得している
   *
   * @param sightsCameraInf 画面表示している機器管理レコードに紐づくSightsカメラ情報レコード
   * @return Sightsカメラ情報レコードに紐づくSightsカメラ異常状態レコードList（1件のみ）
   */
  private static List<SIGHTS_CAMERA_ERROR_INF__x> getSightsCameraErrorInfListByCameraInf(
    SIGHTS_CAMERA_INF__x sightsCameraInf
  ) {
    // prettier-ignore
    List<SIGHTS_CAMERA_ERROR_INF__x> sigthsCameraErrorInfList = [
      SELECT
        Id
        , ExternalId
        , shock__c
        , signal_lost__c
        , tamper__c
        , temperature__c
      FROM
        SIGHTS_CAMERA_ERROR_INF__x
      WHERE
        sights_camera_inf_id__c = :sightsCameraInf.sights_camera_inf_id__c
    ];
    return sigthsCameraErrorInfList;
  }

  /**
   * Sightsカメラ異常状態レコードの更新（復旧用）
   *
   * @param sigthsCameraErrorInfList getSightsCameraInfListByDeviceMngId で取得したSightsカメラ情報レコードのList
   * @return Sightsカメラ異常状態レコードのList
   */
  /*
  @AuraEnabled(cacheable=true)
  public static String updateSightsCameraErrorInf(
    SIGHTS_CAMERA_ERROR_INF__x sigthsCameraErrorInf
  ) {
    Boolean isSuccess = false;
    String message = '';

    try {
      // 外部オブジェクトのDML操作は、ooAsync or ooImmediateで行う
      //Database.SaveResult sr = Database.updateAsync(sigthsCameraErrorInf);
      Database.SaveResult sr = Database.updateImmediate(sigthsCameraErrorInf);
      if (!sr.isSuccess()) {
        String locator = Database.getAsyncLocator(sr);
        message = '更新失敗 : ' + locator;
      } else {
        isSuccess = true;
        message = 'Sightsカメラ異常状態レコードの更新に成功しました。';
      }
    } catch (Exception e) {
      message = '更新失敗 : ' + e.getMessage();
    }

    return JSON.serialize(
      new UpdateResult(isSuccess, message, sigthsCameraErrorInf)
    );
  }
  */
  @AuraEnabled(cacheable=true)
  public static SIGHTS_CAMERA_ERROR_INF__x updateSightsCameraErrorInf(
    SIGHTS_CAMERA_ERROR_INF__x sigthsCameraErrorInf
  ) {
    try {
      // 外部オブジェクトのDML操作は、ooAsync or ooImmediateで行う
      //Database.SaveResult sr = Database.updateAsync(sigthsCameraErrorInf);
      Database.SaveResult sr = Database.updateImmediate(sigthsCameraErrorInf);
      if (!sr.isSuccess()) {
        String locator = Database.getAsyncLocator(sr);
        System.debug(locator);
        return null;
      }
    } catch (Exception e) {
      System.debug(e.getMessage());
      return null;
    }

    return sigthsCameraErrorInf;
  }
}