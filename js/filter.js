export function filterContent(tabContentId) {
  const tabContent = document.getElementById(tabContentId);
  const fileContentDiv = tabContent.querySelector(".file-content tbody");
  const originalContent = JSON.parse(tabContent.dataset.originalContent);
  const renamedContent = JSON.parse(tabContent.dataset.renamedContent);

  const tabIndex = tabContentId.split("-")[2];
  const showRenamedElement = document.getElementById(
    `toggleRename-${tabIndex}`
  );
  const showRenamed = showRenamedElement ? showRenamedElement.checked : false;

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
    const showErrorElement = document.getElementById(`filterError-${tabIndex}`);
    const showCategoryElement = document.getElementById(
      `filterCategory-${tabIndex}`
    );

    const showWarning = showWarningElement ? showWarningElement.checked : false;
    const showInfo = showInfoElement ? showInfoElement.checked : false;
    const showError = showErrorElement ? showErrorElement.checked : false;
    const showCategory = showCategoryElement ? showCategoryElement.value : "";

    filteredContent = contentToDisplay.filter((line) => {
      if (showWarning && line.level.includes("warning")) return true;
      if (showInfo && line.level.includes("info")) return true;
      if (showError && line.level.includes("error")) return true;
      if (showCategory && line.category.includes(showCategory)) return true;
      return !showWarning && !showInfo && !showError && !showCategory;
    });
  }

  fileContentDiv.innerHTML = filteredContent
    .map((line) => {
      if (fileName === "connection_trace.txt") {
        return `
            <tr>
              <td>${line.direction || ""}</td>
              <td>${line.date}</td>
              <td>${line.time}</td>
              <td>${line.category}</td>
              <td>${line.id}</td>
            </tr>
          `;
      } else if (fileName === "ad_svc.trace" || fileName === "ad.trace") {
        return `
            <tr>
              <td>${line.level}</td>
              <td>${line.date}</td>
              <td>${line.time}</td>
              <td>${line.service || ""}</td>
              <td>${line.pid || ""}</td>
              <td>${line.tid || ""}</td>
              <td>${line.category}</td>
              <td>${line.message || ""}</td>
            </tr>
          `;
      }
    })
    .join("");
}
