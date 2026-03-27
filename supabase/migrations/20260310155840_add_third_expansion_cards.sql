/*
  # Add Third Expansion Cards (三弾)

  1. New Cards
    - General/Theme Enhancement Cards (汎用+テーマ強化)
      - 悪魔 藤蝶羽 (Cost 1, Monster, 悪魔/堕虫)
      - 電導師 シカルバ (Cost 9, Monster, フォレスター)
      - 運命の精霊 ディスティー (Cost 5, Evol Monster, スピリッツ/精霊)
      - 熱狂騒大 ノイズ＝ザ・ライブ (Cost 4, Spell)
      - 比類なき和音 レディ・ボン・バレラ (Cost 3, Equipment, 装具/精霊)
      - エナジーホール (Cost 4, Spell)
      - ハジけるアイドル ピーチソーダ (Cost 3, Monster, アイドル)
      - 剣残 ティファ・リリア (Cost 5, Evol Monster, 戦士)
      - 巌壁の土進兵 (Cost 5, Evol Monster, 虚兵/ゴーレム)
      - ヘルメシアのスピードシューズ (Cost 4, Equipment, 装具/神器)
      - リバイバル・リサイタル (Cost 9, Spell)
      - Aリアン グレイ (Cost 8, Evol Monster, ギャラクシアン)
    
    - Dachū Theme Cards (テーマ｢堕虫｣)
      - 巨悪昆虫 篦玖䋱寿王兜 (Cost 7, Evol Monster, 堕虫/皇帝種)
      - 絶景 夜営蛍 (Cost 2, Monster, 堕虫)
      - 戒律 闇蜘蛛 (Cost 3, Monster, 堕虫)
      - 武人 緋鎌斬 (Cost 4, Monster, 堕虫)
      - 伽藍堂 棟梁飛蝗 (Cost 6, Evol Monster, 堕虫)
      - 加速 金蜻蜓 (Cost 5, Evol Monster, 堕虫)
      - 集益 千虫理威 (Cost 4, Spell)
    
    - Dainogan Theme Cards (ダイノガン)
      - テラ・ティラノ (Cost 5, Monster, ダイノガン/古代兵器)
      - プテラ・プドン (Cost 5, Monster, ダイノガン/古代兵器)
      - トラセラ・トリケラ (Cost 5, Monster, ダイノガン/古代兵器)
      - ダイ戦士 ティライガーZ (Cost 7, Evol Monster, ダイノガン/古代兵器)
      - ダイ剣士 プテラオン (Cost 7, Evol Monster, ダイノガン/古代兵器)
      - ダイ盾士 トリケムズ (Cost 7, Evol Monster, ダイノガン/古代兵器)
    
    - Dragon Tamer Theme Cards (ドラゴンテイマー)
      - 竜伝承のグリモア (Cost 5, Evol Monster, ドラゴンテイマー)
      - 竜呼びの杖 (Cost 7, Equipment, 杖/ドラゴンテイマー)
      - 砲大我竜 キャノークス・ドラゴン (Cost 9, Monster, ドラゴン/改造龍機)
      - 弾丸 バレドラン (Cost 4, Monster, ドラゴン/改造龍機)
      - 竜潜術 (Cost 1, Spell)
    
    - Unique Cards (ユニークカード)
      - 不死鳥の羽 (Cost 4, Equipment, アクセサリー/神獣)
      - 最速神 ヘルメシア (Cost 1, Monster, 神)
      - 伝説の勇者 ヘロス＝バロン1世 (Cost 5, Monster, 勇者/戦士)
      - 反撃の剛霊機兵 (Cost 3, Monster, 虚兵/ゴーレム)
      - 掴め！ビッグドリーム・JACKPOT (Cost 3, Spell)

  2. Security
    - All cards are publicly accessible
*/

