# Anydesk Log Reader

## Overview

Anydesk Log Reader is a web-based tool for visualizing and managing Anydesk log files. This tool allows users to load log files, filter content based on various criteria, and manage Client ID and IP data with ease. The system supports importing and exporting Client ID and IP data in JSON format, providing a user-friendly interface for assigning names and colors to each Client ID and IP address.

## Project Structure

```
anydesk-log-reader
├── css
│   └── styles.css
├── favicon.ico
├── index.html
├── js
│   ├── fileLoader.js
│   ├── fileParser.js
│   ├── filter.js
│   ├── main.js
│   └── rename.js
└── README.md
```

## Files Description

- **index.html**: The main HTML document that sets up the structure of the web application. It includes references to the CSS and JavaScript files and contains the layout for the tabs and file upload functionality.

- **css/styles.css**: Contains the styles for the application, implementing a dark mode theme. It defines the appearance of the tabs, buttons, and file upload elements.

- **js/fileLoader.js**: Manages the loading of log files, extracting unique Client IDs and IP addresses, and replacing them with their associated names and colors.

- **js/filter.js**: Handles the filtering of log content based on various criteria such as warnings, errors, IP addresses, and Client IDs.

- **js/fileParser.js**: Parses the content of the uploaded log files and adjusts the time based on user input.

- **js/main.js**: Initializes the application, manages the tabbed interface, and handles user interactions.

## Getting Started

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd anydesk-log-reader
   ```

2. **Open the `index.html` File**
   Open `index.html` in your web browser to view the application.

3. **Using the Application**
   - Add new tabs using the provided interface.
   - Upload files in each tab to enable specific functionalities.
   - Rename or remove tabs as needed.
   - Import and export Client ID and IP data in JSON format.
   - Assign names and colors to Client IDs and IP addresses.
   - Filter log content based on various criteria.

## Technologies Used

- HTML
- CSS
- JavaScript

## License

This project is licensed under the MIT License.
