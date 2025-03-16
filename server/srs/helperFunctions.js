function getNewDueDate(date, interval) {
  if (date == null) {
    date = Date.now();
  }
  const dateToAdd = interval * 24;
  date = date + interval;
}
