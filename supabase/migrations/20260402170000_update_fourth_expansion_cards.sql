/*
  # 四弾カードの効果テキスト・数値の更新

  ユーザー提供リストに基づく。
  - 原文「ブート状態」→「リブート状態」
  - 豊作魚: 重複した「｢」を1つに整理
  - card_type「魔法」→「呪文」（サイトのカードタイプ絞り込みと一致）
  - 欲望の精霊・城将機竜・ヴェロキ系・拳華屋・ありもち・きりむにす: エボル系はエボルモンスターに統一
*/

UPDATE cards SET
  effect_text = $f0$
・このモンスターはリブート状態で場に出る。
・エボルシナジー：登場時、このモンスターをリブートする。
・このモンスターのリブート時、相手モンスターを1体選びスリープさせる。
・このモンスターは相手に選ばれず、場に自分の「種族：精霊使い」が無ければ攻撃できない。
・リブートアタッカー
$f0$,
  cost = 8,
  power = 5000,
  race = '精霊/メルヘン',
  tribes = ARRAY['精霊', 'メルヘン']::text[],
  card_type = 'エボルモンスター',
  is_unique = false
WHERE name = '欲望の精霊 眠れる森のオー・ローラ' AND expansion = '四弾';

UPDATE cards SET
  effect_text = $f1$
・登場時、相手モンスター2体を手札に戻す。
・ツインアタッカー
$f1$,
  cost = 8,
  power = 4000,
  race = 'ドラゴン/改造龍機',
  tribes = ARRAY['ドラゴン', '改造龍機']::text[],
  card_type = 'エボルモンスター',
  is_unique = false
WHERE name = '城将機竜 トルネイド・フォトン・ドラゴン' AND expansion = '四弾';

UPDATE cards SET
  effect_text = $f2$
・リブートアタッカー
$f2$,
  cost = 5,
  power = 2000,
  race = 'ダイノガン/古代兵器',
  tribes = ARRAY['ダイノガン', '古代兵器']::text[],
  card_type = 'モンスター',
  is_unique = false
WHERE name = 'ヴェロキ・ヴェプトル' AND expansion = '四弾';

UPDATE cards SET
  effect_text = $f3$
・自分の「種族：ダイノガン」のリブート時、このカードを手札から3コストで召喚してもよい。
・エボルシナジー：自分モンスターの攻撃時、そのモンスターをリブートさせる。(この効果は1ターンに1度まで発動する。)
$f3$,
  cost = 7,
  power = 3000,
  race = 'ダイノガン/古代兵器',
  tribes = ARRAY['ダイノガン', '古代兵器']::text[],
  card_type = 'エボルモンスター',
  is_unique = false
WHERE name = 'ダイ銃士 ヴェロキレイバー' AND expansion = '四弾';

UPDATE cards SET
  effect_text = $f4$
・カウンター6
・パワー5000以下のモンスターを全て破壊する。
$f4$,
  cost = 8,
  power = NULL,
  race = NULL,
  tribes = NULL,
  card_type = '呪文',
  is_unique = false
WHERE name = '大切断' AND expansion = '四弾';

UPDATE cards SET
  effect_text = $f5$
・フラッシュカウンター
・相手モンスターを1体選びスリープさせる。
$f5$,
  cost = 4,
  power = NULL,
  race = NULL,
  tribes = NULL,
  card_type = '呪文',
  is_unique = false
WHERE name = '閃光' AND expansion = '四弾';

UPDATE cards SET
  effect_text = $f6$
・手札を1枚捨て1枚引く。捨てたカードが｢カードタイプ：魔法｣であればさらにもう1枚引く。
$f6$,
  cost = 3,
  power = NULL,
  race = NULL,
  tribes = NULL,
  card_type = '呪文',
  is_unique = false
WHERE name = '魔鍵の宝箱' AND expansion = '四弾';

UPDATE cards SET
  effect_text = $f7$
・手札を1枚捨てる。その後、山札を確認しモンスター1枚を選び相手に見せてからそれを手札に加える。
$f7$,
  cost = 6,
  power = NULL,
  race = NULL,
  tribes = NULL,
  card_type = '呪文',
  is_unique = false
WHERE name = 'モンスター・ゲート' AND expansion = '四弾';

UPDATE cards SET
  effect_text = $f8$
・登場時、相手モンスターを1体選び破壊する。その後相手のシールドを1枚ブレイクする。
・エボルシナジー：ツインアタッカー
$f8$,
  cost = 5,
  power = 1000,
  race = 'スピードノイザー',
  tribes = ARRAY['スピードノイザー']::text[],
  card_type = 'エボルモンスター',
  is_unique = false
