import { parseFile } from "./fileParser.js";
import { filterContent } from "./filter.js";

export function loadFile(event, tabCount, tabContentId, timeAdjustment) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileContent = e.target.result;
      const lines = fileContent.split("\n");

      const adjustedLines = parseFile(file.name, lines, timeAdjustment);

      const tbody = document.querySelector(`#fileContent-${tabCount} tbody`);
      tbody.innerHTML = adjustedLines
        .map((line) => {
          if (file.name === "connection_trace.txt") {
            return `
              <tr>
                <td>${line.direction || ""}</td>
                <td>${line.date}</td>
                <td>${line.time}</td>
                <td>${line.category}</td>
                <td>${line.id}</td>
              </tr>
            `;
          } else if (file.name === "ad_svc.trace" || file.name === "ad.trace") {
            return `
              <tr>
                <td>${line.level}</td>
                <td>${line.date}</td>
                <td>${line.time}</td>
                <td>${line.service}</td>
                <td>${line.pid}</td>
                <td>${line.tid}</td>
                <td>${line.category}</td>
                <td>${line.message}</td>
              </tr>
            `;
          }
        })
        .join("");

      // Store the original content for filtering and renaming
      const tabContent = document.getElementById(tabContentId);
      tabContent.dataset.originalContent = JSON.stringify(adjustedLines);
      tabContent.dataset.renamedContent = JSON.stringify(adjustedLines);
      tabContent.dataset.fileName = file.name;

      // Display file options and table based on file name
      const fileOptions = document.getElementById(`fileOptions-${tabCount}`);
      const renameOptions = document.querySelector(
        `#tab-content-${tabCount} .rename-options`
      );
      const fileContentTable = document.getElementById(
        `fileContent-${tabCount}`
      );
      const tableHeaders = document.getElementById(`tableHeaders-${tabCount}`);

      if (file.name === "connection_trace.txt") {
        fileOptions.classList.remove("hidden");
        renameOptions.classList.remove("hidden");
        fileContentTable.classList.remove("hidden");

        tableHeaders.innerHTML = `
          <th>Direction</th>
          <th>Date</th>
          <th>Time</th>
          <th>Category</th>
          <th>ID</th>
        `;

        fileOptions.innerHTML = `
          <label><input type="checkbox" id="filterPasswd-${tabCount}"> Show Passwd</label>
          <label><input type="checkbox" id="filterToken-${tabCount}"> Show Token</label>
          <label><input type="checkbox" id="filterQuestion-${tabCount}"> Show ?</label>
        `;

        // Show the "Show renamed" checkbox if it exists
        const toggleRenameElement = document.querySelector(
          `#tab-content-${tabCount} .toggleRename`
        );
        if (toggleRenameElement) {
          toggleRenameElement.classList.remove("hidden");
        }

        // Add event listeners for checkboxes
        document
          .getElementById(`filterPasswd-${tabCount}`)
          .addEventListener("change", () => {
            filterContent(tabContentId);
          });
        document
          .getElementById(`filterToken-${tabCount}`)
          .addEventListener("change", () => {
            filterContent(tabContentId);
          });
        document
          .getElementById(`filterQuestion-${tabCount}`)
          .addEventListener("change", () => {
            filterContent(tabContentId);
          });
      } else if (file.name === "ad_svc.trace" || file.name === "ad.trace") {
        fileOptions.classList.remove("hidden");
        renameOptions.classList.add("hidden"); // Hide rename options for ad_svc.trace and ad.trace
        fileContentTable.classList.remove("hidden");

        tableHeaders.innerHTML = `
          <th>Level</th>
          <th>Date</th>
          <th>Time</th>
          <th>Service</th>
          <th>PID</th>
          <th>TID</th>
          <th>Category</th>
          <th>Message</th>
        `;

        fileOptions.innerHTML = `
          <label><input type="checkbox" id="filterWarning-${tabCount}"> Show Warnings</label>
          <label><input type="checkbox" id="filterInfo-${tabCount}"> Show Info</label>
          <label><input type="checkbox" id="filterError-${tabCount}"> Show Errors</label>
          <label><input type="checkbox" id="filterIp-${tabCount}"> Show IP Addresses</label>
          <label><input type="checkbox" id="filterClientId-${tabCount}"> Show Client IDs</label>
          <label>Category: <input type="text" id="filterCategory-${tabCount}" placeholder="Enter category"></label>
        `;

        // Hide the "Show renamed" checkbox if it exists
        const toggleRenameElement = document.querySelector(
          `#tab-content-${tabCount} .toggleRename`
        );
        if (toggleRenameElement) {
          toggleRenameElement.classList.add("hidden");
        }

        // Add event listeners for checkboxes
        document
          .getElementById(`filterWarning-${tabCount}`)
          .addEventListener("change", () => {
            filterContent(tabContentId);
          });
        document
          .getElementById(`filterInfo-${tabCount}`)
          .addEventListener("change", () => {
            filterContent(tabContentId);
          });
        document
          .getElementById(`filterError-${tabCount}`)
          .addEventListener("change", () => {
            filterContent(tabContentId);
          });
        document
          .getElementById(`filterIp-${tabCount}`)
          .addEventListener("change", () => {
            filterContent(tabContentId);
          });
        document
          .getElementById(`filterClientId-${tabCount}`)
          .addEventListener("change", () => {
            filterContent(tabContentId);
          });
        document
          .getElementById(`filterCategory-${tabCount}`)
          .addEventListener("input", () => {
            filterContent(tabContentId);
          });
      }
    };
    reader.readAsText(file);
  }
}
