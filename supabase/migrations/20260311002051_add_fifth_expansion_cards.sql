/*
  # Add Fourth Expansion Cards

  1. Changes
    - Adds 35 new cards from the fourth expansion (四弾)
    - Includes various card types: モンスター, 呪文, フィールド, マテリアル
    - Introduces new themes: アドアリアの夜, もちむに, 釣り
    - Adds unique cards with special mechanics

  2. Card Types
    - モンスター: 23 cards with various races and abilities
    - 呪文: 8 spell cards with different effects
    - フィールド: 2 field cards
    - マテリアル: 1 material card

  3. Notable Cards
    - High-cost unique cards (コスト100 爆弾, コスト13 大神海)
    - Theme-specific cards with synergies
    - エボル (Evolution) monsters
    - Cards with カウンター (Counter) abilities

  4. Security
    - Skips duplicates by checking if card name already exists
    - All cards are set to expansion '四弾'
*/

-- Add fourth expansion cards (only if they don't already exist)
DO $$
BEGIN
  -- 欲望の精霊 眠れる森のオー・ローラ
  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = '欲望の精霊 眠れる森のオー・ローラ') THEN
    INSERT INTO cards (name, card_type, cost, race, effect_text, power, is_unique, expansion)
    VALUES ('欲望の精霊 眠れる森のオー・ローラ', 'モンスター', 8, '精霊/メルヘン', '・このモンスターはブート状態で場に出る。
・エボルシナジー：登場時、このモンスターをリブートする。
・このモンスターのリブート時、相手モンスターを1体選びスリープさせる。
・このモンスターは相手に選ばれず、場に自分の「種族：精霊使い」が無ければ攻撃できない。
・リブートアタッカー', 5000, false, '四弾');
  END IF;

  -- 城将機竜 トルネイド・フォトン・ドラゴン
  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = '城将機竜 トルネイド・フォトン・ドラゴン') THEN
    INSERT INTO cards (name, card_type, cost, race, effect_text, power, is_unique, expansion)
    VALUES ('城将機竜 トルネイド・フォトン・ドラゴン', 'モンスター', 8, 'ドラゴン/改造龍機', '・エボル
・登場時、相手モンスター2体を手札に戻す。
・ツインアタッカー', 4000, false, '四弾');
  END IF;

  -- ヴェロキ・ヴェプトル
  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = 'ヴェロキ・ヴェプトル') THEN
    INSERT INTO cards (name, card_type, cost, race, effect_text, power, is_unique, expansion)
    VALUES ('ヴェロキ・ヴェプトル', 'モンスター', 5, 'ダイノガン/古代兵器', '・リブートアタッカー', 2000, false, '四弾');
  END IF;

  -- ダイ銃士 ヴェロキレイバー
  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = 'ダイ銃士 ヴェロキレイバー') THEN
    INSERT INTO cards (name, card_type, cost, race, effect_text, power, is_unique, expansion)
    VALUES ('ダイ銃士 ヴェロキレイバー', 'モンスター', 7, 'ダイノガン/古代兵器', '・エボル
・自分の「種族：ダイノガン」のリブート時、このカードを手札から3コストで召喚してもよい。
・エボルシナジー：自分モンスターの攻撃時、そのモンスターをリブートさせる。(この効果は1ターンに1度まで発動する。)', 3000, false, '四弾');
  END IF;

  -- 大切断
  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = '大切断') THEN
    INSERT INTO cards (name, card_type, cost, race, effect_text, power, is_unique, expansion)
    VALUES ('大切断', '呪文', 8, NULL, '・カウンター6
・パワー5000以下のモンスターを全て破壊する。', NULL, false, '四弾');
  END IF;

  -- 閃光
  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = '閃光') THEN
    INSERT INTO cards (name, card_type, cost, race, effect_text, power, is_unique, expansion)
    VALUES ('閃光', '呪文', 4, NULL, '・フラッシュカウンター
・相手モンスターを1体選びスリープさせる。', NULL, false, '四弾');
  END IF;

  -- 魔鍵の宝箱
  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = '魔鍵の宝箱') THEN
    INSERT INTO cards (name, card_type, cost, race, effect_text, power, is_unique, expansion)
    VALUES ('魔鍵の宝箱', '呪文', 3, NULL, '・手札を1枚捨て1枚引く。捨てたカードが｢カードタイプ：魔法｣であればさらにもう1枚引く。', NULL, false, '四弾');
  END IF;

  -- モンスター・ゲート
  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = 'モンスター・ゲート') THEN
    INSERT INTO cards (name, card_type, cost, race, effect_text, power, is_unique, expansion)
    VALUES ('モンスター・ゲート', '呪文', 6, NULL, '・手札を1枚捨てる。その後、山札を確認しモンスター1枚を選び相手に見せてからそれを手札に加える。', NULL, false, '四弾');
  END IF;

  -- 拳華屋 ストレイト
  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = '拳華屋 ストレイト') THEN
    INSERT INTO cards (name, card_type, cost, race, effect_text, power, is_unique, expansion)
    VALUES ('拳華屋 ストレイト', 'モンスター', 5, 'スピードノイザー', '・エボル
・登場時、相手モンスターを1体選び破壊する。その後相手のシールドを1枚ブレイクする。
・エボルシナジー：ツインアタッカー', 1000, false, '四弾');
  END IF;

  -- 双剣からなる者
  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = '双剣からなる者') THEN
    INSERT INTO cards (name, card_type, cost, race, effect_text, power, is_unique, expansion)
    VALUES ('双剣からなる者', 'モンスター', 4, '戦士', '・リブートアタッカー', 2000, false, '四弾');
  END IF;

  -- ヒノボール
  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = 'ヒノボール') THEN
    INSERT INTO cards (name, card_type, cost, race, effect_text, power, is_unique, expansion)
    VALUES ('ヒノボール', 'モンスター', 3, 'モンストロ/フレイマー', '・カウンター2
・ファイトアタッカー
・このモンスターは相手プレイヤーを攻撃できない。', 3000, false, '四弾');
  END IF;

  -- アドアリアの夜
  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = 'アドアリアの夜') THEN
    INSERT INTO cards (name, card_type, cost, race, effect_text, power, is_unique, expansion)
    VALUES ('アドアリアの夜', 'フィールド', 8, NULL, '・自分のエナジーが7枚以上あり、それらがそれぞれ違う種族を持っていたならその枚数だけ手札にあるこのカードのコストは少なくなる。
・登場時または自分のターン開始時、山札から3枚を表向きにする。それらが全て｢カードタイプ：モンスター｣であり、それぞれ違う種族を持っていたなら、場にある☆の効果を使用する。残りは山札の下に好きな順序で戻す。
☆自分の場にあるカードの種族を数える。相手は次の自身のターン終了時まで、その枚数分、使用するカードの効果を無視する。(自分は同名の他カードを含めたこの効果をゲーム中1度しか使用できない。)', NULL, false, '四弾');
  END IF;

  -- 炎剣の使い エンラスト・フレア
  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = '炎剣の使い エンラスト・フレア') THEN
    INSERT INTO cards (name, card_type, cost, race, effect_text, power, is_unique, expansion)
    VALUES ('炎剣の使い エンラスト・フレア', 'モンスター', 3, 'エンジェント/フレイマー', '・登場時、山札の上から5枚を表向きにする。それらが全て｢カードタイプ：モンスター｣であり、それぞれ違う種族を持っていたならそれらの中から1枚を手札に加え、場にある☆の効果を使用する。残りは山札の下に好きな順序で戻す。
☆自分モンスター1体を選ぶ。それはこのターン｢能力：速攻、ツインアタッカー｣を得る。', 2000, false, '四弾');
  END IF;

  -- 水銃の使い スイート・ワタソン
  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = '水銃の使い スイート・ワタソン') THEN
    INSERT INTO cards (name, card_type, cost, race, effect_text, power, is_unique, expansion)
    VALUES ('水銃の使い スイート・ワタソン', 'モンスター', 3, 'エンジェント/水簾', '・登場時、山札の上から5枚を表向きにする。それらが全て｢カードタイプ：モンスター｣であり、それぞれ違う種族を持っていたならそれらの中から1枚を手札に加え、場にある☆の効果を使用する。残りは山札の下に好きな順序で戻す。
☆カードを2枚引く。', 2000, false, '四弾');
  END IF;

  -- 森鎚の使い フォルス・キリマイヤ
  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = '森鎚の使い フォルス・キリマイヤ') THEN
    INSERT INTO cards (name, card_type, cost, race, effect_text, power, is_unique, expansion)
    VALUES ('森鎚の使い フォルス・キリマイヤ', 'モンスター', 5, 'エンジェント/フォレスター', '・登場時、山札の上から5枚を表向きにする。それらが全て｢カードタイプ：モンスター｣であり、それぞれ違う種族を持っていたならそれらの中から1枚を手札に加え、場にある☆の効果を使用する。残りは山札の下に好きな順序で戻す。
☆山札の上から2枚をエナジー化する。', 3000, false, '四弾');
  END IF;

  -- 魔拳の使い マジガン・バクラシュ
  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = '魔拳の使い マジガン・バクラシュ') THEN
    INSERT INTO cards (name, card_type, cost, race, effect_text, power, is_unique, expansion)
    VALUES ('魔拳の使い マジガン・バクラシュ', 'モンスター', 4, 'エンジェント/悪魔', '・カウンター3
・登場時、山札の上から5枚を表向きにする。それらが全て｢カードタイプ：モンスター｣であり、それぞれ違う種族を持っていたならそれらの中から1枚を手札に加え、場にある☆の効果を使用する。残りは山札の下に好きな順序で戻す。
☆手札を1枚捨て、相手モンスターを1体選び破壊する。', 3000, false, '四弾');
  END IF;

  -- もちむにの果実
  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = 'もちむにの果実') THEN
    INSERT INTO cards (name, card_type, cost, race, effect_text, power, is_unique, expansion)
    VALUES ('もちむにの果実', 'マテリアル', 0, NULL, '・このカードが手札にある時、このカードを捨てても良い。そうしたらこのターン、次に使用する「もち」または「むに」カードのコストを3減らす。ただしコストは1より小さくならない。', NULL, false, '四弾');
  END IF;

  -- もちもちばーん
  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = 'もちもちばーん') THEN
    INSERT INTO cards (name, card_type, cost, race, effect_text, power, is_unique, expansion)
    VALUES ('もちもちばーん', '呪文', 12, NULL, '・山札の上から3枚を見る。その中から名前の異なる「もち」または「むに」カードを最大2枚まで場に出す。このようにして場に出したカードのコストの合計以下のコストを持つ相手モンスターを1体選び破壊する。残りは好きな順序で山札の下に置く。', NULL, false, '四弾');
  END IF;

  -- うさもちぃ
  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = 'うさもちぃ') THEN
    INSERT INTO cards (name, card_type, cost, race, effect_text, power, is_unique, expansion)
    VALUES ('うさもちぃ', 'モンスター', 5, 'メルヘン', '・登場時、山札から2枚を表向きにする。その中の「種族：メルヘン」を好きな数手札に加える。', 2500, false, '四弾');
  END IF;

  -- むにかめ
  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = 'むにかめ') THEN
    INSERT INTO cards (name, card_type, cost, race, effect_text, power, is_unique, expansion)
    VALUES ('むにかめ', 'モンスター', 5, 'メルヘン', '・登場時、墓地にある「もち」または「むに」カードを1枚選び手札に加える。', 1500, false, '四弾');
  END IF;

  -- ありもち
  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = 'ありもち') THEN
    INSERT INTO cards (name, card_type, cost, race, effect_text, power, is_unique, expansion)
    VALUES ('ありもち', 'モンスター', 7, 'メルヘン', '・エボル
・攻撃時、他のモンスター1体に「能力：速攻」を与える。', 3500, false, '四弾');
  END IF;

  -- きりむにす
  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = 'きりむにす') THEN
    INSERT INTO cards (name, card_type, cost, race, effect_text, power, is_unique, expansion)
    VALUES ('きりむにす', 'モンスター', 6, 'メルヘン', '・エボル
・ガードナー
・攻撃時、墓地のカード1枚を選び手札に加える。', 3500, false, '四弾');
  END IF;

  -- もちぃぬ
  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = 'もちぃぬ') THEN
    INSERT INTO cards (name, card_type, cost, race, effect_text, power, is_unique, expansion)
    VALUES ('もちぃぬ', 'モンスター', 6, 'メルヘン', '・登場時、山札の上から1枚をエナジー化する。', 2500, false, '四弾');
  END IF;

  -- 稲光釣人 "釣り''ザキッド
  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = '稲光釣人 "釣り''ザキッド') THEN
    INSERT INTO cards (name, card_type, cost, race, effect_text, power, is_unique, expansion)
    VALUES ('稲光釣人 "釣り''ザキッド', 'モンスター', 2, '雷人', '・登場時、手札の「種族：魚」を相手に見せてもよい。そのカードを山札に加えシャッフルし、カードを1枚引く。
・自分の「釣り竿」カードの使用コストを1減らす。', 1000, false, '四弾');
  END IF;

  -- イナビカリ釣具店
  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = 'イナビカリ釣具店') THEN
    INSERT INTO cards (name, card_type, cost, race, effect_text, power, is_unique, expansion)
    VALUES ('イナビカリ釣具店', '呪文', 3, NULL, '・山札から4枚を見て「釣り」カードを1枚相手に見せてから手札に加えてもよい。こうして手札に加えた場合、残りを山札の上に、そうでないなら山札の下に好きな順に戻す。', NULL, false, '四弾');
  END IF;

  -- 光印の釣り竿
  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = '光印の釣り竿') THEN
    INSERT INTO cards (name, card_type, cost, race, effect_text, power, is_unique, expansion)
    VALUES ('光印の釣り竿', '装備', 3, NULL, '・登場時、自分は3枚引き、同じ枚数を手札から山札の上へ好きな順に戻す。
・場にコスト6以上の「種族：魚」が出た時、このカードを破壊する。', NULL, false, '四弾');
  END IF;

  -- 電撃機能付き釣り竿
  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = '電撃機能付き釣り竿') THEN
    INSERT INTO cards (name, card_type, cost, race, effect_text, power, is_unique, expansion)
    VALUES ('電撃機能付き釣り竿', '装備', 6, NULL, '・フラッシュカウンター
・登場時、相手モンスターを1体選ぶ。次ターンの終了時までそのモンスターに行動不能を与える。
・場にコスト6以上の「種族：魚」が出た時、このカードを破壊する。', NULL, false, '四弾');
  END IF;

  -- 気合いのイナズマ1本釣り
  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = '気合いのイナズマ1本釣り') THEN
    INSERT INTO cards (name, card_type, cost, race, effect_text, power, is_unique, expansion)
    VALUES ('気合いのイナズマ1本釣り', '呪文', 4, NULL, '・カードを1枚引き、手札からコスト3以下の「種族：魚もしくは雷人」を1体場に出す。
・自分のターン初めのドローをした時、このカードが墓地にあり場に「釣り竿」カードがあれば、場の「種族：魚もしくは雷人」を好きな数破壊してもよい。そうしたら山札を5枚を見て、その中から破壊したカードのコスト合計以下のコストを持つ「種族：魚」モンスターを場に出す。(この効果は1ターンにつき1度しか使えない。)', NULL, false, '四弾');
  END IF;

  -- マミレシラス
  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = 'マミレシラス') THEN
    INSERT INTO cards (name, card_type, cost, race, effect_text, power, is_unique, expansion)
    VALUES ('マミレシラス', 'モンスター', 3, '魚', '・自分のコストが5以上の｢種族：魚｣は｢能力：速攻｣を得る。', 1000, false, '四弾');
  END IF;

  -- 豊作魚 イレグイマグロ
  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = '豊作魚 イレグイマグロ') THEN
    INSERT INTO cards (name, card_type, cost, race, effect_text, power, is_unique, expansion)
    VALUES ('豊作魚 イレグイマグロ', 'モンスター', 7, '魚', '・ツインアタッカー
・攻撃時、山札の上から1枚目をめくりそれが｢種族：魚｣であれば場に出してもよい。', 5000, false, '四弾');
  END IF;

  -- マジック・ディストラクション
  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = 'マジック・ディストラクション') THEN
    INSERT INTO cards (name, card_type, cost, race, effect_text, power, is_unique, expansion)
    VALUES ('マジック・ディストラクション', '呪文', 7, NULL, '・山札の上から｢カードタイプ：モンスター｣が出るまで、もしくは中止するまで表向きにする。こうして表向きにしたカードの枚数だけ相手シールドをブレイクする。', NULL, true, '四弾');
  END IF;

  -- 爆弾
  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = '爆弾') THEN
    INSERT INTO cards (name, card_type, cost, race, effect_text, power, is_unique, expansion)
    VALUES ('爆弾', '呪文', 100, NULL, '・このカードをターン初めのドローで引いた時、表向きにしてもよい。そうしたらお互いの場のカードを全て破壊する。その後、このカードと自分の手札を全て墓地に置く。', NULL, true, '四弾');
  END IF;

  -- 大神海 リヴァイ・アサシン
  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = '大神海 リヴァイ・アサシン') THEN
    INSERT INTO cards (name, card_type, cost, race, effect_text, power, is_unique, expansion)
    VALUES ('大神海 リヴァイ・アサシン', 'モンスター', 13, '魚/神獣', '・ツインアタッカー
・登場時、自分のエナジーを好きな数墓地に置いてもよい。その数になるように相手モンスターを破壊する。そのときその数に足りなかった場合、その数になるように相手の手札を見ないで選び捨てさせる。', 10000, true, '四弾');
  END IF;

  -- リスタート
  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = 'リスタート') THEN
    INSERT INTO cards (name, card_type, cost, race, effect_text, power, is_unique, expansion)
    VALUES ('リスタート', '呪文', 10, NULL, '・お互いのプレイヤーは手札を全て捨てる。', NULL, true, '四弾');
  END IF;

  -- 決して堕ちぬ城塞 チェリブロス・ファミリア
  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = '決して堕ちぬ城塞 チェリブロス・ファミリア') THEN
    INSERT INTO cards (name, card_type, cost, race, effect_text, power, is_unique, expansion)
    VALUES ('決して堕ちぬ城塞 チェリブロス・ファミリア', 'フィールド', 5, NULL, '・相手が攻撃をする時、攻撃しているそれ以外のカードを1枚破壊する。
・相手モンスターが破壊された時、それがこのターン3回目に破壊された相手カードであればこのカードを破壊する。
・このカードが破壊された時、相手は手札を自身で2枚選び捨てる。', NULL, true, '四弾');
  END IF;
END $$;