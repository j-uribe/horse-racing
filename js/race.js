function getFinishX() {
  const track = document.getElementById("track-0");
  return track ? track.clientWidth - 52 : 400;
}

function tick() {
  const finishX = getFinishX();
  const { speed } = getConfig();

  state.horses.forEach((h) => {
    if (h.finished) return;

    h.pos += (Math.random() * 3.5 + 0.5) * speed * 1.4;
    const el = document.getElementById(`horse-${h.id}`);
    el.style.left = Math.min(80 + h.pos, finishX) + "px";

    if (80 + h.pos >= finishX) {
      h.finished = true;
      state.finished.push(h);
      el.classList.remove("running");

      const place = state.finished.length;
      const badge = document.createElement("div");
      badge.className = "winner-badge";
      badge.textContent =
        place === 1 ? "🥇 1°" : place === 2 ? "🥈 2°" : place === 3 ? "🥉 3°" : `${place}°`;
      document.getElementById(`track-${h.id}`).appendChild(badge);

      if (place === 1) setStatus(`¡${h.name} va primero!`);
    }
  });

  if (state.finished.length === state.horses.length) {
    clearInterval(state.raceInterval);
    state.running = false;
    showResults();
  }
}

function startRace() {
  if (state.running) return;

  // If last race is fully done, reset before starting a new one
  if (state.finished.length > 0 && state.finished.length === state.horses.length) {
    resetRace();
    return;
  }

  if (!state.horses.length) buildTracks();

  state.running = true;
  document.getElementById("podium").style.display = "none";
  setStatus("¡Y arrancan los caballos!");

  state.horses.forEach((h) => {
    const el = document.getElementById(`horse-${h.id}`);
    const nameVal = document.getElementById(`name-${h.id}`)?.value || DEFAULT_NAMES[h.id];
    const iconVal = document.getElementById(`icon-${h.id}`)?.value || DEFAULT_EMOJIS[h.id];

    h.name = nameVal;
    h.icon = iconVal;
    h.flipped = state.flipState[h.id];

    document.getElementById(`inner-${h.id}`).textContent = iconVal;
    document.getElementById(`lane-label-${h.id}`).textContent = nameVal;

    el.classList.add("running");
    el.classList.remove("configurable");
  });

  const { speed } = getConfig();
  state.raceInterval = setInterval(tick, Math.round(220 / speed));
}

function resetRace() {
  clearInterval(state.raceInterval);
  state.running = false;
  document.getElementById("podium").style.display = "none";
  setStatus("Configura y presiona Iniciar para arrancar la carrera.");
  buildTracks();
}
