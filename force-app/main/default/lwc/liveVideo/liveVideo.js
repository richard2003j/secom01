import { LightningElement, track } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import RMS_ShakaPlayer from '@salesforce/resourceUrl/RMS_ShakaPlayer';

// 3Qデモ用に静的リソースから固定で画像読み込み
import cameraNomalViewUrl from '@salesforce/resourceUrl/RMS_CameraNormalView'

export default class LiveVideo extends LightningElement {
  // 3Qデモ用に静的リソースから固定で画像読み込み
  cameraNomalViewImage = cameraNomalViewUrl;

  @track liveVideoUrl;

  renderedCallback() {
    if (this.initialized) {
      return;
    }
    this.initialized = true;
  
    // js, css読み込み
    Promise.all([
      loadScript(this, RMS_ShakaPlayer + '/dist/shaka-player.compiled.js')
    ])
    .then(() => {
      const endPoint = 'https://m5ymfrpvuk.execute-api.ap-northeast-1.amazonaws.com/srv/api/remote_maintenance/devices/cameras/cb390e09-f82e-da5d-a16e-73d6b58b44d7/live_url';
      fetch(endPoint, {
        method: 'GET',
        mode: 'cors',
        headers: {'Accept': 'application/json', 'x-api-key': 'bfHQmYpTT56IJMu9XaoND29dlOSMCTnU3dVYWzjf'}
      }).then(response => response.json()).then(data => {
        const shakaVideo = this.template.querySelector("[data-id='shakaVideoDataId']");
        console.log(Object.keys(shakaVideo), typeof shakaVideo);

        const player = new shaka.Player(shakaVideo);
        console.log('Player created.')
        player.load(data.url).then(() => {
          console.log('Set player video');
        }).catch(error => console.log(error))
      })
    })
    .catch((error) => {
      console.log("Error in loading shaka-player.js", error)
    });
  }
  // handleFetch() {
  //   const endPoint = 'https://m5ymfrpvuk.execute-api.ap-northeast-1.amazonaws.com/srv/api/remote_maintenance/devices/cameras/cb390e09-f82e-da5d-a16e-73d6b58b44d7/live_url';
  //   fetch(endPoint, {
  //     method: 'GET',
  //     mode: 'cors',
  //     headers: {'Accept': 'application/json', 'x-api-key': 'bfHQmYpTT56IJMu9XaoND29dlOSMCTnU3dVYWzjf'}
  //   }).then(response => response.json()).then(data => {
  //     // player.initialize(document.getElementById('videoplayer'), data.url, true);
  //     this.liveVideoUrl = data.url
  //   })
  // }
}