WHERE name = '拳華屋 ストレイト' AND expansion = '四弾';

UPDATE cards SET
  effect_text = $f9$
・リブートアタッカー
$f9$,
  cost = 4,
  power = 2000,
  race = '戦士',
  tribes = ARRAY['戦士']::text[],
  card_type = 'モンスター',
  is_unique = false
WHERE name = '双剣からなる者' AND expansion = '四弾';

UPDATE cards SET
  effect_text = $f10$
・カウンター2
・ファイトアタッカー
・このモンスターは相手プレイヤーを攻撃できない。
$f10$,
  cost = 3,
  power = 3000,
  race = 'モンストロ/フレイマー',
  tribes = ARRAY['モンストロ', 'フレイマー']::text[],
  card_type = 'モンスター',
  is_unique = false
WHERE name = 'ヒノボール' AND expansion = '四弾';

UPDATE cards SET
  effect_text = $f11$
・自分のエナジーが7枚以上あり、それらがそれぞれ違う種族を持っていたならその枚数だけ手札にあるこのカードのコストは少なくなる。
・登場時または自分のターン開始時、山札から3枚を表向きにする。それらが全て｢カードタイプ：モンスター｣であり、それぞれ違う種族を持っていたなら、場にある☆の効果を使用する。残りは山札の下に好きな順序で戻す。
☆自分の場にあるカードの種族を数える。相手は次の自身のターン終了時まで、その枚数分、使用するカードの効果を無視する。(自分は同名の他カードを含めたこの効果をゲーム中1度しか使用できない。)
$f11$,
  cost = 8,
  power = NULL,
  race = NULL,
  tribes = NULL,
  card_type = 'フィールド',
  is_unique = false
WHERE name = 'アドアリアの夜' AND expansion = '四弾';

UPDATE cards SET
  effect_text = $f12$
・登場時、山札の上から5枚を表向きにする。それらが全て｢カードタイプ：モンスター｣であり、それぞれ違う種族を持っていたならそれらの中から1枚を手札に加え、場にある☆の効果を使用する。残りは山札の下に好きな順序で戻す。
☆自分モンスター1体を選ぶ。それはこのターン｢能力：速攻、ツインアタッカー｣を得る。
$f12$,
  cost = 3,
  power = 2000,
  race = 'エンジェント/フレイマー',
  tribes = ARRAY['エンジェント', 'フレイマー']::text[],
  card_type = 'モンスター',
  is_unique = false
WHERE name = '炎剣の使い エンラスト・フレア' AND expansion = '四弾';

UPDATE cards SET
  effect_text = $f13$
・登場時、山札の上から5枚を表向きにする。それらが全て｢カードタイプ：モンスター｣であり、それぞれ違う種族を持っていたならそれらの中から1枚を手札に加え、場にある☆の効果を使用する。残りは山札の下に好きな順序で戻す。
☆カードを2枚引く。
$f13$,
  cost = 3,
  power = 2000,
  race = 'エンジェント/水簾',
  tribes = ARRAY['エンジェント', '水簾']::text[],
  card_type = 'モンスター',
  is_unique = false
WHERE name = '水銃の使い スイート・ワタソン' AND expansion = '四弾';

UPDATE cards SET
  effect_text = $f14$
・登場時、山札の上から5枚を表向きにする。それらが全て｢カードタイプ：モンスター｣であり、それぞれ違う種族を持っていたならそれらの中から1枚を手札に加え、場にある☆の効果を使用する。残りは山札の下に好きな順序で戻す。
☆山札の上から2枚をエナジー化する。
$f14$,
  cost = 5,
  power = 3000,
  race = 'エンジェント/フォレスター',
  tribes = ARRAY['エンジェント', 'フォレスター']::text[],
  card_type = 'モンスター',
  is_unique = false
WHERE name = '森鎚の使い フォルス・キリマイヤ' AND expansion = '四弾';

UPDATE cards SET
  effect_text = $f15$
・カウンター3
・登場時、山札の上から5枚を表向きにする。それらが全て｢カードタイプ：モンスター｣であり、それぞれ違う種族を持っていたならそれらの中から1枚を手札に加え、場にある☆の効果を使用する。残りは山札の下に好きな順序で戻す。
☆手札を1枚捨て、相手モンスターを1体選び破壊する。
$f15$,
  cost = 4,
  power = 3000,
  race = 'エンジェント/悪魔',
  tribes = ARRAY['エンジェント', '悪魔']::text[],
  card_type = 'モンスター',
  is_unique = false
