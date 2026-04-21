/*
  # 一弾カードの効果テキスト・数値の更新

  ユーザー提供の1弾リストに基づく。
  - 閉ざされし暗黒の扉: テキスト上モンスターのため card_type をモンスターに変更
  - ユニーク指定: 破壊砲牙龍・大爆発・秘術師・剛弾・閉ざされし暗黒の扉
*/

UPDATE cards SET
  effect_text = $e0$
・エナジーから1枚を選んで墓地に置きカードを2枚引く
$e0$,
  cost = 3,
  power = NULL,
  race = NULL,
  card_type = '呪文',
  is_unique = false
WHERE name = 'エナジーボール';

UPDATE cards SET
  effect_text = $e1$
・カウンター3
・場にあるモンスター1体を破壊する
$e1$,
  cost = 7,
  power = NULL,
  race = NULL,
  card_type = '呪文',
  is_unique = false
WHERE name = 'メルト・パンチ';

UPDATE cards SET
  effect_text = $e2$
・カウンター2
・手札を1枚捨てる。
・場のコスト5以下のモンスターを1体選び破壊する。
$e2$,
  cost = 6,
  power = NULL,
  race = NULL,
  card_type = '呪文',
  is_unique = false
WHERE name = 'デカクラクション';

UPDATE cards SET
  effect_text = $e3$
・自分の墓地のモンスターを1枚選び手札に加える。
$e3$,
  cost = 5,
  power = NULL,
  race = NULL,
  card_type = '呪文',
  is_unique = false
WHERE name = '墓起こし';

UPDATE cards SET
  effect_text = $e4$
・自分の墓地のカードを1枚選びエナジー化させる。
$e4$,
  cost = 4,
  power = NULL,
  race = NULL,
  card_type = '呪文',
  is_unique = false
WHERE name = '電線復帰';

UPDATE cards SET
  effect_text = $e5$
・カウンター3
・カードを3枚引く
$e5$,
  cost = 6,
  power = NULL,
  race = NULL,
  card_type = '呪文',
  is_unique = false
WHERE name = '王家の宝箱';

UPDATE cards SET
  effect_text = $e6$
・登場時、山札の上から2枚を見る。そのあと山札の上と下にそれぞれ1枚ずつ戻す。
$e6$,
  cost = 3,
  power = 1000,
  race = '海獣',
  card_type = 'モンスター',
  is_unique = false
WHERE name = 'セモタレエビ';

UPDATE cards SET
  effect_text = $e7$
・カウンター3
・自分のモンスターがバトルに勝った時、このモンスターは手札に戻る。
$e7$,
  cost = 5,
  power = 7000,
  race = '海獣',
  card_type = 'モンスター',
  is_unique = false
WHERE name = 'トンカチヘッド・シャーク';

UPDATE cards SET
  effect_text = $e8$
・ツインアタッカー
・登場時、次のうちどちらかを選ぶ。
▶相手のモンスターを1体破壊する。
▶相手の手札を2枚まで破壊する。
・攻撃時、自分のエナジーを1枚選び手札に戻す。
$e8$,
  cost = 9,
  power = 8000,
  race = '海獣/皇帝種',
  card_type = 'エボルモンスター',
  is_unique = false
WHERE name = '大海覇者 メガロエンペラー';

UPDATE cards SET
  effect_text = $e9$
・登場時、場のカード1枚を破壊する。こうしてカードが破壊されたプレイヤーはカードを2枚まで引く。
$e9$,
  cost = 6,
  power = 3000,
  race = '悪魔',
  card_type = 'モンスター',
  is_unique = false
WHERE name = '闇取り引きのディモン';

UPDATE cards SET
  effect_text = $e10$
・登場時、自分は手札からカードを2枚を選び捨て、3枚引く。
$e10$,
  cost = 8,
  power = 7000,
  race = '天使',
  card_type = 'モンスター',
  is_unique = false
WHERE name = '大空の使徒 デル・ローエ';

UPDATE cards SET
  effect_text = $e11$
・登場時、相手のパワー3000以下のモンスターを1体破壊する。
$e11$,
  cost = 6,
  power = 4000,
  race = 'ナイト',
  card_type = 'モンスター',
  is_unique = false
WHERE name = 'アルターナイツ ガーウィン';

UPDATE cards SET
  effect_text = $e12$
・
$e12$,
  cost = 8,
  power = 10000,
  race = 'ナイト',
  card_type = 'モンスター',
  is_unique = false
WHERE name = 'アルターナイツ トリストラ';

UPDATE cards SET
  effect_text = $e13$
・フラッシュカウンター
・ガードナー
・登場時、自分の手札を1枚捨てる。
$e13$,
  cost = 3,
  power = 3000,
  race = '雷人',
  card_type = 'モンスター',
  is_unique = false
WHERE name = '飛雷硬化 バリズム';

UPDATE cards SET
  effect_text = $e14$
