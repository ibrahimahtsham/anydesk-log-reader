import { filterContent } from "./filter.js";

export function renameContent(tabContentId) {
  const tabContent = document.getElementById(tabContentId);
  const renameId = document.getElementById(
    `renameId-${tabContentId.split("-")[1]}`
  ).value;
  const renameName = document.getElementById(
    `renameName-${tabContentId.split("-")[1]}`
  ).value;

  if (!renameId || !renameName) return;

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