WHERE name = '魔拳の使い マジガン・バクラシュ' AND expansion = '四弾';

UPDATE cards SET
  effect_text = $f16$
・このカードが手札にある時、このカードを捨てても良い。そうしたらこのターン、次に使用する「もち」または「むに」カードのコストを3減らす。ただしコストは1より小さくならない。
$f16$,
  cost = 0,
  power = NULL,
  race = NULL,
  tribes = NULL,
  card_type = 'マテリアル',
  is_unique = false
WHERE name = 'もちむにの果実' AND expansion = '四弾';

UPDATE cards SET
  effect_text = $f17$
・山札の上から3枚を見る。その中から名前の異なる「もち」または「むに」カードを最大2枚まで場に出す。このようにして場に出したカードのコストの合計以下のコストを持つ相手モンスターを1体選び破壊する。残りは好きな順序で山札の下に置く。
$f17$,
  cost = 12,
  power = NULL,
  race = NULL,
  tribes = NULL,
  card_type = '呪文',
  is_unique = false
WHERE name = 'もちもちばーん' AND expansion = '四弾';

UPDATE cards SET
  effect_text = $f18$
・登場時、山札から2枚を表向きにする。その中の「種族：メルヘン」を好きな数手札に加える。
$f18$,
  cost = 5,
  power = 2500,
  race = 'メルヘン',
  tribes = ARRAY['メルヘン']::text[],
  card_type = 'モンスター',
  is_unique = false
WHERE name = 'うさもちぃ' AND expansion = '四弾';

UPDATE cards SET
  effect_text = $f19$
・登場時、墓地にある「もち」または「むに」カードを1枚選び手札に加える。
$f19$,
  cost = 5,
  power = 1500,
  race = 'メルヘン',
  tribes = ARRAY['メルヘン']::text[],
  card_type = 'モンスター',
  is_unique = false
WHERE name = 'むにかめ' AND expansion = '四弾';

UPDATE cards SET
  effect_text = $f20$
・攻撃時、他のモンスター1体に「能力：速攻」を与える。
$f20$,
  cost = 7,
  power = 3500,
  race = 'メルヘン',
  tribes = ARRAY['メルヘン']::text[],
  card_type = 'エボルモンスター',
  is_unique = false
WHERE name = 'ありもち' AND expansion = '四弾';

UPDATE cards SET
  effect_text = $f21$
・ガードナー
・攻撃時、墓地のカード1枚を選び手札に加える。
$f21$,
  cost = 6,
  power = 3500,
  race = 'メルヘン',
  tribes = ARRAY['メルヘン']::text[],
  card_type = 'エボルモンスター',
  is_unique = false
WHERE name = 'きりむにす' AND expansion = '四弾';

UPDATE cards SET
  effect_text = $f22$
・登場時、山札の上から1枚をエナジー化する。
$f22$,
  cost = 6,
  power = 2500,
  race = 'メルヘン',
  tribes = ARRAY['メルヘン']::text[],
  card_type = 'モンスター',
  is_unique = false
WHERE name = 'もちぃぬ' AND expansion = '四弾';

UPDATE cards SET
  effect_text = $f23$
・登場時、手札の「種族：魚」を相手に見せてもよい。そのカードを山札に加えシャッフルし、カードを1枚引く。
・自分の「釣り竿」カードの使用コストを1減らす。
$f23$,
  cost = 2,
  power = 1000,
  race = '雷人',
  tribes = ARRAY['雷人']::text[],
  card_type = 'モンスター',
  is_unique = false
WHERE name = '稲光釣人 "釣り''ザキッド' AND expansion = '四弾';

UPDATE cards SET
  effect_text = $f24$
・山札から4枚を見て「釣り」カードを1枚相手に見せてから手札に加えてもよい。こうして手札に加えた場合、残りを山札の上に、そうでないなら山札の下に好きな順に戻す。
$f24$,
  cost = 3,
  power = NULL,
  race = NULL,
  tribes = NULL,
  card_type = '呪文',
  is_unique = false
WHERE name = 'イナビカリ釣具店' AND expansion = '四弾';

UPDATE cards SET
  effect_text = $f25$
・登場時、自分は3枚引き、同じ枚数を手札から山札の上へ好きな順に戻す。
・場にコスト6以上の「種族：魚」が出た時、このカードを破壊する。
$f25$,
  cost = 3,
  power = NULL,
  race = NULL,
  tribes = NULL,
  card_type = '呪文',
  is_unique = false