・登場時、カードを1枚引き、手札を1枚捨てる。
$e14$,
  cost = 4,
  power = 2000,
  race = '雷人',
  card_type = 'モンスター',
  is_unique = false
WHERE name = '豪快迅雷 ゴロツキ';

UPDATE cards SET
  effect_text = $e15$
・ツインアタッカー
・登場時、相手モンスター全てをスリープさせる。
・自分の場に、他の「種族：雷人」が2つ以上あればこのモンスターは「能力：速攻」を持つ。
$e15$,
  cost = 10,
  power = 6000,
  race = '雷人',
  card_type = 'エボルモンスター',
  is_unique = false
WHERE name = '爆大電磁 ドン・エレキ';

UPDATE cards SET
  effect_text = $e16$
・登場時、このモンスターをエナジーに置く。その後エナジーから1枚を選び墓地に置く。
$e16$,
  cost = 3,
  power = 1000,
  race = 'フォレスター',
  card_type = 'モンスター',
  is_unique = false
WHERE name = '見習い電導師 モーリス';

UPDATE cards SET
  effect_text = $e17$
・このモンスターは、バトル中パワーが＋3000される。
$e17$,
  cost = 5,
  power = 4000,
  race = 'フォレスター',
  card_type = 'モンスター',
  is_unique = false
WHERE name = '見習い電導師 シロビシン';

UPDATE cards SET
  effect_text = $e18$
・登場時、山札の上から1枚をエナジー化する。
$e18$,
  cost = 5,
  power = 2000,
  race = 'フォレスター',
  card_type = 'モンスター',
  is_unique = false
WHERE name = '電導師 キツネミア';

UPDATE cards SET
  effect_text = $e19$
・このモンスターが破壊されて墓地に置かれる時、代わりにエナジーになる。
$e19$,
  cost = 4,
  power = 3000,
  race = 'フォレスター',
  card_type = 'モンスター',
  is_unique = false
WHERE name = '電導師 フェネックス';

UPDATE cards SET
  effect_text = $e20$
・登場時、山札の上から2枚をエナジー化する。
・このモンスターは、エナジーにある「種族：フォレスター」の枚数分パワーが＋1000される。こうしてパワーが8000を超えたら、このモンスターに「能力：ツインアタッカー」を、10000を超えたら「能力：速攻」を得る。
$e20$,
  cost = 8,
  power = 4000,
  race = 'フォレスター',
  card_type = 'エボルモンスター',
  is_unique = false
WHERE name = '一流電導師 テン・クロスタ';

UPDATE cards SET
  effect_text = $e21$
・登場時、自分または相手のシールドが4枚以下ならこのモンスターは「能力：速攻」を得る。
$e21$,
  cost = 2,
  power = 1000,
  race = '雷人/スピードノイザー',
  card_type = 'モンスター',
  is_unique = false
WHERE name = '稲妻小僧 ビリザキッド';

UPDATE cards SET
  effect_text = $e22$
・登場時、場の「種族：スピードノイザー」を選び、このターン「能力：ツインアタッカー」を与える。
$e22$,
  cost = 2,
  power = 1000,
  race = '雷人/スピードノイザー',
  card_type = 'モンスター',
  is_unique = false
WHERE name = '感電走族 パラリライダー';

UPDATE cards SET
  effect_text = $e23$
・速攻
$e23$,
  cost = 4,
  power = 1000,
  race = '海獣/スピードノイザー',
  card_type = 'モンスター',
  is_unique = false
WHERE name = 'ソウオンカジキ';

UPDATE cards SET
  effect_text = $e24$
・このモンスターは、場のモンスターの数が自分の方が多い時だけ攻撃できる。
$e24$,
  cost = 1,
  power = 1000,
  race = '堕虫/スピードノイザー',
  card_type = 'モンスター',
  is_unique = false
WHERE name = '炎音 紅蝶羽';

UPDATE cards SET
  effect_text = $e25$
・登場時、手札を1枚捨てて1枚引く。捨てたカードが「種族：スピードノイザー」ならさらにもう1枚引き手札を1枚捨てる。
$e25$,
  cost = 3,
  power = 3000,
  race = 'スピードノイザー',
  card_type = 'モンスター',
  is_unique = false
WHERE name = '見極める主審 デラシャウト';

UPDATE cards SET
  effect_text = $e26$
・速攻
・登場時、自分のシールドを1枚選び手札に加える。
・登場時、場の「種族：スピードノイザー」を破壊する。しかし相手または自分のシールドが4枚以下ならこの効果は発動しない。
$e26$,
  cost = 3,
  power = 2000,
  race = 'スピードノイザー',
  card_type = 'モンスター',
  is_unique = false
WHERE name = '暴走する前歯 マモット';

UPDATE cards SET
  effect_text = $e27$
