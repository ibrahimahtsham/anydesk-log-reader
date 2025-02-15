export function filterContent(tabContentId) {
  const tabContent = document.getElementById(tabContentId);
  const fileContentDiv = tabContent.querySelector(".file-content tbody");
  const originalContent = JSON.parse(tabContent.dataset.originalContent);
  const renamedContent = JSON.parse(tabContent.dataset.renamedContent);

  const showPasswd = document.getElementById(
    `filterPasswd-${tabContentId.split("-")[1]}`
  ).checked;
  const showToken = document.getElementById(
    `filterToken-${tabContentId.split("-")[1]}`
  ).checked;
  const showQuestion = document.getElementById(
    `filterQuestion-${tabContentId.split("-")[1]}`
  ).checked;
  const showRenamed = document.getElementById(
    `toggleRename-${tabContentId.split("-")[1]}`
  ).checked;

  const contentToDisplay = showRenamed ? renamedContent : originalContent;

  const filteredContent = contentToDisplay.filter((line) => {
    if (showPasswd && line.category.includes("Passwd")) return true;
    if (showToken && line.category.includes("Token")) return true;
    if (showQuestion && line.category.includes("?")) return true;
    return !showPasswd && !showToken && !showQuestion;
  });

  fileContentDiv.innerHTML = filteredContent
    .map(
      (line) => `
          <tr>
              <td>${line.direction}</td>
              <td>${line.date}</td>
              <td>${line.time}</td>
              <td>${line.category}</td>
              <td>${line.id}</td>
          </tr>
      `
    )
    .join("");
}
