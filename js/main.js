import { loadFile } from "./fileLoader.js";
import { filterContent } from "./filter.js";
import { renameContent } from "./rename.js";

document.addEventListener("DOMContentLoaded", () => {
  const addTabButton = document.getElementById("addTab");
  const tabsContainer = document.getElementById("tabsContainer");
  const contentContainer = document.getElementById("contentContainer");
  let tabCount = 1;

  function addTab() {
    tabCount++;
    const tabId = `tab-${tabCount}`;
    const tabContentId = `tab-content-${tabCount}`;

    // Create new tab
    const newTab = document.createElement("div");
    newTab.className = "tab";
    newTab.id = tabId;
    newTab.innerHTML = `
            <span contenteditable="true">Tab ${tabCount}</span>
            <button class="removeTab">x</button>
        `;
    tabsContainer.appendChild(newTab);

    // Create new tab content
    const newTabContent = document.createElement("div");
    newTabContent.className = "tab-content";
    newTabContent.id = tabContentId;
    newTabContent.innerHTML = `
            <input type="file" id="fileInput-${tabCount}">
            <div class="file-options" id="fileOptions-${tabCount}"></div>
            <div class="rename-options">
                <input type="text" id="renameId-${tabCount}" placeholder="ID to rename">
                <input type="text" id="renameName-${tabCount}" placeholder="New name">
                <button id="renameButton-${tabCount}">Rename</button>
                <label><input type="checkbox" id="toggleRename-${tabCount}"> Show renamed</label>
            </div>
            <table class="file-content" id="fileContent-${tabCount}">
                <thead>
                    <tr>
                        <th>Direction</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Category</th>
                        <th>ID</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        `;
    contentContainer.appendChild(newTabContent);

    // Add event listeners
    addEventListeners(tabCount);

    // Switch to the new tab
    switchTab(tabId, tabContentId);
  }

  function addEventListeners(tabCount) {
    const tabId = `tab-${tabCount}`;
    const tabContentId = `tab-content-${tabCount}`;

    // Add event listener to remove tab button
    document
      .querySelector(`#${tabId} .removeTab`)
      .addEventListener("click", () => {
        document.getElementById(tabId).remove();
        document.getElementById(tabContentId).remove();
      });

    // Add event listener to switch tab content
    document.getElementById(tabId).addEventListener("click", () => {
      switchTab(tabId, tabContentId);
    });

    // Add event listener to file input
    document
      .getElementById(`fileInput-${tabCount}`)
      .addEventListener("change", (event) => {
        loadFile(event, tabCount, tabContentId);
      });

    // Add event listener for rename button
    document
      .getElementById(`renameButton-${tabCount}`)
      .addEventListener("click", () => {
        renameContent(tabContentId);
      });

    // Add event listener for toggle rename checkbox
    document
      .getElementById(`toggleRename-${tabCount}`)
      .addEventListener("change", () => {
        filterContent(tabContentId);
      });
  }

  function switchTab(tabId, tabContentId) {
    document.querySelectorAll(".tab").forEach((tab) => {
      tab.classList.remove("active");
    });
    document.querySelectorAll(".tab-content").forEach((content) => {
      content.classList.remove("active");
    });
    document.getElementById(tabId).classList.add("active");
    document.getElementById(tabContentId).classList.add("active");
  }

  // Initialize one tab on startup
  addEventListeners(1);
  switchTab("tab-1", "tab-content-1");

  addTabButton.addEventListener("click", addTab);
});
