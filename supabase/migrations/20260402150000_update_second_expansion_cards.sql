/*
  # 二弾カードの効果テキスト・数値の更新

  ユーザー提供の2弾リストに基づく。
  - 秀逸／卓抜は装備、スクラップ・マシーン系はモンスターとして登録し直し
  - ユニーク: ビースト・リベレイション、虐天の大剣、呪悪の首飾り、時を渡る宝箱
*/

UPDATE cards SET
  effect_text = $s0$
・山札の上から5枚を見て「カードタイプ：装備」を1枚相手に見せてから手札に加える。
$s0$,
  cost = 3,
  power = NULL,
  race = NULL,
  card_type = '呪文',
  is_unique = false
WHERE name = '戦闘準備';

UPDATE cards SET
  effect_text = $s1$
・カウンター5
・エナジーから好きな数を墓地に置き、その枚数と同じだけ山札の上から墓地に置く。
$s1$,
  cost = 7,
  power = NULL,
  race = NULL,
  card_type = '呪文',
  is_unique = false
WHERE name = '墓掘り名人のスゴワザ';

UPDATE cards SET
  effect_text = $s2$
・相手はカードを1枚引いてもよい。その後自分はカードを3枚引く
$s2$,
  cost = 5,
  power = NULL,
  race = NULL,
  card_type = '呪文',
  is_unique = false
WHERE name = '公正な宝箱';

UPDATE cards SET
  effect_text = $s3$
・カウンター4
・お互いは自分のモンスターを1体選び手札に戻す。
$s3$,
  cost = 5,
  power = NULL,
  race = NULL,
  card_type = '呪文',
  is_unique = false
WHERE name = '大いなる渦潮';

UPDATE cards SET
  effect_text = $s4$
・登場時、手札からコストが5以下の「カードタイプ：装備」を場に出しこのモンスターに装備する。
・攻撃時、場の「種族：武器」をこのモンスターに装備させてもよい。
$s4$,
  cost = 5,
  power = 4000,
  race = '戦士/英雄',
  card_type = 'モンスター',
  is_unique = false
WHERE name = '歴戦の達人 ヘロス＝バロン3世';

UPDATE cards SET
  effect_text = $s5$
・手札の「カードタイプ：装備」のコストは１少なくなる。
$s5$,
  cost = 3,
  power = 2000,
  race = '魔法使い',
  card_type = 'モンスター',
  is_unique = false
WHERE name = '魔法見習い サポレス';

UPDATE cards SET
  effect_text = $s6$
・カウンター2
・登場時、パワーが2000以下の相手モンスターを1体選び破壊する。
$s6$,
  cost = 5,
  power = 3000,
  race = 'モンストロ/フレイマー',
  card_type = 'モンスター',
  is_unique = false
WHERE name = '火吹き獣 フレブラス';

UPDATE cards SET
  effect_text = $s7$
・登場時、自分の墓地からコスト5以下のカードを選び場に出す。
・このカードを装備したモンスターが場にいる限り、このカードの効果で場に出たカードは場を離れない。
・装備モンスターが場を離れた時、このカードは墓地に置かれる。
$s7$,
  cost = 7,
  power = NULL,
  race = '杖/呪物',
  card_type = '装備',
  is_unique = false
WHERE name = '冥界の呪杖';

UPDATE cards SET
  effect_text = $s8$
・装備モンスターは、「能力：ツインアタッカー」を得る。
$s8$,
  cost = 3,
  power = NULL,
  race = '剣/武器/神器',
  card_type = '装備',
  is_unique = false
WHERE name = '聖剣 アス・カリュード';

UPDATE cards SET
  effect_text = $s9$
・装備モンスターは、バトル中パワーが3000上がる。
$s9$,
  cost = 2,
  power = NULL,
  race = '剣/武器',
  card_type = '装備',
  is_unique = false
WHERE name = '木刀';

UPDATE cards SET
  effect_text = $s10$
