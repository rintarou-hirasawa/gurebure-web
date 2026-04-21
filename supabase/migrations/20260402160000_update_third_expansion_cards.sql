/*
  # 三弾カードの効果テキスト・数値の更新

  ユーザー提供の「汎用+テーマ強化」リストに基づく。
  - 巨悪昆虫: 原文「1対」は「1体」に修正
  - 集益 千虫理威: 「好きぬ」→「好きな」
  - プテラ・プドン: 末尾の重複「モンスター」を除去
  - ダイノガン3体: 「手札かで」→「手札から」
*/

UPDATE cards SET
  effect_text = $t0$
・登場時、自分の手札を1枚捨てる。
・場を離れた時、相手に自分の手札を1枚選ばせる。自分はそれを捨てる。
$t0$,
  cost = 1,
  power = 1000,
  race = '悪魔/堕虫',
  card_type = 'モンスター',
  is_unique = false
WHERE name = '悪魔 藤蝶羽';

UPDATE cards SET
  effect_text = $t1$
・このモンスターを召喚する時、エナジーにある｢種族：フォレスター｣はエナジー2枚分になる。
・登場時、相手モンスターを1体選び破壊する。
$t1$,
  cost = 9,
  power = 5000,
  race = 'フォレスター',
  card_type = 'モンスター',
  is_unique = false
WHERE name = '電導師 シカルバ';

UPDATE cards SET
  effect_text = $t2$
・攻撃時、カードを1枚引き手札にあるコスト5以下の「精霊」カードであり、かつ「種族：スピリット」を場に出してもよい。
・このモンスターは相手に選ばれず、場に自分の「種族：精霊使い」が無ければ攻撃できない。
$t2$,
  cost = 5,
  power = 6000,
  race = 'スピリッツ/精霊',
  card_type = 'エボルモンスター',
  is_unique = false
WHERE name = '運命の精霊 ディスティー';

UPDATE cards SET
  effect_text = $t3$
・フラッシュカウンター
・自分の墓地にある「種族：スピードノイザー」を2枚まで手札に加えてもよい。
$t3$,
  cost = 4,
  power = NULL,
  race = NULL,
  card_type = '呪文',
  is_unique = false
WHERE name = '熱狂騒大 ノイズ＝ザ・ライブ';

UPDATE cards SET
  effect_text = $t4$
・このカードを装備したモンスターが離れる時、かわりにこのカードを墓地に破壊してもよい。そうしたらそのモンスターは手札に戻る。
・このカードが装備されている間、自分は自身のメインステップ以外で使用するエナジーが1減る。(この効果によってカウンターのコストは軽減されない。)
・アームズアップ：バレジェンヌ
$t4$,
  cost = 3,
  power = NULL,
  race = '装具/精霊',
  card_type = '装備',
  is_unique = false
WHERE name = '比類なき和音(ハーモニー) レディ・ボン・バレラ';

UPDATE cards SET
  effect_text = $t5$
・自分のエナジーから2枚を選び墓地に置き相手モンスターを1体選び山札の下に送る。
$t5$,
  cost = 4,
  power = NULL,
  race = NULL,
  card_type = '呪文',
  is_unique = false
WHERE name = 'エナジーホール';

UPDATE cards SET
  effect_text = $t6$
・このモンスターが破壊された時、カードを1枚引く。それが自分のターンであれば更にもう1枚引く。
$t6$,
  cost = 3,
  power = 1000,
  race = 'アイドル',
  card_type = 'モンスター',
  is_unique = false
WHERE name = 'ハジけるアイドル ピーチソーダ';

UPDATE cards SET
  effect_text = $t7$
・カウンター3
・登場時、コスト5以下のモンスターを1体選び破壊する。
$t7$,
  cost = 5,
  power = 4000,
  race = '戦士',
  card_type = 'エボルモンスター',
  is_unique = false
WHERE name = '剣残 ティファ・リリア';

UPDATE cards SET
  effect_text = $t8$
・ガードナー
$t8$,
  cost = 5,
  power = 6000,
  race = '虚兵/ゴーレム',
  card_type = 'エボルモンスター',
  is_unique = false
WHERE name = '巌壁の土進兵';

UPDATE cards SET
  effect_text = $t9$
・装備モンスターは「能力：速攻」を得る。
$t9$,
  cost = 4,
  power = NULL,
  race = '装具/神器',
  card_type = '装備',
  is_unique = false
WHERE name = 'ヘルメシアのスピードシューズ';

UPDATE cards SET
  effect_text = $t10$
・カウンター5
・自分の墓地にあるコストが3以下のモンスターを3体まで選び、場に出す。
$t10$,
  cost = 9,
  power = NULL,
  race = NULL,
  card_type = '呪文',
  is_unique = false
WHERE name = 'リバイバル・リサイタル';

UPDATE cards SET
  effect_text = $t11$