-- General/Theme Enhancement Cards
INSERT INTO cards (name, card_type, cost, race, power, effect_text, expansion, is_unique, image_url)
VALUES
  ('悪魔 藤蝶羽', 'モンスター', 1, '悪魔/堕虫', 1000, '・登場時、自分の手札を1枚捨てる。
・場を離れた時、相手に自分の手札を1枚選ばせる。自分はそれを捨てる。', '三弾', false, 'https://via.placeholder.com/150x210?text=悪魔+藤蝶羽'),
  
  ('電導師 シカルバ', 'モンスター', 9, 'フォレスター', 5000, '・このモンスターを召喚する時、エナジーにある｢種族：フォレスター｣はエナジー2枚分になる。
・登場時、相手モンスターを1体選び破壊する。', '三弾', false, 'https://via.placeholder.com/150x210?text=電導師+シカルバ'),
  
  ('運命の精霊 ディスティー', 'エボルモンスター', 5, 'スピリッツ/精霊', 6000, '・攻撃時、カードを1枚引き手札にあるコスト5以下の「精霊」カードであり、かつ「種族：スピリット」を場に出してもよい。
・このモンスターは相手に選ばれず、場に自分の「種族：精霊使い」が無ければ攻撃できない。', '三弾', false, 'https://via.placeholder.com/150x210?text=運命の精霊+ディスティー'),
  
  ('ハジけるアイドル ピーチソーダ', 'モンスター', 3, 'アイドル', 1000, '・このモンスターが破壊された時、カードを1枚引く。それが自分のターンであれば更にもう1枚引く。', '三弾', false, 'https://via.placeholder.com/150x210?text=ハジけるアイドル+ピーチソーダ'),
  
  ('剣残 ティファ・リリア', 'エボルモンスター', 5, '戦士', 4000, '・カウンター3
・登場時、コスト5以下のモンスターを1体選び破壊する。', '三弾', false, 'https://via.placeholder.com/150x210?text=剣残+ティファ・リリア'),
  
  ('巌壁の土進兵', 'エボルモンスター', 5, '虚兵/ゴーレム', 6000, '・ガードナー', '三弾', false, 'https://via.placeholder.com/150x210?text=巌壁の土進兵'),
  
  ('Aリアン グレイ', 'エボルモンスター', 8, 'ギャラクシアン', 6000, '・このカードは墓地から召喚出来る。そしてこのモンスターは手札からは召喚することが出来ない。
・登場時、手札を1枚捨て、相手モンスターを2体選び破壊する。
・このモンスターは場を離れる時、山札の下に置かれる。
・エボルシナジー：ツインアタッカー、ガードナー', '三弾', false, 'https://via.placeholder.com/150x210?text=Aリアン+グレイ');

INSERT INTO cards (name, card_type, cost, race, effect_text, expansion, is_unique, image_url)
VALUES
  ('熱狂騒大 ノイズ＝ザ・ライブ', '呪文', 4, NULL, '・フラッシュカウンター
・自分の墓地にある「種族：スピードノイザー」を2枚まで手札に加えてもよい。', '三弾', false, 'https://via.placeholder.com/150x210?text=熱狂騒大+ノイズ＝ザ・ライブ'),
  
  ('比類なき和音(ハーモニー) レディ・ボン・バレラ', '装備', 3, '装具/精霊', '・このカードを装備したモンスターが離れる時、かわりにこのカードを墓地に破壊してもよい。そうしたらそのモンスターは手札に戻る。
・このカードが装備されている間、自分は自身のメインステップ以外で使用するエナジーが1減る。(この効果によってカウンターのコストは軽減されない。)
・アームズアップ：バレジェンヌ', '三弾', false, 'https://via.placeholder.com/150x210?text=比類なき和音+レディ・ボン・バレラ'),
  
  ('エナジーホール', '呪文', 4, NULL, '・自分のエナジーから2枚を選び墓地に置き相手モンスターを1体選び山札の下に送る。', '三弾', false, 'https://via.placeholder.com/150x210?text=エナジーホール'),
  
  ('ヘルメシアのスピードシューズ', '装備', 4, '装具/神器', '・装備モンスターは「能力：速攻」を得る。', '三弾', false, 'https://via.placeholder.com/150x210?text=ヘルメシアのスピードシューズ'),
  
  ('リバイバル・リサイタル', '呪文', 9, NULL, '・カウンター5
・自分の墓地にあるコストが3以下のモンスターを3体まで選び、場に出す。', '三弾', false, 'https://via.placeholder.com/150x210?text=リバイバル・リサイタル');

-- Dachū Theme Cards
INSERT INTO cards (name, card_type, cost, race, power, effect_text, expansion, is_unique, image_url)
VALUES
  ('巨悪昆虫 篦玖䋱寿王兜(ヘラクレスオオカブト)', 'エボルモンスター', 7, '堕虫/皇帝種', 6000, '・ツインアタッカー
・登場時、場にある他の｢カードタイプ：エボルモンスター｣を1対選んでもよい。そのモンスターはこのターン｢能力：エボルシナジー｣は条件を満たしていなくても使用でき、かつその効果は2回発動する。
・エボルシナジー：攻撃時、墓地から｢種族：堕虫｣を1枚選び手札に加える。そうしたら相手モンスターを1体破壊する。', '三弾', false, 'https://via.placeholder.com/150x210?text=巨悪昆虫+篦玖䋱寿王兜'),
  
  ('絶景 夜営蛍(ヤエイホタル)', 'モンスター', 2, '堕虫', 1000, '・相手ターン中、このモンスターは選ばれない。', '三弾', false, 'https://via.placeholder.com/150x210?text=絶景+夜営蛍'),
  
  ('戒律 闇蜘蛛(ヤミクモ)', 'モンスター', 3, '堕虫', 2000, '・このモンスターが破壊された時、相手は自身の手札を1枚選びそれを捨てる。', '三弾', false, 'https://via.placeholder.com/150x210?text=戒律+闇蜘蛛'),
  
  ('武人 緋鎌斬(アカカマキリ)', 'モンスター', 4, '堕虫', 4000, '・このモンスターは相手プレイヤーに攻撃できない。
・登場時、相手モンスター1体を選んでもよい。そのモンスターとバトルする。
・バトル勝利時、墓地の｢種族：堕虫｣を1枚手札に加える。', '三弾', false, 'https://via.placeholder.com/150x210?text=武人+緋鎌斬'),
  
  ('伽藍堂 棟梁飛蝗(トウリョウバッタ)', 'エボルモンスター', 6, '堕虫', 5000, '・登場時、相手のコスト3以下のモンスターを1体選び破壊する。
・エボルシナジー：攻撃時、カードを2枚引く。', '三弾', false, 'https://via.placeholder.com/150x210?text=伽藍堂+棟梁飛蝗'),
  
  ('加速 金蜻蜓(キンヤンマ)', 'エボルモンスター', 5, '堕虫', 2000, '・エボルシナジー：攻撃時、自分の場の他モンスター1体を選びリブートさせる。', '三弾', false, 'https://via.placeholder.com/150x210?text=加速+金蜻蜓');

INSERT INTO cards (name, card_type, cost, race, effect_text, expansion, is_unique, image_url)
VALUES
  ('集益 千虫理威(センチュリー)', '呪文', 4, NULL, '・エナジーにある｢種族：堕虫｣の数だけ山札の上から表向きにする。その中から｢カードタイプ：モンスター｣を1枚選び相手に見せてから手札に加える。それ以外を全て好きぬ順序で山札の下に置く。', '三弾', false, 'https://via.placeholder.com/150x210?text=集益+千虫理威');

-- Dainogan Theme Cards
INSERT INTO cards (name, card_type, cost, race, power, effect_text, expansion, is_unique, image_url)
VALUES
  ('テラ・ティラノ', 'モンスター', 5, 'ダイノガン/古代兵器', 1000, '・速攻', '三弾', false, 'https://via.placeholder.com/150x210?text=テラ・ティラノ'),
  
  ('プテラ・プドン', 'モンスター', 5, 'ダイノガン/古代兵器', 2000, '・登場時、相手のパワー3000以下のモンスターを破壊する。', '三弾', false, 'https://via.placeholder.com/150x210?text=プテラ・プドン'),
  
  ('トラセラ・トリケラ', 'モンスター', 5, 'ダイノガン/古代兵器', 2000, '・ガードナー
・このモンスターは相手プレイヤーに攻撃出来ない。', '三弾', false, 'https://via.placeholder.com/150x210?text=トラセラ・トリケラ'),
  
  ('ダイ戦士 ティライガーZ', 'エボルモンスター', 7, 'ダイノガン/古代兵器', 4000, '・自分の「種族：ダイノガン」の攻撃終了時、手札を2枚捨ててもよい。このカードを手札かで召喚してもよい。
・エボルシナジー：登場時、墓地のコスト5以下の「種族：ダイノガン」を1枚選びそれを場に出す。', '三弾', false, 'https://via.placeholder.com/150x210?text=ダイ戦士+ティライガーZ'),
  
  ('ダイ剣士 プテラオン', 'エボルモンスター', 7, 'ダイノガン/古代兵器', 3500, '・自分の「種族：ダイノガン」の登場時、手札を2枚捨ててもよい。このカードを手札から召喚してもよい。
・エボルシナジー：登場時、カードを2枚引く。', '三弾', false, 'https://via.placeholder.com/150x210?text=ダイ剣士+プテラオン'),
  
  ('ダイ盾士 トリケムズ', 'エボルモンスター', 7, 'ダイノガン/古代兵器', 6000, '・自分の「種族：ダイノガン」のバトル時、手札を2枚捨ててもよい。このカードを手札からで召喚してもよい。
・エボルシナジー：自分のモンスターがバトルする時、かわりにこのモンスターとバトルさせてもよい。', '三弾', false, 'https://via.placeholder.com/150x210?text=ダイ盾士+トリケムズ');

-- Dragon Tamer Theme Cards
INSERT INTO cards (name, card_type, cost, race, power, effect_text, expansion, is_unique, image_url)
VALUES
  ('竜伝承のグリモア', 'エボルモンスター', 5, 'ドラゴンテイマー', 4000, '・登場時、手札から「種族：ドラゴンテイマー」を1枚選び場に出してもよい。そのあと手札を全て山札の下に好きな順序で戻す。', '三弾', false, 'https://via.placeholder.com/150x210?text=竜伝承のグリモア'),
  
  ('砲大我竜 キャノークス・ドラゴン', 'モンスター', 9, 'ドラゴン/改造龍機', 6000, '・速攻
・ツインアタッカー
・登場時、このターン中「このモンスターは相手モンスターに向かって攻撃出来ず攻撃先は変更されない。」を得る。', '三弾', false, 'https://via.placeholder.com/150x210?text=砲大我竜+キャノークス・ドラゴン'),
  
  ('弾丸 バレドラン', 'モンスター', 4, 'ドラゴン/改造龍機', 3000, '・登場時、このモンスターを破壊してもよい。
・このモンスターが破壊された時、自分モンスターを1体選びリブートさせる。', '三弾', false, 'https://via.placeholder.com/150x210?text=弾丸+バレドラン');

INSERT INTO cards (name, card_type, cost, race, effect_text, expansion, is_unique, image_url)
VALUES
  ('竜呼びの杖', '装備', 7, '杖/ドラゴンテイマー', '・登場時、またはこのカードを装備したモンスターの攻撃時、山札の上から1枚を表向きにしてそのカードが「種族：ドラゴン」なら場に出す。それ以外なら手札に加える。また、このカードを装備するモンスターが「種族：ドラゴンテイマー」ならこの効果はもう一度発動する。', '三弾', false, 'https://via.placeholder.com/150x210?text=竜呼びの杖'),
  
  ('竜潜術', '呪文', 1, NULL, '・自分のエナジーを1枚選び山札の上に置く。', '三弾', false, 'https://via.placeholder.com/150x210?text=竜潜術');

-- Unique Cards
INSERT INTO cards (name, card_type, cost, race, power, effect_text, expansion, is_unique, image_url)
VALUES
  ('最速神 ヘルメシア', 'モンスター', 1, '神', 500, '・速攻', '三弾', true, 'https://via.placeholder.com/150x210?text=最速神+ヘルメシア'),
  
  ('伝説の勇者 ヘロス＝バロン1世', 'モンスター', 5, '勇者/戦士', 4000, '・登場時、カードを2枚引く。
・手札の「カードタイプ：装備」のコストは1になる。', '三弾', true, 'https://via.placeholder.com/150x210?text=伝説の勇者+ヘロス＝バロン1世'),
  
  ('反撃の剛霊機兵', 'モンスター', 3, '虚兵/ゴーレム', 15000, '・このモンスターは相手モンスターにしか攻撃できない。', '三弾', true, 'https://via.placeholder.com/150x210?text=反撃の剛霊機兵');

INSERT INTO cards (name, card_type, cost, race, effect_text, expansion, is_unique, image_url)
VALUES
  ('不死鳥の羽', '装備', 4, 'アクセサリー/神獣', '・装備モンスターが場を離れた時、このカードを墓地に置いてもよい。そうしたらそのモンスターを墓地から場に出す。
・自分のターン開始時、このカードが墓地にあれば自分の手札を2枚捨ててもよい。そうしたらこのカードを手札に戻す。', '三弾', true, 'https://via.placeholder.com/150x210?text=不死鳥の羽'),
  
  ('掴め！ビッグドリーム・JACKPOT', '呪文', 3, NULL, '・お互いのプレイヤーはそれぞれ1～7までの数字を1つずつ選ぶ。そのあとお互いは山札の下をめくる。こうして相手の山札のカードと同じコストを選んだプレイヤーはそのコストと同じ数カードを引く。', '三弾', true, 'https://via.placeholder.com/150x210?text=掴め！ビッグドリーム・JACKPOT');
