const cases = {
  normal: {
    id: "DEMO / 001",
    vehicle: "2023 Hyundai Kona Electric",
    warranty: "WARRANTY: INACTIVE",
    quote: "The infotainment screen freezes occasionally, but the vehicle drives normally.",
    urgency: "Low",
    consequence: "A routine screen issue needs the right technician, not the same review path as a safety fault.",
    route: [
      { kicker: "INTAKE", icon: "↙", title: "A request becomes a case.", description: "The API validates the customer and vehicle details, then checks the case ID to prevent a duplicate record.", review: "Not checked", outcome: "Case received", event: "Case accepted after validation and duplicate check.", status: "RECEIVED" },
      { kicker: "AI CLASSIFICATION", icon: "◈", title: "The screen issue is classified.", description: "AI extracts an infotainment issue, low urgency, and the skill needed for diagnosis. The structured result is saved with the case.", review: "Not checked", outcome: "Classified", event: "Infotainment issue classified as low urgency.", status: "CLASSIFIED" },
      { kicker: "APPROVAL GATE", icon: "◇", title: "No manager decision needed.", description: "This example has no high urgency, active warranty, or safety-sensitive symptom, so the normal service path can continue.", review: "Not required", outcome: "Continue to resources", event: "Safety and warranty rules did not trigger human review.", status: "CLASSIFIED" },
      { kicker: "RESOURCE CHECK", icon: "⌁", title: "Match skills before a slot.", description: "An available electronics technician matches the requested skill. This illustrative case requires no replacement parts.", review: "Not required", outcome: "Resources ready", event: "Suitable technician matched; no parts required in this example.", status: "RESOURCES READY" },
      { kicker: "NEXT ACTION", icon: "✓", title: "An appointment can be proposed.", description: "With a suitable technician and no missing parts, the system proposes a service slot and calculates an SLA deadline.", review: "Not required", outcome: "Appointment proposed", event: "Appointment proposal and SLA deadline created.", status: "PROPOSED" }
    ]
  },
  critical: {
    id: "DEMO / 002",
    vehicle: "2024 Tesla Model Y",
    warranty: "WARRANTY: ACTIVE",
    quote: "The high-voltage battery warning is on and the car suddenly loses power while driving.",
    urgency: "Critical",
    consequence: "Loss of power while driving needs attention. The demo holds the case for a person instead of letting AI decide it alone.",
    route: [
      { kicker: "INTAKE", icon: "↙", title: "A serious symptom arrives.", description: "The request is validated and saved as one case. The description includes a warning light and loss of power while driving.", review: "Not checked", outcome: "Case received", event: "Safety-sensitive symptom received through case intake.", status: "RECEIVED" },
      { kicker: "AI CLASSIFICATION", icon: "⚡", title: "A possible battery fault is flagged.", description: "AI structures the report as a high-voltage system issue with critical urgency. This is an intake classification, not a vehicle diagnosis.", review: "Not checked", outcome: "Classified", event: "Possible high-voltage fault classified as critical.", status: "CRITICAL" },
      { kicker: "APPROVAL GATE", icon: "◇", title: "A person must review this.", description: "Critical urgency, safety risk, and active warranty trigger the approval gate. The service team must make the decision before automatic scheduling continues.", review: "Required", outcome: "Awaiting manager", event: "Case held for a service manager’s decision.", status: "AWAITING REVIEW" },
      { kicker: "RESOURCE CHECK", icon: "⌁", title: "Check the people and parts.", description: "After the simulated manager approval, a certified high-voltage technician matches. A required battery pack is unavailable in this example.", review: "Approved in demo", outcome: "Part unavailable", event: "Technician matched; required battery pack unavailable.", status: "PARTS HOLD" },
      { kicker: "NEXT ACTION", icon: "↗", title: "Send it to resource review.", description: "The missing part prevents an automatic appointment proposal. The service team can source the part and update the customer while the case remains visible.", review: "Approved in demo", outcome: "Resource review", event: "No appointment proposed while required parts are unavailable.", status: "RESOURCE REVIEW" }
    ]
  },
  parts: {
    id: "DEMO / 003",
    vehicle: "2024 Tata Nexon EV",
    warranty: "WARRANTY: ACTIVE",
    quote: "Range has fallen sharply, and the vehicle needs a battery system inspection.",
    urgency: "High",
    consequence: "Approval is not the same as readiness. Missing parts should stop a premature appointment proposal.",
    route: [
      { kicker: "INTAKE", icon: "↙", title: "The service request is captured.", description: "The customer, vehicle, and symptom are recorded after field validation and a case-ID duplicate check.", review: "Not checked", outcome: "Case received", event: "Battery range concern received and validated.", status: "RECEIVED" },
      { kicker: "AI CLASSIFICATION", icon: "◈", title: "Battery inspection is suggested.", description: "AI provides a structured battery-system category, high urgency, and a suitable technician skill for the next decision.", review: "Not checked", outcome: "Classified", event: "Case categorized for battery-system inspection.", status: "HIGH URGENCY" },
      { kicker: "APPROVAL GATE", icon: "◇", title: "Manager approval is recorded.", description: "This scenario begins with a completed manager review. The real approval endpoint records the reviewer and decision in the audit-events table.", review: "Approved in demo", outcome: "Continue to resources", event: "Illustrative manager approval recorded in the walkthrough.", status: "APPROVED" },
      { kicker: "RESOURCE CHECK", icon: "⌁", title: "A technician is available. A part is not.", description: "The technician skill matches, but the required battery component is not in stock. Resource readiness remains false.", review: "Approved in demo", outcome: "Part unavailable", event: "Technician matched; parts inventory blocks readiness.", status: "PARTS HOLD" },
      { kicker: "NEXT ACTION", icon: "↗", title: "Keep the promise realistic.", description: "The system sends the case for resource review rather than proposing a slot the team cannot fulfill.", review: "Approved in demo", outcome: "Resource review", event: "Appointment proposal withheld until resources are ready.", status: "RESOURCE REVIEW" }
    ]
  }
};

