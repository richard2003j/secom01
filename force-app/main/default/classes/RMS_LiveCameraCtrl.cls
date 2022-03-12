public with sharing class RMS_LiveCameraCtrl {
  public DEVICE_MNG__x currentDeviceMng { get; set; }
  public boolean isSightsCamera { get; set; } // 機器がSightsカメラかどうかのフラグ
  public boolean isCameraAuth { get; set; } // Sightsカメラ映像の閲覧権限があるかどうかのフラグ

  public RMS_LiveCameraCtrl() {
    // 画面に表示している機器管理レコードのIdを取得
    Id recordId = ApexPages.currentPage().getParameters().get('id');

    // 画面に表示している機器管理レコードを取得
    List<DEVICE_MNG__x> deviceMngList = RMS_Util.getDeviceMng(recordId);

    if (deviceMngList.size() != 1) {
      // 機器管理が取得出来なかった場合
      // ToDo: エラー処理
      return;
    } else {
      this.currentDeviceMng = deviceMngList[0];
    }

    // Sightsカメラ情報の取得
    List<SIGHTS_CAMERA_INF__x> sightsCameraInfList = RMS_Util.getSightsCameraInfListByDeviceMngId(
      this.currentDeviceMng
    );

    if (sightsCameraInfList.size() != 1) {
      // Sightsカメラが取得出来なかった場合（機器がSightsカメラ以外の場合）
      this.isSightsCamera = false;
      return;
    } else {
      this.isSightsCamera = true;
    }

    // カメラ映像権限取得
    List<RMS_CameraLiveAuthMng__c> cameraLiveAuthMngList = getCameraLiveAuthMngListByCameraInf(
      sightsCameraInfList[0]
    );
    if (cameraLiveAuthMngList.size() != 1) {
      // カメラ映像の権限が無い場合
      this.isCameraAuth = false;
      return;
    } else {
      // カメラ映像の権限がある場合
      this.isCameraAuth = true;
    }
  }

  /**
   * カメラ映像権限管理レコードの取得
   * device_mng_id__c を使用したいため取得している
   *
   * @param sightsCameraInf 画面表示している機器管理レコードに紐づくSightsカメラ情報レコード
   * @return Sightsカメラ情報レコードに紐づくSightsカメラ異常状態レコードList（1件のみ）
   */
  private static List<RMS_CameraLiveAuthMng__c> getCameraLiveAuthMngListByCameraInf(
    SIGHTS_CAMERA_INF__x sightsCameraInf
  ) {
    // 現在時刻
    Datetime now = datetime.now();

    // prettier-ignore
    List<RMS_CameraLiveAuthMng__c> cameraLiveAuthMngList = [
      SELECT
        Id
      FROM
        RMS_CameraLiveAuthMng__c
      WHERE
        sights_camera_inf_id__c = :sightsCameraInf.sights_camera_inf_id__c
        AND operater_id__c = :UserInfo.getUserId()
        AND browse_str_date__c <= :now
        AND browse_end_date__c >= :now
    ];
    return cameraLiveAuthMngList;
  }
}