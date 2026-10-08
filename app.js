const DEFAULT_QUESTIONS = [
  "Who is the best person ever?",
  "Who deserves all the happiness?",
  "Who would I choose again and again?"
];

const LETTER_STARTERS = {
  "Lover": `Hey {receiver} ♡

I don't always know how to put the biggest feelings into words, but I wanted to try.

You make ordinary days feel a little brighter, and I'm so grateful for every laugh, every little moment, and every memory we keep making together.

I hope you always know how loved you are. You deserve the softest days, the biggest smiles, and all the happiness in the world.

Happy {occasion}, my favorite person. ✦

Always,
{sender}`,
  "Best Friend": `Hey {receiver} ✦

Just a tiny reminder that life is so much better with you in it.

Thank you for all the laughs, the random conversations, the memories, and for being the kind of person I can always count on.

I hope {occasion} reminds you how many good things you deserve. Please never forget how loved and appreciated you are. ♡

With love,
{sender}`,
  "Bestie": `Dear {receiver} 💌

This is your official reminder that you are one of my favorite humans.

Thank you for being there through the chaos, the laughs, the dramatic stories, and all the tiny moments in between. I wouldn't trade our memories for anything.

I hope your {occasion} is as wonderful as you are. You deserve the absolute best. ✨

Always,
{sender}`,
  "Sister": `Dear {receiver} 🌷

Some people become your family, and some people are lucky enough to be both family and a best friend.

I'm so grateful for every memory, every laugh, and every little moment we've shared. I hope you know how much you mean to me.

For {occasion}: a tiny letter to say I love and appreciate you more than I probably say enough.

Love,
{sender}`,
  "Brother": `Hey {receiver} ☾

I may not say it every day, but having you as my brother is one of those things I'm genuinely grateful for.

Thanks for all the memories, the jokes, the chaos, and for being part of my life through everything.

Here's a tiny reminder for {occasion}: you're appreciated more than you know. ✦

From,
{sender}`,
  "Friend": `Hey {receiver} ♡

I just wanted to leave you a little note to say: I'm really glad our paths crossed.

Thank you for the laughs, the conversations, and all the small moments that somehow become the memories we keep.

I hope {occasion} brings you a ridiculous amount of happiness. You deserve it.

From your friend,
{sender}`,
  "Family": `Dear {receiver} 🏡

A little note for one of the people who makes life feel like home.

Thank you for the love, support, laughter, and all the memories that mean more than words can explain.

Whatever {occasion} looks like this year, I hope it brings you peace, joy, and lots of reasons to smile.

With all my love,
{sender}`,
  "Someone special": `Hey {receiver} ✧

I wanted to make something a little more special than a normal message.

You have this lovely way of making moments feel brighter just by being there, and I hope you know how much that means.

So for {occasion}, here's a tiny reminder: you are appreciated, you are important, and you deserve wonderful things.

Always,
{sender}`
};

const state = {
  rel: "",
  receiver: "",
  sender: "",
  occasion: "Birthday",
  letter: "",
  vibe: "dreamy",
  questions: [...DEFAULT_QUESTIONS]
};

let step = 1;
let qIndex = 0;
let isShared = false;

const $ = id => document.getElementById(id);
const $$ = sel => [...document.querySelectorAll(sel)];

const STEP_NAMES = ["The feeling", "Make it theirs", "Your words", "The little reveal"];

function go(id, direction = "forward") {
  const current = document.querySelector(".screen.active");
  const target = $(id);
  if (!target || current === target) return;
  current?.classList.remove("active");
  target.classList.remove("enter-forward", "enter-back");
  void target.offsetWidth;
  target.classList.add(direction === "back" ? "enter-back" : "enter-forward", "active");
  window.scrollTo({ top: 0, behavior: "smooth" });
  setTimeout(() => target.classList.remove("enter-forward", "enter-back"), 600);
}

function setStep(n) {
  step = Math.max(1, Math.min(4, n));
  $$(".form-step").forEach(el => el.classList.toggle("active", Number(el.dataset.step) === step));
  $("progress").style.width = `${step * 25}%`;
  $("stepNo").textContent = `0${step} / 04`;
  $("stepTitle").textContent = STEP_NAMES[step - 1];
  $("backBtn").classList.toggle("disabled", step === 1);
  updateNextState();
}

function starterLetter() {
  const template = LETTER_STARTERS[state.rel] || LETTER_STARTERS["Someone special"];
  const occasion = state.occasion === "Custom" ? ($("customOccasion").value.trim() || "today") : state.occasion.toLowerCase();
  return template
    .replaceAll("{receiver}", state.receiver || "someone special")
    .replaceAll("{sender}", state.sender || "your favorite person")
    .replaceAll("{occasion}", occasion);
}

