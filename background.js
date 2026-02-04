const MENU_WITH_SPACE = "count_with_space";
const MENU_WITHOUT_SPACE = "count_without_space";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: MENU_WITH_SPACE,
    title: "공백 포함 글자 수 세기",
    contexts: ["selection"],
  });

  chrome.contextMenus.create({
    id: MENU_WITHOUT_SPACE,
    title: "공백 미포함 글자 수 세기",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const text = info.selectionText ?? "";

  // 1. 윈도우 줄바꿈(\r\n)을 리눅스/맥 스타일(\n) 하나로 통일 (네이버 기준 맞춤)
  const normalizedText = text.replace(/\r\n/g, "\n");

  // 2. 공백 포함 계산 (이제 줄바꿈이 1글자로 정확히 계산됨)
  const withSpace = Array.from(normalizedText).length;

  // 3. 공백 미포함 계산 (모든 공백 제거 후 계산)
  const withoutSpace = Array.from(normalizedText.replace(/\s/g, "")).length;

  let msg = "";
  if (info.menuItemId === MENU_WITH_SPACE) {
    msg = `공백 포함 글자 수: ${withSpace}`;
  } else if (info.menuItemId === MENU_WITHOUT_SPACE) {
    msg = `공백 미포함 글자 수: ${withoutSpace}`;
  } else {
    return;
  }

  if (tab?.id) chrome.tabs.sendMessage(tab.id, { type: "SHOW_TOAST", msg });
});