WHERE name = '光印の釣り竿' AND expansion = '四弾';

UPDATE cards SET
  effect_text = $f26$
・フラッシュカウンター
・登場時、相手モンスターを1体選ぶ。次ターンの終了時までそのモンスターに行動不能を与える。
・場にコスト6以上の「種族：魚」が出た時、このカードを破壊する。
$f26$,
  cost = 6,
  power = NULL,
  race = NULL,
  tribes = NULL,
  card_type = '呪文',
  is_unique = false
WHERE name = '電撃機能付き釣り竿' AND expansion = '四弾';

UPDATE cards SET
  effect_text = $f27$
・カードを1枚引き、手札からコスト3以下の「種族：魚もしくは雷人」を1体場に出す。
・自分のターン初めのドローをした時、このカードが墓地にあり場に「釣り竿」カードがあれば、場の「種族：魚もしくは雷人」を好きな数破壊してもよい。そうしたら山札を5枚を見て、その中から破壊したカードのコスト合計以下のコストを持つ「種族：魚」モンスターを場に出す。(この効果は1ターンにつき1度しか使えない。)
$f27$,
  cost = 4,
  power = NULL,
  race = NULL,
  tribes = NULL,
  card_type = '呪文',
  is_unique = false
WHERE name = '気合いのイナズマ1本釣り' AND expansion = '四弾';

UPDATE cards SET
  effect_text = $f28$
・自分のコストが5以上の｢種族：魚｣は｢能力：速攻｣を得る。
$f28$,
  cost = 3,
  power = 1000,
  race = '魚',
  tribes = ARRAY['魚']::text[],
  card_type = 'モンスター',
  is_unique = false
WHERE name = 'マミレシラス' AND expansion = '四弾';

UPDATE cards SET
  effect_text = $f29$
・ツインアタッカー
・攻撃時、山札の上から1枚目をめくりそれが｢種族：魚｣であれば場に出してもよい。
$f29$,
  cost = 7,
  power = 5000,
  race = '魚',
  tribes = ARRAY['魚']::text[],
  card_type = 'モンスター',
  is_unique = false
WHERE name = '豊作魚 イレグイマグロ' AND expansion = '四弾';

UPDATE cards SET
  effect_text = $f30$
・山札の上から｢カードタイプ：モンスター｣が出るまで、もしくは中止するまで表向きにする。こうして表向きにしたカードの枚数だけ相手シールドをブレイクする。
$f30$,
  cost = 7,
  power = NULL,
  race = NULL,
  tribes = NULL,
  card_type = '呪文',
  is_unique = true
WHERE name = 'マジック・ディストラクション' AND expansion = '四弾';

UPDATE cards SET
  effect_text = $f31$
・このカードをターン初めのドローで引いた時、表向きにしてもよい。そうしたらお互いの場のカードを全て破壊する。その後、このカードと自分の手札を全て墓地に置く。
$f31$,
  cost = 100,
  power = NULL,
  race = NULL,
  tribes = NULL,
  card_type = '呪文',
  is_unique = true
WHERE name = '爆弾' AND expansion = '四弾';

UPDATE cards SET
  effect_text = $f32$
・ツインアタッカー
・登場時、自分のエナジーを好きな数墓地に置いてもよい。その数になるように相手モンスターを破壊する。そのときその数に足りなかった場合、その数になるように相手の手札を見ないで選び捨てさせる。
$f32$,
  cost = 13,
  power = 10000,
  race = '魚/神獣',
  tribes = ARRAY['魚', '神獣']::text[],
  card_type = 'モンスター',
  is_unique = true
WHERE name = '大神海 リヴァイ・アサシン' AND expansion = '四弾';

UPDATE cards SET
  effect_text = $f33$
・お互いのプレイヤーは手札を全て捨てる。
$f33$,
  cost = 10,
  power = NULL,
  race = NULL,
  tribes = NULL,
  card_type = '呪文',
  is_unique = true
WHERE name = 'リスタート' AND expansion = '四弾';

UPDATE cards SET
  effect_text = $f34$
・相手が攻撃をする時、攻撃しているそれ以外のカードを1枚破壊する。
・相手モンスターが破壊された時、それがこのターン3回目に破壊された相手カードであればこのカードを破壊する。
・このカードが破壊された時、相手は手札を自身で2枚選び捨てる。
$f34$,
  cost = 5,
  power = NULL,
  race = NULL,
  tribes = NULL,
  card_type = 'フィールド',
  is_unique = true
WHERE name = '決して堕ちぬ城塞 チェリブロス・ファミリア' AND expansion = '四弾';