function refreshStarterIfUntouched() {
  const box = $("letter");
  if (!box.dataset.edited || !box.value.trim()) {
    box.value = starterLetter();
    box.dataset.edited = "";
    updateCount();
  }
}

function updateCount() {
  $("count").textContent = `${$("letter").value.length} / 1800`;
}

function updateNextState() {
  $("next1").disabled = !state.rel;
  $("next2").disabled = !$("receiver").value.trim() || !$("sender").value.trim();
  $("next3").disabled = !$("letter").value.trim();
}

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2100);
}

function resetAll() {
  Object.assign(state, {rel:"", receiver:"", sender:"", occasion:"Birthday", letter:"", vibe:"dreamy", questions:[...DEFAULT_QUESTIONS]});
  step = 1; qIndex = 0; isShared = false;
  $$(".choice").forEach(x => x.classList.remove("selected"));
  $("receiver").value = ""; $("sender").value = ""; $("occasion").value = "Birthday";
  $("customOccasionWrap").classList.add("hidden");
  $("letter").value = ""; $("letter").dataset.edited = "";
  $("q1").value = DEFAULT_QUESTIONS[0]; $("q2").value = DEFAULT_QUESTIONS[1]; $("q3").value = DEFAULT_QUESTIONS[2];
  $$(".vibe").forEach(x => x.classList.toggle("selected", x.dataset.vibe === "dreamy"));
  setStep(1); go("home", "back");
}

function buildPreview() {
  state.receiver = $("receiver").value.trim();
  state.sender = $("sender").value.trim();
  state.occasion = $("occasion").value === "Custom"
    ? ($("customOccasion").value.trim() || "A special day")
    : $("occasion").value;
  state.letter = $("letter").value.trim();
  state.questions = [$("q1").value.trim(), $("q2").value.trim(), $("q3").value.trim()].filter(Boolean);
  $("pReceiver").textContent = state.receiver;
  $("pOccasion").textContent = `${state.occasion} surprise · made with love`;
  $("letterCard").dataset.vibe = state.vibe;
  go("preview");
}

function renderQuestion() {
  const qs = state.questions.length ? state.questions : DEFAULT_QUESTIONS;
  if (qIndex >= qs.length) {
    $("rReceiver").textContent = state.receiver;
    go("reveal");
    return;
  }
  $("qLabel").textContent = `QUESTION ${String(qIndex + 1).padStart(2, "0")}`;
  $("questionText").textContent = qs[qIndex];
  $("questionDots").innerHTML = qs.map((_, i) => `<span class="${i === qIndex ? "on" : i < qIndex ? "done" : ""}"></span>`).join("");
  $$("#answers button").forEach((btn, i) => {
    btn.classList.remove("picked");
    btn.disabled = false;
    btn.style.setProperty("--delay", `${i * 55}ms`);
  });
}

function showQuestions() {
  qIndex = 0;
  renderQuestion();
  go("questions");
}

function answer(btn) {
  if (btn.disabled) return;
  $$("#answers button").forEach(b => b.disabled = true);
  btn.classList.add("picked");
  makeSparkBurst(btn);
  setTimeout(() => {
    qIndex++;
    renderQuestion();
  }, 650);
}

function openLetter() {
  $("lOccasion").textContent = `${state.occasion} · for ${state.rel.toLowerCase()}`;
  $("lReceiver").textContent = state.receiver;
  $("lText").textContent = state.letter;
  $("lSender").textContent = state.sender;
  $("letterCard").dataset.vibe = state.vibe;
  go("letterScreen");
}

function encodeData() {
  const json = JSON.stringify({...state, v: 2});
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  bytes.forEach(b => binary += String.fromCharCode(b));
  return btoa(binary).replaceAll("+","-").replaceAll("/","_").replaceAll("=","");
}

function decodeData(token) {
  try {
    const padded = token.replaceAll("-","+").replaceAll("_","/") + "===".slice((token.length + 3) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch { return null; }
}

function showShare() {
  const url = `${location.origin}${location.pathname}#letter=${encodeData()}`;
  $("shareLink").textContent = url;
  $("sReceiver").textContent = state.receiver;
  $("qr").innerHTML = "";
  if (window.QRCode) new QRCode($("qr"), {text:url, width:170, height:170, colorDark:"#231824", colorLight:"#fff"});
  go("share");
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText($("shareLink").textContent);
    showToast("Copied! Now send some magic 💌");
  } catch {
    showToast("Long-press the link to copy it.");
  }
}

async function nativeShare() {
  const url = $("shareLink").textContent;
  if (navigator.share) {
    try {
      await navigator.share({title:`A little surprise for ${state.receiver}`, text:"Someone made something special for you 💌", url});
    } catch {}
  } else copyLink();
}

function makeSparkBurst(origin) {
  const rect = origin.getBoundingClientRect();
  for (let i = 0; i < 12; i++) {
    const s = document.createElement("span");
    s.className = "burst-particle";
    s.textContent = i % 2 ? "✦" : "♥";
    s.style.left = `${rect.left + rect.width / 2}px`;
    s.style.top = `${rect.top + rect.height / 2}px`;
    s.style.setProperty("--x", `${(Math.random() - .5) * 180}px`);
    s.style.setProperty("--y", `${(Math.random() - .5) * 130}px`);
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 900);
  }
}

