/*
  # 四弾カード追加

  1. 変更内容
    - tribesカラムを追加（種族を配列で保存）
    - image_urlカラムにデフォルト値を設定
    - 四弾のカード39枚を追加
    - ユニークカード5枚を含む
    - 新テーマ「アドアリアの夜」「もちむに」「釣り」を追加
    - 新カードタイプ「フィールド」と「マテリアル」を含む

  2. 新カードタイプ
    - フィールド: 場に配置される特殊カード
    - マテリアル: コスト無しの特殊カード

  3. セキュリティ
    - 既存のRLSポリシーが適用されます
*/

-- tribesカラムを追加（まだ存在しない場合）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cards' AND column_name = 'tribes'
  ) THEN
    ALTER TABLE cards ADD COLUMN tribes text[];
  END IF;
END $$;

-- image_urlにデフォルト値を設定
ALTER TABLE cards ALTER COLUMN image_url SET DEFAULT '';
ALTER TABLE cards ALTER COLUMN image_url DROP NOT NULL;

-- 四弾のカードを追加（重複チェック付き）
DO $$
BEGIN
  -- 通常モンスター
  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = '欲望の精霊 眠れる森のオー・ローラ' AND expansion = '四弾') THEN
    INSERT INTO cards (name, cost, card_type, tribes, abilities, power, effect_text, expansion, is_unique) VALUES
    ('欲望の精霊 眠れる森のオー・ローラ', 8, 'モンスター', ARRAY['精霊', 'メルヘン'], ARRAY['リブートアタッカー'], 5000, '・このモンスターはブート状態で場に出る。
・エボルシナジー：登場時、このモンスターをリブートする。
・このモンスターのリブート時、相手モンスターを1体選びスリープさせる。
・このモンスターは相手に選ばれず、場に自分の「種族：精霊使い」が無ければ攻撃できない。', '四弾', false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = '城将機竜 トルネイド・フォトン・ドラゴン' AND expansion = '四弾') THEN
    INSERT INTO cards (name, cost, card_type, tribes, abilities, power, effect_text, expansion, is_unique) VALUES
    ('城将機竜 トルネイド・フォトン・ドラゴン', 8, 'モンスター', ARRAY['ドラゴン', '改造龍機'], ARRAY['エボル', 'ツインアタッカー'], 4000, '・登場時、相手モンスター2体を手札に戻す。', '四弾', false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = 'ヴェロキ・ヴェプトル' AND expansion = '四弾') THEN
    INSERT INTO cards (name, cost, card_type, tribes, abilities, power, effect_text, expansion, is_unique) VALUES
    ('ヴェロキ・ヴェプトル', 5, 'モンスター', ARRAY['ダイノガン', '古代兵器'], ARRAY['リブートアタッカー'], 2000, '', '四弾', false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = 'ダイ銃士 ヴェロキレイバー' AND expansion = '四弾') THEN
    INSERT INTO cards (name, cost, card_type, tribes, abilities, power, effect_text, expansion, is_unique) VALUES
    ('ダイ銃士 ヴェロキレイバー', 7, 'モンスター', ARRAY['ダイノガン', '古代兵器'], ARRAY['エボル'], 3000, '・自分の「種族：ダイノガン」のリブート時、このカードを手札から3コストで召喚してもよい。
・エボルシナジー：自分モンスターの攻撃時、そのモンスターをリブートさせる。(この効果は1ターンに1度まで発動する。)', '四弾', false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = '拳華屋 ストレイト' AND expansion = '四弾') THEN
    INSERT INTO cards (name, cost, card_type, tribes, abilities, power, effect_text, expansion, is_unique) VALUES
    ('拳華屋 ストレイト', 5, 'モンスター', ARRAY['スピードノイザー'], ARRAY['エボル'], 1000, '・登場時、相手モンスターを1体選び破壊する。その後相手のシールドを1枚ブレイクする。
・エボルシナジー：ツインアタッカー', '四弾', false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = '双剣からなる者' AND expansion = '四弾') THEN
    INSERT INTO cards (name, cost, card_type, tribes, abilities, power, effect_text, expansion, is_unique) VALUES
    ('双剣からなる者', 4, 'モンスター', ARRAY['戦士'], ARRAY['リブートアタッカー'], 2000, '', '四弾', false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = 'ヒノボール' AND expansion = '四弾') THEN
    INSERT INTO cards (name, cost, card_type, tribes, abilities, power, effect_text, expansion, is_unique) VALUES
    ('ヒノボール', 3, 'モンスター', ARRAY['モンストロ', 'フレイマー'], ARRAY['カウンター2', 'ファイトアタッカー'], 3000, '・このモンスターは相手プレイヤーを攻撃できない。', '四弾', false);
  END IF;

  -- アドアリアの夜テーマ
  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = 'アドアリアの夜' AND expansion = '四弾') THEN
    INSERT INTO cards (name, cost, card_type, tribes, abilities, power, effect_text, expansion, is_unique) VALUES
    ('アドアリアの夜', 8, 'フィールド', ARRAY[]::text[], ARRAY[]::text[], NULL, '・自分のエナジーが7枚以上あり、それらがそれぞれ違う種族を持っていたならその枚数だけ手札にあるこのカードのコストは少なくなる。
・登場時または自分のターン開始時、山札から3枚を表向きにする。それらが全て｢カードタイプ：モンスター｣であり、それぞれ違う種族を持っていたなら、場にある☆の効果を使用する。残りは山札の下に好きな順序で戻す。
☆自分の場にあるカードの種族を数える。相手は次の自身のターン終了時まで、その枚数分、使用するカードの効果を無視する。(自分は同名の他カードを含めたこの効果をゲーム中1度しか使用できない。)', '四弾', false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = '炎剣の使い エンラスト・フレア' AND expansion = '四弾') THEN
    INSERT INTO cards (name, cost, card_type, tribes, abilities, power, effect_text, expansion, is_unique) VALUES
    ('炎剣の使い エンラスト・フレア', 3, 'モンスター', ARRAY['エンジェント', 'フレイマー'], ARRAY[]::text[], 2000, '・登場時、山札の上から5枚を表向きにする。それらが全て｢カードタイプ：モンスター｣であり、それぞれ違う種族を持っていたならそれらの中から1枚を手札に加え、場にある☆の効果を使用する。残りは山札の下に好きな順序で戻す。
☆自分モンスター1体を選ぶ。それはこのターン｢能力：速攻、ツインアタッカー｣を得る。', '四弾', false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = '水銃の使い スイート・ワタソン' AND expansion = '四弾') THEN
    INSERT INTO cards (name, cost, card_type, tribes, abilities, power, effect_text, expansion, is_unique) VALUES
    ('水銃の使い スイート・ワタソン', 3, 'モンスター', ARRAY['エンジェント', '水簾'], ARRAY[]::text[], 2000, '・登場時、山札の上から5枚を表向きにする。それらが全て｢カードタイプ：モンスター｣であり、それぞれ違う種族を持っていたならそれらの中から1枚を手札に加え、場にある☆の効果を使用する。残りは山札の下に好きな順序で戻す。
☆カードを2枚引く。', '四弾', false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = '森鎚の使い フォルス・キリマイヤ' AND expansion = '四弾') THEN
    INSERT INTO cards (name, cost, card_type, tribes, abilities, power, effect_text, expansion, is_unique) VALUES
    ('森鎚の使い フォルス・キリマイヤ', 5, 'モンスター', ARRAY['エンジェント', 'フォレスター'], ARRAY[]::text[], 3000, '・登場時、山札の上から5枚を表向きにする。それらが全て｢カードタイプ：モンスター｣であり、それぞれ違う種族を持っていたならそれらの中から1枚を手札に加え、場にある☆の効果を使用する。残りは山札の下に好きな順序で戻す。
☆山札の上から2枚をエナジー化する。', '四弾', false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = '魔拳の使い マジガン・バクラシュ' AND expansion = '四弾') THEN
    INSERT INTO cards (name, cost, card_type, tribes, abilities, power, effect_text, expansion, is_unique) VALUES
    ('魔拳の使い マジガン・バクラシュ', 4, 'モンスター', ARRAY['エンジェント', '悪魔'], ARRAY['カウンター3'], 3000, '・登場時、山札の上から5枚を表向きにする。それらが全て｢カードタイプ：モンスター｣であり、それぞれ違う種族を持っていたならそれらの中から1枚を手札に加え、場にある☆の効果を使用する。残りは山札の下に好きな順序で戻す。
☆手札を1枚捨て、相手モンスターを1体選び破壊する。', '四弾', false);
  END IF;

  -- もちむにテーマ
  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = 'もちむにの果実' AND expansion = '四弾') THEN
    INSERT INTO cards (name, cost, card_type, tribes, abilities, power, effect_text, expansion, is_unique) VALUES
    ('もちむにの果実', 0, 'マテリアル', ARRAY[]::text[], ARRAY[]::text[], NULL, '・このカードが手札にある時、このカードを捨てても良い。そうしたらこのターン、次に使用する「もち」または「むに」カードのコストを3減らす。ただしコストは1より小さくならない。', '四弾', false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = 'もちもちばーん' AND expansion = '四弾') THEN
    INSERT INTO cards (name, cost, card_type, tribes, abilities, power, effect_text, expansion, is_unique) VALUES
    ('もちもちばーん', 12, '魔法', ARRAY[]::text[], ARRAY[]::text[], NULL, '・山札の上から3枚を見る。その中から名前の異なる「もち」または「むに」カードを最大2枚まで場に出す。このようにして場に出したカードのコストの合計以下のコストを持つ相手モンスターを1体選び破壊する。残りは好きな順序で山札の下に置く。', '四弾', false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = 'うさもちぃ' AND expansion = '四弾') THEN
    INSERT INTO cards (name, cost, card_type, tribes, abilities, power, effect_text, expansion, is_unique) VALUES
    ('うさもちぃ', 5, 'モンスター', ARRAY['メルヘン'], ARRAY[]::text[], 2500, '・登場時、山札から2枚を表向きにする。その中の「種族：メルヘン」を好きな数手札に加える。', '四弾', false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = 'むにかめ' AND expansion = '四弾') THEN
    INSERT INTO cards (name, cost, card_type, tribes, abilities, power, effect_text, expansion, is_unique) VALUES
    ('むにかめ', 5, 'モンスター', ARRAY['メルヘン'], ARRAY[]::text[], 1500, '・登場時、墓地にある「もち」または「むに」カードを1枚選び手札に加える。', '四弾', false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = 'ありもち' AND expansion = '四弾') THEN
    INSERT INTO cards (name, cost, card_type, tribes, abilities, power, effect_text, expansion, is_unique) VALUES
    ('ありもち', 7, 'モンスター', ARRAY['メルヘン'], ARRAY['エボル'], 3500, '・攻撃時、他のモンスター1体に「能力：速攻」を与える。', '四弾', false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = 'きりむにす' AND expansion = '四弾') THEN
    INSERT INTO cards (name, cost, card_type, tribes, abilities, power, effect_text, expansion, is_unique) VALUES
    ('きりむにす', 6, 'モンスター', ARRAY['メルヘン'], ARRAY['エボル', 'ガードナー'], 3500, '・攻撃時、墓地のカード1枚を選び手札に加える。', '四弾', false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = 'もちぃぬ' AND expansion = '四弾') THEN
    INSERT INTO cards (name, cost, card_type, tribes, abilities, power, effect_text, expansion, is_unique) VALUES
    ('もちぃぬ', 6, 'モンスター', ARRAY['メルヘン'], ARRAY[]::text[], 2500, '・登場時、山札の上から1枚をエナジー化する。', '四弾', false);
  END IF;

  -- 釣りテーマ
  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = '稲光釣人 "釣り''ザキッド' AND expansion = '四弾') THEN
    INSERT INTO cards (name, cost, card_type, tribes, abilities, power, effect_text, expansion, is_unique) VALUES
    ('稲光釣人 "釣り''ザキッド', 2, 'モンスター', ARRAY['雷人'], ARRAY[]::text[], 1000, '・登場時、手札の「種族：魚」を相手に見せてもよい。そのカードを山札に加えシャッフルし、カードを1枚引く。
・自分の「釣り竿」カードの使用コストを1減らす。', '四弾', false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = 'イナビカリ釣具店' AND expansion = '四弾') THEN
    INSERT INTO cards (name, cost, card_type, tribes, abilities, power, effect_text, expansion, is_unique) VALUES
    ('イナビカリ釣具店', 3, '魔法', ARRAY[]::text[], ARRAY[]::text[], NULL, '・山札から4枚を見て「釣り」カードを1枚相手に見せてから手札に加えてもよい。こうして手札に加えた場合、残りを山札の上に、そうでないなら山札の下に好きな順に戻す。', '四弾', false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = '光印の釣り竿' AND expansion = '四弾') THEN
    INSERT INTO cards (name, cost, card_type, tribes, abilities, power, effect_text, expansion, is_unique) VALUES
    ('光印の釣り竿', 3, '魔法', ARRAY[]::text[], ARRAY[]::text[], NULL, '・登場時、自分は3枚引き、同じ枚数を手札から山札の上へ好きな順に戻す。
・場にコスト6以上の「種族：魚」が出た時、このカードを破壊する。', '四弾', false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = '電撃機能付き釣り竿' AND expansion = '四弾') THEN
    INSERT INTO cards (name, cost, card_type, tribes, abilities, power, effect_text, expansion, is_unique) VALUES
    ('電撃機能付き釣り竿', 6, '魔法', ARRAY[]::text[], ARRAY['フラッシュカウンター'], NULL, '・登場時、相手モンスターを1体選ぶ。次ターンの終了時までそのモンスターに行動不能を与える。
・場にコスト6以上の「種族：魚」が出た時、このカードを破壊する。', '四弾', false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = '気合いのイナズマ1本釣り' AND expansion = '四弾') THEN
    INSERT INTO cards (name, cost, card_type, tribes, abilities, power, effect_text, expansion, is_unique) VALUES
    ('気合いのイナズマ1本釣り', 4, '魔法', ARRAY[]::text[], ARRAY[]::text[], NULL, '・カードを1枚引き、手札からコスト3以下の「種族：魚もしくは雷人」を1体場に出す。
・自分のターン初めのドローをした時、このカードが墓地にあり場に「釣り竿」カードがあれば、場の「種族：魚もしくは雷人」を好きな数破壊してもよい。そうしたら山札を5枚を見て、その中から破壊したカードのコスト合計以下のコストを持つ「種族：魚」モンスターを場に出す。(この効果は1ターンにつき1度しか使えない。)', '四弾', false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = 'マミレシラス' AND expansion = '四弾') THEN
    INSERT INTO cards (name, cost, card_type, tribes, abilities, power, effect_text, expansion, is_unique) VALUES
    ('マミレシラス', 3, 'モンスター', ARRAY['魚'], ARRAY[]::text[], 1000, '・自分のコストが5以上の｢種族：魚｣は｢能力：速攻｣を得る。', '四弾', false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = '豊作魚 イレグイマグロ' AND expansion = '四弾') THEN
    INSERT INTO cards (name, cost, card_type, tribes, abilities, power, effect_text, expansion, is_unique) VALUES
    ('豊作魚 イレグイマグロ', 7, 'モンスター', ARRAY['魚'], ARRAY['ツインアタッカー'], 5000, '・攻撃時、山札の上から1枚目をめくりそれが｢種族：魚｣であれば場に出してもよい。', '四弾', false);
  END IF;

  -- 通常魔法
  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = '大切断' AND expansion = '四弾') THEN
    INSERT INTO cards (name, cost, card_type, tribes, abilities, power, effect_text, expansion, is_unique) VALUES
    ('大切断', 8, '魔法', ARRAY[]::text[], ARRAY['カウンター6'], NULL, '・パワー5000以下のモンスターを全て破壊する。', '四弾', false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = '閃光' AND expansion = '四弾') THEN
    INSERT INTO cards (name, cost, card_type, tribes, abilities, power, effect_text, expansion, is_unique) VALUES
    ('閃光', 4, '魔法', ARRAY[]::text[], ARRAY['フラッシュカウンター'], NULL, '・相手モンスターを1体選びスリープさせる。', '四弾', false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = '魔鍵の宝箱' AND expansion = '四弾') THEN
    INSERT INTO cards (name, cost, card_type, tribes, abilities, power, effect_text, expansion, is_unique) VALUES
    ('魔鍵の宝箱', 3, '魔法', ARRAY[]::text[], ARRAY[]::text[], NULL, '・手札を1枚捨て1枚引く。捨てたカードが｢カードタイプ：魔法｣であればさらにもう1枚引く。', '四弾', false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = 'モンスター・ゲート' AND expansion = '四弾') THEN
    INSERT INTO cards (name, cost, card_type, tribes, abilities, power, effect_text, expansion, is_unique) VALUES
    ('モンスター・ゲート', 6, '魔法', ARRAY[]::text[], ARRAY[]::text[], NULL, '・手札を1枚捨てる。その後、山札を確認しモンスター1枚を選び相手に見せてからそれを手札に加える。', '四弾', false);
  END IF;

  -- ユニークカード
  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = 'マジック・ディストラクション' AND expansion = '四弾') THEN
    INSERT INTO cards (name, cost, card_type, tribes, abilities, power, effect_text, expansion, is_unique) VALUES
    ('マジック・ディストラクション', 7, '魔法', ARRAY[]::text[], ARRAY[]::text[], NULL, '・山札の上から｢カードタイプ：モンスター｣が出るまで、もしくは中止するまで表向きにする。こうして表向きにしたカードの枚数だけ相手シールドをブレイクする。', '四弾', true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = '爆弾' AND expansion = '四弾') THEN
    INSERT INTO cards (name, cost, card_type, tribes, abilities, power, effect_text, expansion, is_unique) VALUES
    ('爆弾', 100, '魔法', ARRAY[]::text[], ARRAY[]::text[], NULL, '・このカードをターン初めのドローで引いた時、表向きにしてもよい。そうしたらお互いの場のカードを全て破壊する。その後、このカードと自分の手札を全て墓地に置く。', '四弾', true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = '大神海 リヴァイ・アサシン' AND expansion = '四弾') THEN
    INSERT INTO cards (name, cost, card_type, tribes, abilities, power, effect_text, expansion, is_unique) VALUES
    ('大神海 リヴァイ・アサシン', 13, 'モンスター', ARRAY['魚', '神獣'], ARRAY['ツインアタッカー'], 10000, '・登場時、自分のエナジーを好きな数墓地に置いてもよい。その数になるように相手モンスターを破壊する。そのときその数に足りなかった場合、その数になるように相手の手札を見ないで選び捨てさせる。', '四弾', true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = 'リスタート' AND expansion = '四弾') THEN
    INSERT INTO cards (name, cost, card_type, tribes, abilities, power, effect_text, expansion, is_unique) VALUES
    ('リスタート', 10, '魔法', ARRAY[]::text[], ARRAY[]::text[], NULL, '・お互いのプレイヤーは手札を全て捨てる。', '四弾', true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM cards WHERE name = '決して堕ちぬ城塞 チェリブロス・ファミリア' AND expansion = '四弾') THEN
    INSERT INTO cards (name, cost, card_type, tribes, abilities, power, effect_text, expansion, is_unique) VALUES
    ('決して堕ちぬ城塞 チェリブロス・ファミリア', 5, 'フィールド', ARRAY[]::text[], ARRAY[]::text[], NULL, '・相手が攻撃をする時、攻撃しているそれ以外のカードを1枚破壊する。
・相手モンスターが破壊された時、それがこのターン3回目に破壊された相手カードであればこのカードを破壊する。
・このカードが破壊された時、相手は手札を自身で2枚選び捨てる。', '四弾', true);
  END IF;
END $$;