// src/utils/is-late-by-datetime.ts
function isLateByDatetime(limitDate, limitTime) {
  const currentDateTime = /* @__PURE__ */ new Date();
  currentDateTime.setHours(currentDateTime.getHours() - 3);
  let [year, month, day] = limitDate.split("-").map(Number);
  let [hours, minutes, seconds] = limitTime.split(":").map(Number);
  const limitDateTime = new Date(year, month - 1, day, hours - 3, minutes, seconds);
  if (currentDateTime <= limitDateTime) {
    return false;
  }
  return true;
}

export {
  isLateByDatetime
};
