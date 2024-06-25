function requestAds() {
  const videoElement = document.getElementById("videoElement");
  const adDisplayContainer = new google.ima.AdDisplayContainer(videoElement);
  const adsLoader = new google.ima.AdsLoader(adDisplayContainer);

  adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, onAdsManagerLoaded, false);
  adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError, false);

  const adsRequest = new google.ima.AdsRequest();
  adsRequest.adTagUrl =
    "https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dskippablelinear&correlator="; // Ваш реальний URL рекламного тегу

  adsLoader.requestAds(adsRequest);
}

function onAdsManagerLoaded(adsManagerLoadedEvent) {
  const adsManager = adsManagerLoadedEvent.getAdsManager();
  adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, onAdEvent);
  const videoElement = document.getElementById("videoElement");
  adsManager.init(videoElement.offsetWidth, videoElement.offsetHeight, google.ima.ViewMode.NORMAL);
  adsManager.start();
}

function onAdError(adErrorEvent) {
  console.error("Ad Error:", adErrorEvent.getError());
  activateGame();
}

function onAdEvent(adEvent) {
  const videoElement = document.getElementById("videoElement");
  videoElement.classList.add("hidden");
  videoElement.src = "";
  activateGame();
}

function activateGame() {
  const videoElement = document.getElementById("videoElement");
  videoElement.classList.add("hidden");
  videoElement.classList.remove("show-video");
  const letsPlayButton = document.getElementById("lets-play");
  const rollDiceButton = document.getElementById("roll-dice");
  rollDiceButton.classList.remove("hidden");
  rollDiceButton.focus();
}
