function showToast(message) {
  const ID = "__char_counter_toast__";
  let el = document.getElementById(ID);

  if (!el) {
    el = document.createElement("div");
    el.id = ID;
    el.style.position = "fixed";
    el.style.top = "12px";
    el.style.left = "50%";
    el.style.transform = "translateX(-50%)";
    el.style.zIndex = "2147483647";
    el.style.padding = "10px 14px";
    el.style.borderRadius = "8px";
    el.style.background = "rgba(0,0,0,0.85)";
    el.style.color = "#fff";
    el.style.fontSize = "14px";
    el.style.fontFamily =
      "system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
    el.style.boxShadow = "0 6px 18px rgba(0,0,0,0.25)";
    document.documentElement.appendChild(el);
  }

  el.textContent = message;
  el.style.display = "block";

  clearTimeout(window.__charCounterToastTimer);
  window.__charCounterToastTimer = setTimeout(() => {
    el.style.display = "none";
  }, 2500);
}

chrome.runtime.onMessage.addListener((payload) => {
  if (payload?.type === "SHOW_TOAST") showToast(payload.msg);
});