・速攻
・登場時、場に他の「種族：スピードノイザー」があれば「能力：ガードナー」を持つモンスターを1体選びそれを破壊する。
・このモンスターは、場に他の「種族：スピードノイザー」があれば「能力：ツインアタッカー」を得る。
・手札にあるこのモンスターのコストを、場の「種族：スピードノイザー」の数分減らす。
$e27$,
  cost = 8,
  power = 5000,
  race = 'ドラゴン/スピードノイザー',
  card_type = 'エボルモンスター',
  is_unique = false
WHERE name = '爆音狂竜 ブラストザウルス';

UPDATE cards SET
  effect_text = $e28$
・登場時、カードを1枚引く
・このモンスターは相手に選ばれず、場に自分の「種族：精霊使い」が無ければ攻撃できない。
$e28$,
  cost = 3,
  power = 3000,
  race = 'スピリッツ/精霊',
  card_type = 'モンスター',
  is_unique = false
WHERE name = '魂の精霊';

UPDATE cards SET
  effect_text = $e29$
・登場時、山札の上から1枚をエナジー化する
・このモンスターは相手に選ばれず、場に自分の「種族：精霊使い」が無ければ攻撃できない。
$e29$,
  cost = 5,
  power = 3000,
  race = 'スピリッツ/精霊',
  card_type = 'モンスター',
  is_unique = false
WHERE name = '奇跡の精霊';

UPDATE cards SET
  effect_text = $e30$
・登場時、山札の上から1枚をシールドに追加する。場に他の「精霊」カードがあれば、更にもう1枚追加する。
$e30$,
  cost = 9,
  power = 4000,
  race = '精霊使い',
  card_type = 'モンスター',
  is_unique = false
WHERE name = '精霊の伝い手 フエセプス';

UPDATE cards SET
  effect_text = $e31$
・カウンター3
・ガードナー
・このモンスターは攻撃できない。
$e31$,
  cost = 5,
  power = 3000,
  race = '精霊使い',
  card_type = 'モンスター',
  is_unique = false
WHERE name = '精霊の守り手 ディフィシウス';

UPDATE cards SET
  effect_text = $e32$
・登場時、「精霊」カード1枚を破壊してもよい。そうしたら相手は自分のモンスターを1体選び破壊する。
$e32$,
  cost = 4,
  power = 3000,
  race = '精霊使い',
  card_type = 'モンスター',
  is_unique = false
WHERE name = '精霊の担い手 ギセウス';

UPDATE cards SET
  effect_text = $e33$
・山札の上から2枚を表向きにする。その中から「種族：精霊」を全て手札に加え、残りを好きな順で山札の下に戻す。
$e33$,
  cost = 2,
  power = NULL,
  race = NULL,
  card_type = '呪文',
  is_unique = false
WHERE name = '精霊神話「第1章―光あれ」';

UPDATE cards SET
  effect_text = $e34$
・ツインアタッカー
・手札にあるこのカードのコストは場の「精霊」カードの数だけ少なくなる。
・登場時、相手は次ターンの終了時まで魔法カードを使うことが出来ない。
$e34$,
  cost = 10,
  power = 7000,
  race = '神',
  card_type = 'エボルモンスター',
  is_unique = false
WHERE name = '精霊神 ファーザーズ・ゼウス';

UPDATE cards SET
  effect_text = $e35$
・速攻
・ツインアタッカー
・登場時、お互いはシールドを1枚手札に加える。
$e35$,
  cost = 10,
  power = 9000,
  race = 'ドラゴン/改造龍機',
  card_type = 'エボルモンスター',
  is_unique = true
WHERE name = '破壊砲牙龍 ディクラスター・ドラゴン';

UPDATE cards SET
  effect_text = $e36$
・カウンター7
・場のモンスター全てを破壊する
$e36$,
  cost = 13,
  power = NULL,
  race = NULL,
  card_type = '呪文',
  is_unique = true
WHERE name = '大爆発';

UPDATE cards SET
  effect_text = $e37$
・自分のターン開始時、このモンスターを破壊する。そのあとモンスターが出るまで自分の山札をめくり、それを場に出す。
$e37$,
  cost = 5,
  power = 1000,
  race = '悪魔/マジシャン',
  card_type = 'モンスター',
  is_unique = true
WHERE name = '秘術師 フィーデン・ニトロ';

UPDATE cards SET
  effect_text = $e38$
・フラッシュカウンター
・場の相手カード1枚を破壊する
$e38$,
  cost = 4,
  power = NULL,
  race = '装具',
  card_type = '装備',
  is_unique = true
WHERE name = '剛弾 ファウスト・ガントレット';

UPDATE cards SET
  effect_text = $e39$
・このモンスターは攻撃できない。
・自分のターン開始時、このモンスターを破壊する。そのあとカードを5枚引き、手札からコストが8以下の「種族：悪魔」を場に出す。
$e39$,
  cost = 13,
  power = 6666,
  race = '悪魔',
  card_type = 'モンスター',
  is_unique = true
WHERE name = '閉ざされし暗黒の扉';