const state = { scenario: "normal", step: 0, criticalApproved: false, timer: null, playing: false };
const $ = (id) => document.getElementById(id);
const scenarioButtons = [...document.querySelectorAll(".scenario")];
const stepButtons = [...document.querySelectorAll(".route-step")];

function stopPlayback() {
  if (state.timer !== null) window.clearTimeout(state.timer);
  state.timer = null;
  state.playing = false;
  $("play-icon").textContent = "▶";
  $("play-label").textContent = state.step === 4 ? "Replay case journey" : "Play case journey";
}

function currentFrame() {
  const frame = { ...cases[state.scenario].route[state.step] };
  if (state.scenario === "critical" && state.step === 2 && state.criticalApproved) {
    frame.title = "A manager approves the review.";
    frame.description = "In this simulation, the manager records an approval. The real endpoint stores the reviewer, decision, and notes in the audit trail.";
    frame.review = "Approved in demo";
    frame.outcome = "Continue to resources";
    frame.event = "Simulated manager approval unlocks resource checking.";
    frame.status = "APPROVED";
  }
  return frame;
}

function render() {
  const data = cases[state.scenario];
  const frame = currentFrame();
  $("case-id").textContent = data.id;
  $("case-vehicle").textContent = data.vehicle;
  $("case-warranty").textContent = data.warranty;
  $("case-quote").textContent = `“${data.quote}”`;
  $("scenario-consequence").textContent = data.consequence;
  $("case-status").textContent = frame.status;
  $("case-status").classList.toggle("is-critical", state.scenario === "critical" && state.step >= 1 && !state.criticalApproved);
  $("case-status").classList.toggle("is-warning", (state.scenario === "parts" || state.criticalApproved) && state.step >= 3);
  $("decision-symbol").textContent = frame.icon;
  $("decision-symbol").classList.remove("animate");
  requestAnimationFrame(() => $("decision-symbol").classList.add("animate"));
  $("decision-kicker").textContent = frame.kicker;
  $("decision-title").textContent = frame.title;
  $("decision-description").textContent = frame.description;
  $("fact-urgency").textContent = state.step === 0 ? "Not classified" : data.urgency;
  $("fact-review").textContent = frame.review;
  $("fact-outcome").textContent = frame.outcome;
  $("event-line").textContent = frame.event;
  $("play-icon").textContent = state.playing ? "Ⅱ" : "▶";
  $("play-label").textContent = state.playing ? "Pause journey" : state.step === 4 ? "Replay case journey" : "Play case journey";
  const decisionCard = document.querySelector(".decision-card");
  decisionCard.classList.remove("frame-changing");
  requestAnimationFrame(() => decisionCard.classList.add("frame-changing"));
  $("step-count").textContent = `STEP ${String(state.step + 1).padStart(2, "0")} / 05`;
  $("progress-fill").style.width = `${(state.step / 4) * 100}%`;
  $("approve-demo").hidden = !(state.scenario === "critical" && state.step === 2 && !state.criticalApproved);
  $("prev-step").disabled = state.step === 0;
  $("next-step").disabled = state.step === 4 || (state.scenario === "critical" && state.step === 2 && !state.criticalApproved);

  scenarioButtons.forEach((button) => {
    const selected = button.dataset.scenario === state.scenario;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  stepButtons.forEach((button, index) => {
    button.classList.toggle("is-current", index === state.step);
    button.classList.toggle("is-done", index < state.step);
    if (index === state.step) button.setAttribute("aria-current", "step");
    else button.removeAttribute("aria-current");
  });
}

function goToStep(index) {
  const next = Math.max(0, Math.min(4, index));
  if (state.scenario === "critical" && !state.criticalApproved && next > 2) {
    state.step = 2;
    stopPlayback();
    render();
    $("approve-demo").focus();
    return false;
  }
  state.step = next;
  render();
  return true;
}

function playNext() {
  if (state.step >= 4) {
    stopPlayback();
    return;
  }
  if (state.scenario === "critical" && state.step === 2 && !state.criticalApproved) {
    stopPlayback();
    $("play-label").textContent = "Continue after approval";
    return;
  }
  state.timer = window.setTimeout(() => {
    state.timer = null;
    goToStep(state.step + 1);
    playNext();
  }, 2600);
}

scenarioButtons.forEach((button) => button.addEventListener("click", () => {
  stopPlayback();
  state.scenario = button.dataset.scenario;
  state.step = 0;
  state.criticalApproved = false;
  render();
}));

stepButtons.forEach((button) => button.addEventListener("click", () => {
  stopPlayback();
  goToStep(Number(button.dataset.step));
}));

$("prev-step").addEventListener("click", () => { stopPlayback(); goToStep(state.step - 1); });
$("next-step").addEventListener("click", () => { stopPlayback(); goToStep(state.step + 1); });
$("reset-demo").addEventListener("click", () => {
  stopPlayback();
  state.step = 0;
  state.criticalApproved = false;
  render();
});
$("approve-demo").addEventListener("click", () => {
  state.criticalApproved = true;
  render();
  $("next-step").focus();
});
$("play-demo").addEventListener("click", () => {
  if (state.playing) { stopPlayback(); return; }
  if (state.step === 4) { state.step = 0; if (state.scenario === "critical") state.criticalApproved = false; render(); }
  $("play-icon").textContent = "Ⅱ";
  $("play-label").textContent = "Pause journey";
  state.playing = true;
  playNext();
});

render();

// Progressive enhancement: content remains visible when JavaScript is unavailable.
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let visitorMotionOff = false;
try { visitorMotionOff = localStorage.getItem("portfolio-motion") === "off"; } catch { /* Storage can be disabled. */ }
let motionEnabled = true;
function updateMotion() {
  motionEnabled = !reducedMotion.matches && !visitorMotionOff;
  document.documentElement.classList.toggle("motion-off", !motionEnabled);
  $("motion-toggle").setAttribute("aria-pressed", String(motionEnabled));
  $("motion-toggle").disabled = reducedMotion.matches;
  $("motion-toggle").title = reducedMotion.matches ? "Reduced motion follows your device accessibility setting." : "Toggle decorative motion";
  $("motion-label").textContent = reducedMotion.matches ? "Motion reduced" : motionEnabled ? "Motion on" : "Motion off";
  if (!motionEnabled) document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
  scheduleScroll();
}
$("motion-toggle").addEventListener("click", () => {
  visitorMotionOff = !visitorMotionOff;
  try { localStorage.setItem("portfolio-motion", visitorMotionOff ? "off" : "on"); } catch { /* Preference is still applied this visit. */ }
  updateMotion();
  $("preference-status").textContent = motionEnabled ? "Decorative motion enabled." : "Decorative motion disabled.";
});
reducedMotion.addEventListener("change", updateMotion);

const revealTargets = document.querySelectorAll(".intro-strip, .section-heading, .flagship-links, .demo, .proof-card, .architecture, .project-card, .about-copy, .about-art, .contact > *");
if ("IntersectionObserver" in window) {
  document.documentElement.classList.add("motion-ready");
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) { target.classList.add("is-visible"); revealObserver.unobserve(target); }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -25px 0px" });
  revealTargets.forEach((element) => {
    element.classList.add("reveal");
    if (element.matches(".project-card, .proof-card")) {
      const siblings = [...element.parentElement.children];
      element.style.setProperty("--reveal-delay", `${(siblings.indexOf(element) % 3) * 70}ms`);
    }
    revealObserver.observe(element);
  });
  document.addEventListener("focusin", (event) => {
    event.target.closest(".reveal")?.classList.add("is-visible");
  });
  const heroObserver = new IntersectionObserver(([entry]) => {
    entry.target.classList.toggle("is-in-view", entry.isIntersecting);
  });
  heroObserver.observe(document.querySelector(".hero"));
}

let scrollFrame = null;
const hero = document.querySelector(".hero");
const navLinks = [...document.querySelectorAll(".desktop-nav a")];
const navSections = navLinks.map((link) => document.querySelector(link.getAttribute("href")));
function paintScroll() {
  scrollFrame = null;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  $("reading-progress").style.transform = `scaleX(${maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0})`;
  const depth = motionEnabled ? Math.min(window.scrollY, hero.offsetHeight) : 0;
  hero.style.setProperty("--hero-depth", `${depth * 0.045}px`);
  hero.style.setProperty("--glow-depth", `${depth * 0.025}px`);
  let activeSection = null;
  let nearestTop = -Infinity;
  navSections.forEach((section, index) => {
    const top = section.getBoundingClientRect().top;
    if (top < window.innerHeight * 0.45 && top > nearestTop) {
      activeSection = index;
      nearestTop = top;
    }
  });
  navLinks.forEach((link, index) => {
    if (index === activeSection) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}
function scheduleScroll() {
  if (scrollFrame === null) scrollFrame = requestAnimationFrame(paintScroll);
}
window.addEventListener("scroll", scheduleScroll, { passive: true });
window.addEventListener("resize", scheduleScroll);
updateMotion();

const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
document.querySelectorAll(".project-card, .proof-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (!motionEnabled || !finePointer.matches) return;
    const bounds = card.getBoundingClientRect();
    card.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
    card.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
  });
});

