document.getElementById("horse-count").addEventListener("change", () => {
  buildConfig();
  if (!state.running) buildTracks();
});

document.getElementById("speed-slider").addEventListener("input", function () {
  document.getElementById("speed-label").textContent = SPEED_LABELS[this.value];
});

buildConfig();
buildTracks();