・カウンター3
・装備モンスターは、「能力：ガードナー」を得る。
$s10$,
  cost = 6,
  power = NULL,
  race = '盾/防具',
  card_type = '装備',
  is_unique = false
WHERE name = '荘厳な大盾';

UPDATE cards SET
  effect_text = $s11$
・装備モンスターは攻撃できない。
・これを装備したモンスターのいるプレイヤーは自分のターン開始時にカードを1枚引いてもよい。その後、そのプレイヤーは2エナジーを使ってこの装備を外してもよい。
$s11$,
  cost = 5,
  power = NULL,
  race = 'アクセサリー',
  card_type = '装備',
  is_unique = false
WHERE name = 'ヘビー・ネックレス';

UPDATE cards SET
  effect_text = $s12$
・ガードナー
・攻撃終了時、このモンスターを破壊する。
$s12$,
  cost = 2,
  power = 1000,
  race = 'スクラップ・マシーン/スピードノイザー',
  card_type = 'モンスター',
  is_unique = false
WHERE name = 'S-5 速写のデジィカメ';

UPDATE cards SET
  effect_text = $s13$
・フラッシュカウンター
・自分の「種族：スクラップ・マシーン」が破壊された時、カードを1枚引く。
$s13$,
  cost = 3,
  power = 1000,
  race = 'スクラップ・マシーン',
  card_type = 'モンスター',
  is_unique = false
WHERE name = 'S-4 モバージュ';

UPDATE cards SET
  effect_text = $s14$
・攻撃時、場にある自分の「種族：スクラップ・マシーン」を1枚選び破壊してもよい。そうしたら、このモンスターはこのターン「能力：ツインアタッカー」を得る。
$s14$,
  cost = 4,
  power = 5000,
  race = 'スクラップ・マシーン',
  card_type = 'モンスター',
  is_unique = false
WHERE name = 'M-8 ネッパー・オーブナー';

UPDATE cards SET
  effect_text = $s15$
・登場時、場の「種族：スクラップ・マシーン」を1枚選んでもよい。そうしたら、相手は自身の場のカードを2枚選ぶ。それらを全て破壊する。
$s15$,
  cost = 7,
  power = 5000,
  race = 'スクラップ・マシーン',
  card_type = 'モンスター',
  is_unique = false
WHERE name = 'M-3 バクスタード・ライアー';

UPDATE cards SET
  effect_text = $s16$
・ツインアタッカー
・登場時、自分の場のモンスターを好きな数破壊してもよい。
・自分の他の「種族：スクラップ・マシーン」が破壊された時、相手のシールドを1枚選びブレイクする。
$s16$,
  cost = 8,
  power = 7000,
  race = 'スクラップ・マシーン',
  card_type = 'エボルモンスター',
  is_unique = false
WHERE name = 'L-2 冷壊機甲 クラッシュアス・パンクーラチオン';

UPDATE cards SET
  effect_text = $s17$
・アームズアップ：バレジェンヌ
・装備モンスターのパワーは2000上がる。
・装備モンスターが「種族：バレジェンヌ」であり、このターン中に場に出ていれば「能力：リブートアタッカー」を得る。(この効果は1ターンに1度しか発動しない。)
$s17$,
  cost = 4,
  power = NULL,
  race = '精霊/装具',
  card_type = '装備',
  is_unique = false
WHERE name = '秀逸なる旋律(メロディ) レディ・トゥ・シューズ';

UPDATE cards SET
  effect_text = $s18$
・アームズアップ：バレジェンヌ
・装備モンスターが攻撃する時、カードを1枚引く。
$s18$,
  cost = 2,
  power = NULL,
  race = '精霊/装具',
  card_type = '装備',
  is_unique = false
WHERE name = '卓抜たる律動(リズム) レディ・チュール・ペチコート';

UPDATE cards SET
  effect_text = $s19$
・速攻
・場に「種族：装具」を持つ装備がある時、手札にあるこのモンスターのコストを2少なくする。
$s19$,
  cost = 5,
  power = 1000,
  race = '精霊使い/バレジェンヌ',
  card_type = 'モンスター',
  is_unique = false