・このカードは墓地から召喚出来る。そしてこのモンスターは手札からは召喚することが出来ない。
・登場時、手札を1枚捨て、相手モンスターを2体選び破壊する。
・このモンスターは場を離れる時、山札の下に置かれる。
・エボルシナジー：ツインアタッカー、ガードナー
$t11$,
  cost = 8,
  power = 6000,
  race = 'ギャラクシアン',
  card_type = 'エボルモンスター',
  is_unique = false
WHERE name = 'Aリアン グレイ';

UPDATE cards SET
  effect_text = $t12$
・ツインアタッカー
・登場時、場にある他の｢カードタイプ：エボルモンスター｣を1体選んでもよい。そのモンスターはこのターン｢能力：エボルシナジー｣は条件を満たしていなくても使用でき、かつその効果は2回発動する。
・エボルシナジー：攻撃時、墓地から｢種族：堕虫｣を1枚選び手札に加える。そうしたら相手モンスターを1体破壊する。
$t12$,
  cost = 7,
  power = 6000,
  race = '堕虫/皇帝種',
  card_type = 'エボルモンスター',
  is_unique = false
WHERE name = '巨悪昆虫 篦玖䋱寿王兜(ヘラクレスオオカブト)';

UPDATE cards SET
  effect_text = $t13$
・相手ターン中、このモンスターは選ばれない。
$t13$,
  cost = 2,
  power = 1000,
  race = '堕虫',
  card_type = 'モンスター',
  is_unique = false
WHERE name = '絶景 夜営蛍(ヤエイホタル)';

UPDATE cards SET
  effect_text = $t14$
・このモンスターが破壊された時、相手は自身の手札を1枚選びそれを捨てる。
$t14$,
  cost = 3,
  power = 2000,
  race = '堕虫',
  card_type = 'モンスター',
  is_unique = false
WHERE name = '戒律 闇蜘蛛(ヤミクモ)';

UPDATE cards SET
  effect_text = $t15$
・このモンスターは相手プレイヤーに攻撃できない。
・登場時、相手モンスター1体を選んでもよい。そのモンスターとバトルする。
・バトル勝利時、墓地の｢種族：堕虫｣を1枚手札に加える。
$t15$,
  cost = 4,
  power = 4000,
  race = '堕虫',
  card_type = 'モンスター',
  is_unique = false
WHERE name = '武人 緋鎌斬(アカカマキリ)';

UPDATE cards SET
  effect_text = $t16$
・登場時、相手のコスト3以下のモンスターを1体選び破壊する。
・エボルシナジー：攻撃時、カードを2枚引く。
$t16$,
  cost = 6,
  power = 5000,
  race = '堕虫',
  card_type = 'エボルモンスター',
  is_unique = false
WHERE name = '伽藍堂 棟梁飛蝗(トウリョウバッタ)';

UPDATE cards SET
  effect_text = $t17$
・エボルシナジー：攻撃時、自分の場の他モンスター1体を選びリブートさせる。
$t17$,
  cost = 5,
  power = 2000,
  race = '堕虫',
  card_type = 'エボルモンスター',
  is_unique = false
WHERE name = '加速 金蜻蜓(キンヤンマ)';

UPDATE cards SET
  effect_text = $t18$
・エナジーにある｢種族：堕虫｣の数だけ山札の上から表向きにする。その中から｢カードタイプ：モンスター｣を1枚選び相手に見せてから手札に加える。それ以外を全て好きな順序で山札の下に置く。
$t18$,
  cost = 4,
  power = NULL,
  race = NULL,
  card_type = '呪文',
  is_unique = false
WHERE name = '集益 千虫理威(センチュリー)';

UPDATE cards SET
  effect_text = $t19$
・速攻
$t19$,
  cost = 5,
  power = 1000,
  race = 'ダイノガン/古代兵器',
  card_type = 'モンスター',
  is_unique = false
WHERE name = 'テラ・ティラノ';

UPDATE cards SET
  effect_text = $t20$
・登場時、相手のパワー3000以下のモンスターを1体選び破壊する。
$t20$,
  cost = 5,
  power = 2000,
  race = 'ダイノガン/古代兵器',
  card_type = 'モンスター',
  is_unique = false
WHERE name = 'プテラ・プドン';

UPDATE cards SET
  effect_text = $t21$
・ガードナー
・このモンスターは相手プレイヤーに攻撃出来ない。
$t21$,
  cost = 5,
  power = 2000,
  race = 'ダイノガン/古代兵器',
  card_type = 'モンスター',
  is_unique = false
WHERE name = 'トラセラ・トリケラ';

UPDATE cards SET
  effect_text = $t22$
・自分の「種族：ダイノガン」の攻撃終了時、手札を2枚捨ててもよい。このカードを手札から召喚してもよい。
・エボルシナジー：登場時、墓地のコスト5以下の「種族：ダイノガン」を1枚選びそれを場に出す。
$t22$,
  cost = 7,
  power = 4000,
  race = 'ダイノガン/古代兵器',
  card_type = 'エボルモンスター',
  is_unique = false
WHERE name = 'ダイ戦士 ティライガーZ';

