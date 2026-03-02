import moment from "moment";

export const formatTime = (date) => {
  const now = moment();
  const messageDate = moment(date);
  if (now.isSame(messageDate, "day")) return messageDate.format("HH:mm");
  else if (now.subtract(1, "day").isSame(messageDate, "day")) return "Yesterday";
  else if (now.isSame(messageDate, "week")) return messageDate.format("dddd");
  else return messageDate.format("DD/MM/YY");
};

export const formatLastSeen = (date) => {
  if (!date) return "";
  const now = moment();
  const lastSeen = moment(date);
  if (now.diff(lastSeen, "minutes") < 1) return "just now";
  else if (now.diff(lastSeen, "hours") < 1) return `${now.diff(lastSeen, "minutes")}m ago`;
  else if (now.diff(lastSeen, "hours") < 24) return `${now.diff(lastSeen, "hours")}h ago`;
  else return lastSeen.format("DD/MM/YY HH:mm");
};

export const getInitials = (name) => {
  if (!name) return "?";
  return name.split(" ").map((word) => word[0]).join("").toUpperCase().slice(0, 2);
};

export const truncateText = (text, maxLength = 30) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};