// A quiet original soundscape, synthesized locally. No music files or tracking.
// Audio is never started on load; the visitor must explicitly enable it.
let audioContext = null;
let audioMaster = null;
let soundEnabled = false;
let audioSuspendTimer = null;
function buildSoundscape() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) throw new Error("Audio is not supported by this browser.");
  audioContext = new AudioContextClass();
  audioMaster = audioContext.createGain();
  audioMaster.gain.value = 0;
  audioMaster.connect(audioContext.destination);
  const filter = audioContext.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 650;
  filter.Q.value = 0.5;
  filter.connect(audioMaster);
  [130.81, 196, 261.63, 329.63].forEach((frequency, index) => {
    const tone = audioContext.createOscillator();
    const toneGain = audioContext.createGain();
    tone.type = "sine";
    tone.frequency.value = frequency;
    tone.detune.value = index % 2 ? 3 : -3;
    toneGain.gain.value = 0.13;
    tone.connect(toneGain).connect(filter);
    const breath = audioContext.createOscillator();
    const breathGain = audioContext.createGain();
    breath.frequency.value = 0.05 + index * 0.017;
    breathGain.gain.value = 0.035;
    breath.connect(breathGain).connect(toneGain.gain);
    tone.start();
    breath.start();
  });
}
function updateSoundUI() {
  $("sound-toggle").setAttribute("aria-pressed", String(soundEnabled));
  $("sound-settings").hidden = !soundEnabled;
  $("sound-label").textContent = soundEnabled ? document.hidden ? "Sound paused" : "Sound on" : "Sound off";
  document.documentElement.classList.toggle("sound-playing", soundEnabled && !document.hidden);
}
function fadeSound(on) {
  if (!audioContext || !audioMaster) return;
  const now = audioContext.currentTime;
  audioMaster.gain.cancelScheduledValues(now);
  audioMaster.gain.setValueAtTime(audioMaster.gain.value, now);
  audioMaster.gain.linearRampToValueAtTime(on ? Number($("sound-volume").value) / 100 * 0.07 : 0, now + 0.65);
}
async function syncSound() {
  window.clearTimeout(audioSuspendTimer);
  if (!audioContext) return;
  if (soundEnabled && !document.hidden) {
    await audioContext.resume();
    fadeSound(soundEnabled && !document.hidden);
  } else {
    fadeSound(false);
    if (document.hidden) await audioContext.suspend();
    else audioSuspendTimer = window.setTimeout(() => {
      if (!soundEnabled) audioContext.suspend();
    }, 700);
  }
}
$("sound-toggle").addEventListener("click", async () => {
  soundEnabled = !soundEnabled;
  updateSoundUI();
  try {
    if (soundEnabled && !audioContext) buildSoundscape();
    await syncSound();
    $("preference-status").textContent = soundEnabled ? "Ambient sound enabled. Adjust volume above the sound button." : "Ambient sound muted.";
  } catch {
    soundEnabled = false;
    updateSoundUI();
    $("preference-status").textContent = "Ambient sound is unavailable in this browser.";
  }
});
$("sound-volume").addEventListener("input", () => {
  $("volume-value").textContent = `${$("sound-volume").value}%`;
  fadeSound(soundEnabled && !document.hidden);
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopPlayback();
  updateSoundUI();
  syncSound().catch(() => { soundEnabled = false; updateSoundUI(); });
});
window.addEventListener("pagehide", () => { audioContext?.suspend(); });
updateSoundUI();