UPDATE cards SET
  effect_text = $t23$
・自分の「種族：ダイノガン」の登場時、手札を2枚捨ててもよい。このカードを手札から召喚してもよい。
・エボルシナジー：登場時、カードを2枚引く。
$t23$,
  cost = 7,
  power = 3500,
  race = 'ダイノガン/古代兵器',
  card_type = 'エボルモンスター',
  is_unique = false
WHERE name = 'ダイ剣士 プテラオン';

UPDATE cards SET
  effect_text = $t24$
・自分の「種族：ダイノガン」のバトル時、手札を2枚捨ててもよい。このカードを手札から召喚してもよい。
・エボルシナジー：自分のモンスターがバトルする時、かわりにこのモンスターとバトルさせてもよい。
$t24$,
  cost = 7,
  power = 6000,
  race = 'ダイノガン/古代兵器',
  card_type = 'エボルモンスター',
  is_unique = false
WHERE name = 'ダイ盾士 トリケムズ';

UPDATE cards SET
  effect_text = $t25$
・登場時、手札から「種族：ドラゴンテイマー」を1枚選び場に出してもよい。そのあと手札を全て山札の下に好きな順序で戻す。
$t25$,
  cost = 5,
  power = 4000,
  race = 'ドラゴンテイマー',
  card_type = 'エボルモンスター',
  is_unique = false
WHERE name = '竜伝承のグリモア';

UPDATE cards SET
  effect_text = $t26$
・登場時、またはこのカードを装備したモンスターの攻撃時、山札の上から1枚を表向きにしてそのカードが「種族：ドラゴン」なら場に出す。それ以外なら手札に加える。また、このカードを装備するモンスターが「種族：ドラゴンテイマー」ならこの効果はもう一度発動する。
$t26$,
  cost = 7,
  power = NULL,
  race = '杖/ドラゴンテイマー',
  card_type = '装備',
  is_unique = false
WHERE name = '竜呼びの杖';

UPDATE cards SET
  effect_text = $t27$
・速攻
・ツインアタッカー
・登場時、このターン中「このモンスターは相手モンスターに向かって攻撃出来ず攻撃先は変更されない。」を得る。
$t27$,
  cost = 9,
  power = 6000,
  race = 'ドラゴン/改造龍機',
  card_type = 'モンスター',
  is_unique = false
WHERE name = '砲大我竜 キャノークス・ドラゴン';

UPDATE cards SET
  effect_text = $t28$
・登場時、このモンスターを破壊してもよい。
・このモンスターが破壊された時、自分モンスターを1体選びリブートさせる。
$t28$,
  cost = 4,
  power = 3000,
  race = 'ドラゴン/改造龍機',
  card_type = 'モンスター',
  is_unique = false
WHERE name = '弾丸 バレドラン';

UPDATE cards SET
  effect_text = $t29$
・自分のエナジーを1枚選び山札の上に置く。
$t29$,
  cost = 1,
  power = NULL,
  race = NULL,
  card_type = '呪文',
  is_unique = false
WHERE name = '竜潜術';

UPDATE cards SET
  effect_text = $t30$
・装備モンスターが場を離れた時、このカードを墓地に置いてもよい。そうしたらそのモンスターを墓地から場に出す。
・自分のターン開始時、このカードが墓地にあれば自分の手札を2枚捨ててもよい。そうしたらこのカードを手札に戻す。
$t30$,
  cost = 4,
  power = NULL,
  race = 'アクセサリー/神獣',
  card_type = '装備',
  is_unique = true
WHERE name = '不死鳥の羽';

UPDATE cards SET
  effect_text = $t31$
・速攻
$t31$,
  cost = 1,
  power = 500,
  race = '神',
  card_type = 'モンスター',
  is_unique = true
WHERE name = '最速神 ヘルメシア';

UPDATE cards SET
  effect_text = $t32$
・登場時、カードを2枚引く。
・手札の「カードタイプ：装備」のコストは1になる。
$t32$,
  cost = 5,
  power = 4000,
  race = '勇者/戦士',
  card_type = 'モンスター',
  is_unique = true
WHERE name = '伝説の勇者 ヘロス＝バロン1世';

UPDATE cards SET
  effect_text = $t33$
・このモンスターは相手モンスターにしか攻撃できない。
$t33$,
  cost = 3,
  power = 15000,
  race = '虚兵/ゴーレム',
  card_type = 'モンスター',
  is_unique = true
WHERE name = '反撃の剛霊機兵';

UPDATE cards SET
  effect_text = $t34$
・お互いのプレイヤーはそれぞれ1～7までの数字を1つずつ選ぶ。そのあとお互いは山札の下をめくる。こうして相手の山札のカードと同じコストを選んだプレイヤーはそのコストと同じ数カードを引く。
$t34$,
  cost = 3,
  power = NULL,
  race = NULL,
  card_type = '呪文',
  is_unique = true
WHERE name = '掴め！ビッグドリーム・JACKPOT';