WHERE name = '流麗なる前奏曲(プレリュード) アン・ヌ・ダルク';

UPDATE cards SET
  effect_text = $s20$
・自分の「種族：バレジェンヌ」が攻撃をした時、それがこのターン2回目の攻撃でこのカードが手札にあるなら、このカードを捨ててもよい。そうしたら、エナジー1枚を使って、場のモンスターを1体選びリブートさせる。(ただしこのモンスターの同じ効果は1ターンに1度しか使えない)
$s20$,
  cost = 7,
  power = 6000,
  race = '精霊使い/バレジェンヌ',
  card_type = 'モンスター',
  is_unique = false
WHERE name = '婉然たる行進曲(マーチ) ドゥ・エリザべート';

UPDATE cards SET
  effect_text = $s21$
・自分の「種族：バレジェンヌ」が攻撃をした時、それがこのターン3回目の攻撃でこのカードが手札にあるなら、このカードを相手に見せてもよい。そうしたら、その攻撃の終わりに、このモンスターをエナジー2枚を使って場に出す。(ただしこのモンスターの同じ効果は1ターンに1度しか使えない)
・速攻
・登場時、相手モンスターを1体選びリブートさせる。
$s21$,
  cost = 8,
  power = 4000,
  race = '精霊使い/バレジェンヌ',
  card_type = 'モンスター',
  is_unique = false
WHERE name = '優艷なる後奏曲(ポストリュード) トロワ・エルキューレ';

UPDATE cards SET
  effect_text = $s22$
・自分の「種族：バレジェンヌ」が攻撃をした時、それがこのターン2回目の攻撃でこのカードが手札にあるなら、このカードを捨ててもよい。そうしたらカードを2枚引く。(ただしこのモンスターの同じ効果は1ターンに1度しか使えない)
・登場時、手札から「カードタイプ：装備」を1枚場に出してもよい。
$s22$,
  cost = 6,
  power = 4000,
  race = '精霊使い/バレジェンヌ',
  card_type = 'モンスター',
  is_unique = false
WHERE name = '嬋媛なる協奏曲(コンチェルト) ヴェルセイユ・ローゼ';

UPDATE cards SET
  effect_text = $s23$
・このカードが場から墓地へ送られた時、手札から「種族：悪魔」を捨てる。そうしたらこのカードを手札に戻す。
・登場時、相手の手札を1枚見ないで選び、それを捨てさせる。
$s23$,
  cost = 4,
  power = 2000,
  race = '悪魔/魔獣',
  card_type = 'モンスター',
  is_unique = false
WHERE name = '忠実なる骨獣 スカルベロス';

UPDATE cards SET
  effect_text = $s24$
・カウンター4
・手札を1枚捨てる。そうしたら、次の内から1つ選び、それをこのカードの能力として使用する。ただし、その捨てたカードが「種族：悪魔」なら、次の内からどちらもこのカードの能力として使用する。
▶場のカードを1枚破壊する。
▶墓地からカードを1枚手札に加える
$s24$,
  cost = 6,
  power = NULL,
  race = NULL,
  card_type = '呪文',
  is_unique = false
WHERE name = 'デビルズ・トレード';

UPDATE cards SET
  effect_text = $s25$
・カウンター4
・カードを2枚引き、手札を1枚捨てる。そのカードが「種族：悪魔」ならそのカードを手札に戻す。
$s25$,
  cost = 4,
  power = NULL,
  race = NULL,
  card_type = '呪文',
  is_unique = false
WHERE name = '悪魔を呼ぶ宝箱';

UPDATE cards SET
  effect_text = $s26$
・アームズアップ：悪魔
・このカードを装備しているモンスターが場を離れる時、代わりに手札を1枚捨てる。(この効果は1ターンにつき1度しか使えない。)
$s26$,
  cost = 6,
  power = NULL,
  race = '悪魔/防具',
  card_type = '装備',
  is_unique = false
