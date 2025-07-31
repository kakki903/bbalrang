/**
 * 만 나이 계산 함수
 * @param {Date|string} birthDate 생년월일 (Date 객체 또는 "YYYY-MM-DD" 문자열)
 * @returns {number} 만 나이
 */
function calculateAge(birthDate) {
  const today = new Date();
  const birth = birthDate instanceof Date ? birthDate : new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

module.exports = {
  calculateAge,
};
