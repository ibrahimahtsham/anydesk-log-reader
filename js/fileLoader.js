import { parseFile } from "./fileParser.js";
import { filterContent } from "./filter.js";

export function loadFile(event, tabCount, tabContentId) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileContent = e.target.result;
      const lines = fileContent.split("\n");

      const adjustedLines = parseFile(file.name, lines);

      const tbody = document.querySelector(`#fileContent-${tabCount} tbody`);
      tbody.innerHTML = adjustedLines
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

      // Store the original content for filtering and renaming
      document.getElementById(tabContentId).dataset.originalContent =
        JSON.stringify(adjustedLines);
      document.getElementById(tabContentId).dataset.renamedContent =
        JSON.stringify(adjustedLines);

      // Display file options based on file name
      const fileOptions = document.getElementById(`fileOptions-${tabCount}`);
      fileOptions.innerHTML = ""; // Clear previous options
      if (file.name === "connection_trace.txt") {
        fileOptions.innerHTML = `
                    <label><input type="checkbox" id="filterPasswd-${tabCount}"> Show Passwd</label>
                    <label><input type="checkbox" id="filterToken-${tabCount}"> Show Token</label>
                    <label><input type="checkbox" id="filterQuestion-${tabCount}"> Show ?</label>
                `;

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
      }
    };
    reader.readAsText(file);
  }
}