WHERE name = '魔王の鉄兜(ファウスト・オブ・ヘルム)';

UPDATE cards SET
  effect_text = $s27$
・アームズアップ：悪魔
・装備モンスターがいる限り、自分の悪魔族はパワーが3000上がる。
・このカードが手札から捨てられた時、今が相手ターンならコストが13の「種族：悪魔」を墓地から場に出してもよい。(この効果は1ターンにつき1度しか使えない。)
$s27$,
  cost = 4,
  power = NULL,
  race = '悪魔/武器',
  card_type = '装備',
  is_unique = false
WHERE name = '魔王の大鎌(ファウスト・オブ・デスサイズ)';

UPDATE cards SET
  effect_text = $s28$
・ツインアタッカー
・ガードナー
・登場時、手札から「種族：悪魔」を1枚捨ててもよい。そうしたら山札の上から3枚を墓地に置く。
・攻撃時、墓地から「種族：悪魔」を1枚選び、場に出してもよい。
$s28$,
  cost = 13,
  power = 6000,
  race = '悪魔',
  card_type = 'モンスター',
  is_unique = false
WHERE name = '暗黒の扉を護る者 バアル＝ファントム';

UPDATE cards SET
  effect_text = $s29$
・ツインアタッカー
・登場時、手札から「種族：悪魔」を2枚まで捨ててもよい。その数分、相手モンスターを選び破壊する。
・このモンスターが装備している時、場のモンスターは全て「能力：速攻」を得る。
$s29$,
  cost = 8,
  power = 7000,
  race = '悪魔/魔族王',
  card_type = 'エボルモンスター',
  is_unique = false
WHERE name = '悪魔王 ファウスト';

UPDATE cards SET
  effect_text = $s30$
・このカードのコストは自分の場のモンスターの数分多くなる。
・場の自分のモンスター全てはこのターンパワーが5000上がり、「能力：ツインアタッカー」を得る。
$s30$,
  cost = 2,
  power = NULL,
  race = NULL,
  card_type = '呪文',
  is_unique = true
WHERE name = 'ビースト・リベレイション';

UPDATE cards SET
  effect_text = $s31$
・装備モンスターはパワーが4000上がりリブート状態のモンスターを攻撃できる。
・自分のモンスターがバトルした時、そのモンスターに「能力：リブートアタッカー」を与える。
・自分のシールドが2枚以下の時、このカードを装備させるコストは2になる。
$s31$,
  cost = 10,
  power = NULL,
  race = '剣/武器/神器',
  card_type = '装備',
  is_unique = true
WHERE name = '虐天の大剣 ルミナス・カリバー';

UPDATE cards SET
  effect_text = $s32$
・装備モンスターのパワーは1000になり、「能力：アタッカー」の効果は無くなる。
・装備モンスターが場を離れた時、このカードは墓地に置かれる。
$s32$,
  cost = 1,
  power = NULL,
  race = 'アクセサリー/呪物/悪魔',
  card_type = '装備',
  is_unique = true
WHERE name = '呪悪の首飾り(アブダクト・ペンダント)';

UPDATE cards SET
  effect_text = $s33$
・登場時、墓地のカードを3枚までエナジーにする。しかし、このターンそれらのエナジーは使えない。
$s33$,
  cost = 4,
  power = 4000,
  race = 'フォレスター/仙人',
  card_type = 'モンスター',
  is_unique = false
WHERE name = 'スーパーエナジスト エナ爺';

UPDATE cards SET
  effect_text = $s34$
・このカードを使った後、墓地に置く代わりに山札の上から3枚目に置く。こうしてこの効果を使った後に「カード名：時を渡る宝箱」が山札からエナジーとなった時1度だけ、カードを5枚引く。
$s34$,
  cost = 3,
  power = NULL,
  race = NULL,
  card_type = '呪文',
  is_unique = true
WHERE name = '時を渡る宝箱';

