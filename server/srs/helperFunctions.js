function getNewDueDate(interval) {
  const date = new Date();

  if (interval >= 1) {
    date.setDate(date.getDate + Math.ceil(interval));
  } else {
    date.setHours(date.getHours + interval * 24);
  }

  return date;
}

function updateMastery(oldMastery) {
  const newMastery = oldMastery;

  return newMastery;
}

export { getNewDueDate, updateMastery };
