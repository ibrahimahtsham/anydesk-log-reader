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

      // Extract unique Client IDs and IP addresses
      const uniqueClientIds = new Set();
      const uniqueIpAddresses = new Set();
      adjustedLines.forEach((line) => {
        if (line.message) {
          const clientIdMatch = line.message.match(/Client-ID: (\d+)/);
          if (clientIdMatch) {
            uniqueClientIds.add(clientIdMatch[1]);
          }
          const ipMatch = line.message.match(
            /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/
          );
          if (ipMatch) {
            uniqueIpAddresses.add(ipMatch[0]);
          }
        }
      });

      // Store the unique IDs and IPs in the tab content
      tabContent.dataset.uniqueClientIds = JSON.stringify([...uniqueClientIds]);
      tabContent.dataset.uniqueIpAddresses = JSON.stringify([
        ...uniqueIpAddresses,
      ]);

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
          <label>ID Filter: <input type="text" id="idFilter-${tabCount}" placeholder="Enter ID"></label>
        `;

        // Show the "Show renamed" checkbox if it exists
        const toggleRenameElement = document.querySelector(
          `#tab-content-${tabCount} .toggleRename`
        );
        if (toggleRenameElement) {
          toggleRenameElement.classList.remove("hidden");
        }

        // Add event listeners for checkboxes and input fields
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
        document
          .getElementById(`idFilter-${tabCount}`)
          .addEventListener("input", () => {
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
          <label>IP Filter: <input type="text" id="ipFilter-${tabCount}" placeholder="Enter IP address"></label>
          <label>Client ID Filter: <input type="text" id="clientIdFilter-${tabCount}" placeholder="Enter Client ID"></label>
          <button id="showUniqueData-${tabCount}">Show Unique Data</button>
        `;

        // Hide the "Show renamed" checkbox if it exists
        const toggleRenameElement = document.querySelector(
          `#tab-content-${tabCount} .toggleRename`
        );
        if (toggleRenameElement) {
          toggleRenameElement.classList.add("hidden");
        }

        // Add event listeners for checkboxes and input fields
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
          .getElementById(`ipFilter-${tabCount}`)
          .addEventListener("input", () => {
            filterContent(tabContentId);
          });
        document
          .getElementById(`clientIdFilter-${tabCount}`)
          .addEventListener("input", () => {
            filterContent(tabContentId);
          });

        // Add event listener for the "Show Unique Data" button
        document
          .getElementById(`showUniqueData-${tabCount}`)
          .addEventListener("click", () => {
            showUniqueDataModal(tabContentId);
          });
      }
    };
    reader.readAsText(file);
  }
}

function showUniqueDataModal(tabContentId) {
  const tabContent = document.getElementById(tabContentId);
  const uniqueClientIds = JSON.parse(tabContent.dataset.uniqueClientIds);
  const uniqueIpAddresses = JSON.parse(tabContent.dataset.uniqueIpAddresses);

  const modalContent = document.querySelector(
    "#uniqueDataModal .modal-content"
  );
  modalContent.innerHTML = `
    <span class="close">&times;</span>
    <h2>Unique Client IDs and IP Addresses</h2>
    <h3>Client IDs</h3>
    <ul>
      ${uniqueClientIds.map((id) => `<li>${id}</li>`).join("")}
    </ul>
    <h3>IP Addresses</h3>
    <ul>
      ${uniqueIpAddresses.map((ip) => `<li>${ip}</li>`).join("")}
    </ul>
  `;

  const modal = document.getElementById("uniqueDataModal");
  modal.style.display = "block";

  const closeModal = document.querySelector("#uniqueDataModal .close");
  closeModal.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}
