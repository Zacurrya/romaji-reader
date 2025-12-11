// Romaji (latin) → Hiragana mapping
// Example: "ni" -> "に", "ko" -> "こ"
const kanaMap: Record<string, string> = {
	// Vowels
	a: "あ",
	i: "い",
	u: "う",
	e: "え",
	o: "お",

	// K-row
	ka: "か",
	ki: "き",
	ku: "く",
	ke: "け",
	ko: "こ",

	// S-row
	sa: "さ",
	shi: "し",
	su: "す",
	se: "せ",
	so: "そ",

	// T-row
	ta: "た",
	chi: "ち",
	tsu: "つ",
	te: "て",
	to: "と",

	// N-row
	na: "な",
	ni: "に",
	nu: "ぬ",
	ne: "ね",
	no: "の",

	// H-row
	ha: "は",
	hi: "ひ",
	fu: "ふ",
	he: "へ",
	ho: "ほ",

	// M-row
	ma: "ま",
	mi: "み",
	mu: "む",
	me: "め",
	mo: "も",

	// Y-row
	ya: "や",
	yu: "ゆ",
	yo: "よ",

	// R-row
	ra: "ら",
	ri: "り",
	ru: "る",
	re: "れ",
	ro: "ろ",

	// W-row & others
	wa: "わ",
	wo: "を",
	n: "ん",

	// G-row (voiced K)
	ga: "が",
	gi: "ぎ",
	gu: "ぐ",
	ge: "げ",
	go: "ご",

	// Z-row (voiced S)
	za: "ざ",
	ji: "じ",
	zu: "ず",
	ze: "ぜ",
	zo: "ぞ",
	zi: "じ",

	// D-row (voiced T)
	da: "だ",
	di: "ぢ",
	du: "づ",
	de: "で",
	do: "ど",

	// B-row (voiced H)
	ba: "ば",
	bi: "び",
	bu: "ぶ",
	be: "べ",
	bo: "ぼ",

	// P-row (p-sound)
	pa: "ぱ",
	pi: "ぴ",
	pu: "ぷ",
	pe: "ぺ",
	po: "ぽ",

	// Yōon (palatalized) combos
	kya: "きゃ",
	kyu: "きゅ",
	kyo: "きょ",
	gya: "ぎゃ",
	gyu: "ぎゅ",
	gyo: "ぎょ",
	sha: "しゃ",
	shu: "しゅ",
	sho: "しょ",
	ja: "じゃ",
	ju: "じゅ",
	jo: "じょ",
	cha: "ちゃ",
	chu: "ちゅ",
	cho: "ちょ",
	nya: "にゃ",
	nyu: "にゅ",
	nyo: "にょ",
	hya: "ひゃ",
	hyu: "ひゅ",
	hyo: "ひょ",
	bya: "びゃ",
	byu: "びゅ",
	byo: "びょ",
	pya: "ぴゃ",
	pyu: "ぴゅ",
	pyo: "ぴょ",
	mya: "みゃ",
	myu: "みゅ",
	myo: "みょ",
	rya: "りゃ",
	ryu: "りゅ",
	ryo: "りょ",

	// Small tsu (used to indicate gemination) - common romanizations
	xtsu: "っ",
	ltsu: "っ",

	// small vowels (rarely used standalone but handy)
	xa: "ぁ",
	xi: "ぃ",
	xu: "ぅ",
	xe: "ぇ",
	xo: "ぉ",
};

export default kanaMap;

// Usage example:
// import kanaMap from './kana';
// console.log(kanaMap['ni']); // prints: に
