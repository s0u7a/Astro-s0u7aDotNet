//キャッシュ名(=バージョン)を指定する
var CACHE_NAME = "cache-v2";
// キャッシュのバージョン
const CACHE_VERSION = 2;
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
    event.waitUntil(
        // cacheStorageの中に指定したキーのcacheを新しく作成して開く
        caches.open(CACHE_KEY).then(function(cache) {
        // パスの一覧を渡してcacheに追加する
            return cache.addAll(CACHE_FILES);
        })
    );
});
// activate
// 有効化した時点で処理を行なう
this.addEventListener('activate', function(event) {
  // waitUntil()でイベントの完了を処理が成功するまで遅延させる
  event.waitUntil(self.clients.claim());
  event.waitUntil(
      // cacheStorageの中の全てのcacheを確認する
      caches.keys().then(function(cacheKeys) {
          return Promise.all(
              cacheKeys.filter(function(cacheKey) {
                  // キー名を確認してキャッシュ名とバージョンを確認する
                  const [cacheName, cacheVersion] = cacheKey.split(':');
                  // 同じキャッシュ名でバージョンが異なるものを削除対象とする
                  return cacheName == CACHE_NAME && cacheVersion != CACHE_VERSION;
              }).map(function(cacheKey) {
                  // 削除対象としたキーのcacheを全てcacheStorageから削除する
                  return caches.delete(cacheKey);
              })
          );
      })
  );
});
// fetch  event.waitUntil(self.clients.claim());event.waitUntil(self.skipWaiting());
// キャッシュ対象ファイルかどうかを判定する
const isTargetFile = function(url) {
  return CACHE_FILES.indexOf(new URL(url).pathname) >= 0;
};

// スコープ内のページからのリクエストによりfetchイベントが発火する
this.addEventListener('fetch', function(event) {
  // レスポンスを宣言する
  event.respondWith(
      // cacheStorageの中から管理しているcacheを開く
      caches.open(CACHE_KEY).then(function(cache) {
          // cache内にこのリクエストに対するキャッシュが存在するか確認する
          return cache.match(event.request).then(function(response) {
              // もしキャッシュがあればそれを返す
              if (response) return response;
              // もし無ければネットワークに取得しに行く
              return fetch(event.request).then(function(response) {
                  // キャッシュ対象のファイルでキャッシュすべきレスポンスであればキャッシュする
                  if (isTargetFile(event.request.url) && response.ok) {
                      cache.put(event.request, response.clone());
                  }
                  // レスポンスを返す
                  return response;
              });
          });
      })
  );
});