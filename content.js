// 기존 팝업이 있으면 제거 (중복 방지)
function removeExistingPopup() {
  const existing = document.getElementById("__char_counter_popup__");
  if (existing) existing.remove();
}

function showModal(message) {
  removeExistingPopup();

  // 1. 팝업 컨테이너 생성
  const popup = document.createElement("div");
  popup.id = "__char_counter_popup__";

  // 2. 스타일 설정 (화면 최상단 중앙 배치)
  Object.assign(popup.style, {
    position: "fixed",
    top: "24px", // 최상단에서 24px 아래 (너무 딱 붙지 않게 여백 줌)
    left: "50%", // 가로 중앙
    transform: "translateX(-50%)", // 가로 중앙 정렬만 적용 (세로는 top 기준)
    zIndex: "2147483647", // 항상 최상위
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15), 0 0 1px rgba(0,0,0,0.1)",
    padding: "20px 24px",
    minWidth: "220px",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: "14px",
    color: "#333",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    opacity: "0", // 등장 애니메이션용
    transition: "opacity 0.2s ease-in-out, transform 0.2s ease-in-out",
  });

  // 3. 내용 구성
  // 타이틀
  const title = document.createElement("div");
  title.textContent = "글자 수 계산 결과";
  title.style.fontWeight = "600";
  title.style.fontSize = "12px";
  title.style.color = "#5f6368";
  title.style.marginBottom = "2px";

  // 결과 값
  const parts = message.split(": ");
  const countNum = parts[1] || "";
  const labelText = parts[0] || "";

  const content = document.createElement("div");
  content.textContent = countNum;
  content.style.fontSize = "28px"; // 상단 바형태니까 너무 거대하지 않게 조절
  content.style.fontWeight = "bold";
  content.style.color = "#1a73e8";
  content.style.lineHeight = "1.2";

  // 설명 텍스트
  const desc = document.createElement("div");
  desc.textContent = labelText;
  desc.style.fontSize = "13px";
  desc.style.color = "#5f6368";

  // 닫기 버튼 (X 아이콘)
  const closeBtn = document.createElement("div");
  closeBtn.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  `;
  Object.assign(closeBtn.style, {
    position: "absolute",
    top: "12px",
    right: "12px",
    cursor: "pointer",
    color: "#999",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "28px",
    height: "28px",
    borderRadius: "50%",
  });

  closeBtn.onmouseover = () => {
    closeBtn.style.backgroundColor = "#f1f3f4";
    closeBtn.style.color = "#333";
  };
  closeBtn.onmouseout = () => {
    closeBtn.style.backgroundColor = "transparent";
    closeBtn.style.color = "#999";
  };
  closeBtn.onclick = removeExistingPopup;

  // 요소 조립
  popup.appendChild(closeBtn);
  popup.appendChild(title);
  popup.appendChild(content);
  popup.appendChild(desc);

  document.body.appendChild(popup);

  // 애니메이션: 위에서 살짝 내려오는 느낌
  requestAnimationFrame(() => {
    popup.style.opacity = "1";
    // 등장 시 아주 살짝만 아래로 내려와서 자리 잡음
    popup.style.transform = "translateX(-50%) translateY(0)";
  });

  // 초기 위치를 살짝 위로 잡아둠 (애니메이션 전)
  popup.style.transform = "translateX(-50%) translateY(-10px)";
}

// 메시지 수신 리스너
chrome.runtime.onMessage.addListener((payload) => {
  if (payload?.type === "SHOW_TOAST") {
    showModal(payload.msg);
  }
});

// 화면 빈 곳 클릭 시 닫기
document.addEventListener("mousedown", (e) => {
  const popup = document.getElementById("__char_counter_popup__");
  if (popup && !popup.contains(e.target)) {
    removeExistingPopup();
  }
});
