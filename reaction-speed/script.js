const statusText = document.getElementById("status-text");
const gameButton = document.getElementById("game-button");
const lastTimeEl = document.getElementById("last-time");
const bestTimeEl = document.getElementById("best-time");
const attemptsEl = document.getElementById("attempts");

let state = "idle";
let waitTimeoutId = null;
let startTime = null;
let bestTime = null;
let attempts = 0;

function setState(newState) {
  state = newState;

  gameButton.classList.remove("waiting", "ready", "disabled");

  if (state === "idle") {
    gameButton.textContent = "Start";
    statusText.textContent = "Click “Start” and wait for green.";
  } else if (state === "waiting") {
    gameButton.textContent = "Wait...";
    gameButton.classList.add("waiting");
    statusText.textContent = "Wait for green. Don't click yet!";
  } else if (state === "ready") {
    gameButton.textContent = "TAP!";
    gameButton.classList.add("ready");
    statusText.textContent = "Tap now!";
  }
}

function startRound() {
  if (waitTimeoutId !== null) {
    clearTimeout(waitTimeoutId);
    waitTimeoutId = null;
  }

  setState("waiting");

  const delay = 1500 + Math.random() * 2000; 

  waitTimeoutId = setTimeout(() => {
    waitTimeoutId = null;
    setState("ready");
    startTime = performance.now();
  }, delay);
}

function handleTap() {
  if (state === "idle") {
    startRound();
    return;
  }

  if (state === "waiting") {
    if (waitTimeoutId !== null) {
      clearTimeout(waitTimeoutId);
      waitTimeoutId = null;
    }
    gameButton.classList.add("disabled");
    statusText.textContent = "Too early! Try again.";
    gameButton.textContent = "Too early";
    setTimeout(() => {
      setState("idle");
    }, 900);
    return;
  }

  if (state === "ready") {
    const endTime = performance.now();
    const reactionMs = endTime - startTime;

    attempts += 1;
    attemptsEl.textContent = attempts.toString();

    lastTimeEl.textContent = reactionMs.toFixed(0) + " ms";

    if (bestTime === null || reactionMs < bestTime) {
      bestTime = reactionMs;
      bestTimeEl.textContent = bestTime.toFixed(0) + " ms";
    }

    statusText.textContent =
      "Nice! Click Start to try again and beat your best time.";
    setState("idle");
  }
}

gameButton.addEventListener("click", handleTap);

setState("idle");
