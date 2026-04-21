【カード画像はこのフォルダと src/lib/cardImageManifest.ts だけで完結します】

■ 一弾（正規版）カード
  - ファイル名は DB の cards.name と同じにし、拡張子は .jpg を推奨（例: エナジーボール.jpg）
  - マニフェストでは「カード名」と「カード名.jpg」が対応済み
  - LINE アルバム連番（LINE_ALBUM_第1弾プロキシ…_1.jpg ～ _40.jpg）を一括で
    「カード名.jpg」にコピーする場合（1枚目＝エナジーボール … 40枚目＝閉ざされし暗黒の扉）:
        npm run card-images:import-first-expansion-album
    （画像は public または dist の card_illustrations に置いてから実行）
  - 旧ファイル（別名の PNG 等）を消す場合:
        npm run card-images:prune-first-expansion-legacy

■ 手順（二弾以降・個別名のとき）
  1. 画像ファイルをこのフォルダ（card_illustrations）に置く
     対応形式: .jpg .jpeg .png .webp
  2. src/lib/cardImageManifest.ts を開き、次の形式で 1 行ずつ追加する
        'Supabaseのカード名と同じ文字列': 'このフォルダ内のファイル名.jpg',
     例:
        '墓起こし': 'grave.jpg',
  3. npm run dev または npm run build で確認
  4. Git にコミットして Netlify へ push（画像も一緒に上がります）

■ マッピングを書かない場合
  ファイル名を「カード名.jpg」または「カード名.png」にしてこのフォルダに置けば表示を試みます
  （OS によってはファイル名に使えない文字があるので、そのときは必ずマッピングを使ってください）

■ 任意: DB と照らして未配置を確認
  プロジェクト直下で:
    npm run card-images:status
  （.env に DATABASE_URL があるとき、cards テーブルの name と照合します）

■ 補足
  cards.image_url に実画像の http(s) URL が入っている場合は、それが最優先で表示されます
