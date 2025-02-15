export function filterContent(tabContentId) {
  const tabContent = document.getElementById(tabContentId);
  const fileContentDiv = tabContent.querySelector(".file-content tbody");
  const originalContent = JSON.parse(tabContent.dataset.originalContent);
  const renamedContent = JSON.parse(tabContent.dataset.renamedContent);

  const tabIndex = tabContentId.split("-")[2];
  const showRenamedElement = document.getElementById(
    `toggleRename-${tabIndex}`
  );
  const showRenamed = showRenamedElement.checked;

  const contentToDisplay = showRenamed ? renamedContent : originalContent;

  const fileName = tabContent.dataset.fileName;

  let filteredContent = contentToDisplay;

  if (fileName === "connection_trace.txt") {
    const showPasswdElement = document.getElementById(
      `filterPasswd-${tabIndex}`
    );
    const showTokenElement = document.getElementById(`filterToken-${tabIndex}`);
    const showQuestionElement = document.getElementById(
      `filterQuestion-${tabIndex}`
    );

    const showPasswd = showPasswdElement ? showPasswdElement.checked : false;
    const showToken = showTokenElement ? showTokenElement.checked : false;
    const showQuestion = showQuestionElement
      ? showQuestionElement.checked
      : false;

    filteredContent = contentToDisplay.filter((line) => {
      if (showPasswd && line.category.includes("Passwd")) return true;
      if (showToken && line.category.includes("Token")) return true;
      if (showQuestion && line.category.includes("?")) return true;
      return !showPasswd && !showToken && !showQuestion;
    });
  } else if (fileName === "ad_svc.trace" || fileName === "ad.trace") {
    const showWarningElement = document.getElementById(
      `filterWarning-${tabIndex}`
    );
    const showInfoElement = document.getElementById(`filterInfo-${tabIndex}`);

    const showWarning = showWarningElement ? showWarningElement.checked : false;
    const showInfo = showInfoElement ? showInfoElement.checked : false;

    filteredContent = contentToDisplay.filter((line) => {
      if (showWarning && line.level.includes("warning")) return true;
      if (showInfo && line.level.includes("info")) return true;
      return !showWarning && !showInfo;
    });
  }

  fileContentDiv.innerHTML = filteredContent
    .map(
      (line) => `
            <tr>
                <td>${line.direction || line.level}</td>
                <td>${line.date}</td>
                <td>${line.time}</td>
                <td>${line.service || ""}</td>
                <td>${line.pid || ""}</td>
                <td>${line.tid || ""}</td>
                <td>${line.category}</td>
                <td>${line.message || line.id}</td>
            </tr>
        `
    )
    .join("");
}
