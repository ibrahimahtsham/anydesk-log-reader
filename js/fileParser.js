export function parseFile(fileName, lines, timeAdjustment) {
  if (fileName === "connection_trace.txt") {
    return parseConnectionTrace(lines, timeAdjustment);
  } else if (fileName === "ad_svc.trace" || fileName === "ad.trace") {
    return parseAdTrace(lines, timeAdjustment);
  }
}

function parseConnectionTrace(lines, timeAdjustment) {
  return lines.map((line) => {
    const parts = line.split(/\s+/);
    const dateTime = parts[1] + " " + parts[2];
    const category = parts[3];
    const id = parts[4]; // Use only the first part of the ID

    const date = new Date(dateTime);
    date.setHours(date.getHours() + timeAdjustment);

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? "PM" : "AM";
    const adjustedHours = hours % 12 || 12;
    const adjustedMinutes = minutes < 10 ? "0" + minutes : minutes;
    const adjustedSeconds = seconds < 10 ? "0" + seconds : seconds;
    const adjustedTime = `${adjustedHours}:${adjustedMinutes}:${adjustedSeconds} ${ampm}`;

    return {
      direction: parts[0],
      date: date.toISOString().split("T")[0],
      time: adjustedTime,
      category: category,
      id: id,
    };
  });
}

function parseAdTrace(lines, timeAdjustment) {
  return lines
    .map((line) => {
      const parts = line.match(
        /(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(.+)/
      );
      if (!parts) return null;

      const dateTime = parts[2] + " " + parts[3];
      const date = new Date(dateTime);
      date.setHours(date.getHours() + timeAdjustment);

      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      const ampm = hours >= 12 ? "PM" : "AM";
      const adjustedHours = hours % 12 || 12;
      const adjustedMinutes = minutes < 10 ? "0" + minutes : minutes;
      const adjustedSeconds = seconds < 10 ? "0" + seconds : seconds;
      const adjustedTime = `${adjustedHours}:${adjustedMinutes}:${adjustedSeconds} ${ampm}`;

      return {
        level: parts[1],
        date: date.toISOString().split("T")[0],
        time: adjustedTime,
        service: parts[4],
        pid: parts[5],
        tid: parts[6],
        category: parts[7],
        message: parts[8],
      };
    })
    .filter((line) => line !== null);
}
