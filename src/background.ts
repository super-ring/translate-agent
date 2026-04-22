chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "translate-agent",
    title: "智能翻译",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId === "translate-agent" && info.selectionText) {
    await chrome.storage.local.set({
      "translate-agent-context-text": info.selectionText,
    });
    // Open the popup programmatically (Chrome 99+)
    try {
      await chrome.action.openPopup();
    } catch {
      // Fallback: if openPopup is not available, the user can click the icon manually
      // The text is already saved in storage and will be picked up on next popup open
    }
  }
});
