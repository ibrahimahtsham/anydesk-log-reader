export function parseFile(fileName, lines) {
  if (fileName === "connection_trace.txt") {
    return parseConnectionTrace(lines);
  } else if (fileName === "ad_svc.trace" || fileName === "ad.trace") {
    return parseAdTrace(lines);
  }
}

function parseConnectionTrace(lines) {
  return lines.map((line) => {
    const parts = line.split(/\s+/);
    const dateTime = parts[1] + " " + parts[2];
    const category = parts[3];
    const id = parts[4]; // Use only the first part of the ID

    const date = new Date(dateTime);
    date.setHours(date.getHours() + 5);

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const adjustedHours = hours % 12 || 12;
    const adjustedMinutes = minutes < 10 ? "0" + minutes : minutes;
    const adjustedTime = `${adjustedHours}:${adjustedMinutes} ${ampm}`;

    return {
      direction: parts[0],
      date: date.toISOString().split("T")[0],
      time: adjustedTime,
      category: category,
      id: id,
    };
  });
}

function parseAdTrace(lines) {
  return lines.map((line) => {
    const parts = line.split(/\s+/);
    return {
      direction: parts[0],
      date: parts[1],
      time: parts[2],
      category: parts[3],
      id: parts[4],
    };
  });
}
