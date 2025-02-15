import { filterContent } from "./filter.js";

export function renameContent(tabContentId) {
  const tabContent = document.getElementById(tabContentId);
  const tabIndex = tabContentId.split("-")[2];
  const renameIdElement = document.getElementById(`renameId-${tabIndex}`);
  const renameNameElement = document.getElementById(`renameName-${tabIndex}`);

  if (!renameIdElement || !renameNameElement) {
    console.error("Rename input elements not found");
    return;
  }

  const renameId = renameIdElement.value;
  const renameName = renameNameElement.value;

  if (!renameId || !renameName) return;

  const fileName = tabContent.dataset.fileName;
  if (fileName !== "connection_trace.txt") {
    console.error("Renaming is only allowed for connection_trace.txt");
    return;
  }

  const originalContent = JSON.parse(tabContent.dataset.originalContent);
  const renamedContent = originalContent.map((line) => {
    return {
      ...line,
      id: line.id === renameId ? renameName : line.id,
    };
  });

  tabContent.dataset.renamedContent = JSON.stringify(renamedContent);
  filterContent(tabContentId);
}