function sprinkle() {
  const holder = $("sparkles");
  for (let i=0;i<22;i++) {
    const s = document.createElement("span");
    s.textContent = i%3===0 ? "♥" : "✦";
    s.style.left = `${Math.random()*100}%`;
    s.style.top = `${Math.random()*100}%`;
    s.style.animationDelay = `${Math.random()*4}s`;
    s.style.animationDuration = `${4 + Math.random()*5}s`;
    holder.appendChild(s);
  }
}

function loadShared() {
  if (!location.hash.startsWith("#letter=")) return;
  const data = decodeData(location.hash.slice(8));
  if (!data || !data.receiver) return;
  Object.assign(state, data);
  isShared = true;
  $("pReceiver").textContent = state.receiver;
  $("pOccasion").textContent = `${state.occasion} surprise · made with love`;
  $("rReceiver").textContent = state.receiver;
  $("lOccasion").textContent = `${state.occasion} · for ${state.rel.toLowerCase()}`;
  $("lReceiver").textContent = state.receiver;
  $("lText").textContent = state.letter;
  $("lSender").textContent = state.sender;
  $("letterCard").dataset.vibe = state.vibe || "dreamy";
  go("preview");
}

$("startBtn").addEventListener("click", () => { setStep(1); go("create"); });
$("backBtn").addEventListener("click", () => {
  if (step > 1) setStep(step - 1);
  else go("home", "back");
});
$("resetBtn").addEventListener("click", resetAll);
$("next1").addEventListener("click", () => { if (state.rel) { setStep(2); go("create"); refreshStarterIfUntouched(); }});
$("next2").addEventListener("click", () => {
  if (!$("receiver").value.trim() || !$("sender").value.trim()) return showToast("Add both names first ✨");
  state.receiver = $("receiver").value.trim(); state.sender = $("sender").value.trim();
  refreshStarterIfUntouched(); setStep(3); go("create");
});
$("next3").addEventListener("click", () => {
  if (!$("letter").value.trim()) return showToast("Write a little something first 💌");
  setStep(4); go("create");
});
$("previewBtn").addEventListener("click", buildPreview);
$("editBtn").addEventListener("click", () => { setStep(4); go("create", "back"); });
$("openBtn").addEventListener("click", showQuestions);
$("letterBtn").addEventListener("click", openLetter);
$("shareBtn").addEventListener("click", showShare);
$("copyBtn").addEventListener("click", copyLink);
$("nativeShareBtn").addEventListener("click", nativeShare);
$("newBtn").addEventListener("click", resetAll);

$$(".choice").forEach(btn => btn.addEventListener("click", () => {
  $$(".choice").forEach(x => x.classList.remove("selected"));
  btn.classList.add("selected");
  state.rel = btn.dataset.rel;
  refreshStarterIfUntouched();
  updateNextState();
}));

["receiver","sender"].forEach(id => $(id).addEventListener("input", () => {
  state[id] = $(id).value.trim();
  if (id === "receiver" || id === "sender") refreshStarterIfUntouched();
  updateNextState();
}));

$("occasion").addEventListener("change", e => {
  $("customOccasionWrap").classList.toggle("hidden", e.target.value !== "Custom");
  state.occasion = e.target.value;
  refreshStarterIfUntouched();
});

$("customOccasion").addEventListener("input", () => refreshStarterIfUntouched());

$("letter").addEventListener("input", () => {
  $("letter").dataset.edited = "true";
  updateCount(); updateNextState();
});

$("clearLetter").addEventListener("click", () => {
  $("letter").value = "";
  $("letter").dataset.edited = "true";
  updateCount(); updateNextState();
  $("letter").focus();
  showToast("Blank canvas ✨ Make it completely yours.");
});

$$(".vibe").forEach(btn => btn.addEventListener("click", () => {
  $$(".vibe").forEach(x => x.classList.remove("selected"));
  btn.classList.add("selected");
  state.vibe = btn.dataset.vibe;
  $("letterCard").dataset.vibe = state.vibe;
}));

$$(".answers button").forEach(btn => btn.addEventListener("click", () => answer(btn)));

$("q1").value = DEFAULT_QUESTIONS[0]; $("q2").value = DEFAULT_QUESTIONS[1]; $("q3").value = DEFAULT_QUESTIONS[2];
updateCount(); updateNextState(); sprinkle(); loadShared();
