//キャッシュ名(=バージョン)を指定する
var CACHE_NAME = "cache-v3";
// キャッシュのバージョン
const CACHE_VERSION = 3;
//キャッシュするファイル or ディレクトリを指定する
var urlsToCache = [
  "/",
];

// install
// キャッシュ名とキャッシュバージョンからキーを作る
const CACHE_KEY = `${CACHE_NAME}:${CACHE_VERSION}`;

// インストール時の処理
this.addEventListener('install', function(event) {
    // waitUntil()でイベントの完了を処理が成功するまで遅延させる
    event.waitUntil(self.skipWaiting());
});
// activate
// 有効化した時点で処理を行なう
this.addEventListener('activate', function(event) {
  // waitUntil()でイベントの完了を処理が成功するまで遅延させる
  event.waitUntil(self.clients.claim());
 
});
// fetch  event.waitUntil(self.clients.claim());event.waitUntil(self.skipWaiting());

// スコープ内のページからのリクエストによりfetchイベントが発火する
this.addEventListener('fetch', function(event) {
console.log("Handling fetch event for", event.request);
});
