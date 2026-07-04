import type { Lang } from './types'

type Entry = Record<Lang, string>

const STR: Record<string, Entry> = {
  tagline:         { th: 'จดทุกบาท ใช้ชีวิตสบายใจ',          en: 'Track every baht, live at ease' },
  continueGoogle:  { th: 'เข้าสู่ระบบด้วย Google',            en: 'Continue with Google' },
  baht:            { th: 'บาท',                                en: 'THB' },
  income:          { th: 'รายรับ',                             en: 'Income' },
  expense:         { th: 'รายจ่าย',                            en: 'Expense' },
  avgPerDay:       { th: 'เฉลี่ย {n} บาท/วัน',                en: 'Avg {n} THB/day' },
  expected:        { th: 'คาดการณ์ {n}%',                     en: 'Expected {n}%' },
  actual:          { th: 'จริง {n}%',                          en: 'Actual {n}%' },
  dailyExpense:    { th: 'รายจ่ายรายวัน',                      en: 'Daily spending' },
  topCategories:   { th: 'หมวดหมู่ที่ใช้มากสุด',               en: 'Top categories' },
  noExpenseMonth:  { th: 'ยังไม่มีรายจ่ายเดือนนี้',             en: 'No expenses this month' },
  navHome:         { th: 'หน้าหลัก',                           en: 'Home' },
  navAdd:          { th: 'เพิ่ม',                              en: 'Add' },
  navBudget:       { th: 'งบประมาณ',                           en: 'Budget' },
  formType:        { th: 'วันนี้เป็น...',                       en: 'Today is a...' },
  formAmount:      { th: 'จำนวนเท่าไหร่?',                    en: 'How much?' },
  formCategory:    { th: 'หมวดหมู่ไหน?',                      en: 'Which category?' },
  formNote:        { th: 'มีอะไรเพิ่มเติมไหม?',               en: 'Anything to add?' },
  formDate:        { th: 'วันที่?',                            en: 'Which date?' },
  formConfirm:     { th: 'ตรวจสอบอีกครั้ง',                   en: 'Review once more' },
  continue:        { th: 'ต่อไป',                              en: 'Continue' },
  today:           { th: 'วันนี้',                              en: 'Today' },
  save:            { th: 'บันทึก',                             en: 'Save' },
  edit:            { th: 'แก้ไข',                              en: 'Edit' },
  editLast:        { th: 'แก้ไขรายการล่าสุด',                  en: 'Edit last entry' },
  cancelEdit:      { th: 'ยกเลิกการแก้ไข',                     en: 'Cancel editing' },
  saved:           { th: 'บันทึกแล้ว!',                        en: 'Saved!' },
  budgetTitle:     { th: 'ตั้งงบประมาณ',                       en: 'Set budget' },
  totalBudget:     { th: 'งบรวม',                              en: 'Total budget' },
  notSet:          { th: 'ยังไม่ได้ตั้ง',                       en: 'Not set' },
  addCategory:     { th: 'เพิ่มหมวดหมู่',                      en: 'Add category' },
  newCategory:     { th: 'เพิ่มหมวดหมู่ใหม่',                  en: 'New category' },
  categoryName:    { th: 'ชื่อหมวดหมู่',                       en: 'Category name' },
  notePlaceholder: { th: 'เช่น ข้าวกลางวันกับเพื่อน',           en: 'e.g. lunch with friends' },
  fType:           { th: 'ประเภท',                             en: 'Type' },
  fAmount:         { th: 'จำนวน',                              en: 'Amount' },
  fCategory:       { th: 'หมวดหมู่',                           en: 'Category' },
  fNote:           { th: 'โน้ต',                               en: 'Note' },
  fDate:           { th: 'วันที่',                              en: 'Date' },
  noNote:          { th: '—',                                  en: '—' },
  // Form steps
  chooseType:      { th: 'เลือกประเภท',                        en: 'Choose a type' },
  typeSubtitle:    { th: 'รายรับหรือรายจ่าย?',                 en: 'Income or expense?' },
  enterAmount:     { th: 'ใส่จำนวนเงิน',                       en: 'Enter the amount' },
  quickAdd:        { th: 'รายการด่วน',                         en: 'Quick add' },
  clear:           { th: 'ล้างค่า',                            en: 'Clear' },
  chooseCategory:  { th: 'เลือกหมวดหมู่',                      en: 'Choose a category' },
  expenseQ:        { th: 'รายจ่ายวันนี้เป็นอะไร?',             en: 'What did you spend on?' },
  incomeQ:         { th: 'รับเงินจากที่ไหน?',                  en: 'Where did it come from?' },
  detailsTitle:    { th: 'รายละเอียดเพิ่มเติม',                 en: 'Extra details' },
  detailsHint:     { th: 'หมายเหตุ (ไม่บังคับ) และวันที่',       en: 'Note (optional) and date' },
  yesterday:       { th: 'เมื่อวาน',                            en: 'Yesterday' },
  confirmTitle:    { th: 'ยืนยันรายการ',                       en: 'Confirm entry' },
  saving:          { th: 'กำลังบันทึก...',                     en: 'Saving...' },
  saveFailed:      { th: 'บันทึกไม่สำเร็จ ลองอีกครั้งนะ',       en: 'Save failed — please try again' },
  savedTitle:      { th: 'บันทึกสำเร็จ!',                      en: 'Saved!' },
  savedSub:        { th: 'รายการของคุณถูกบันทึกเรียบร้อยแล้ว',   en: 'Your entry has been saved' },
  goHome:          { th: 'กลับไปหน้าหลัก',                     en: 'Back to home' },
  addAnother:      { th: 'บันทึกอีกรายการ',                    en: 'Add another entry' },
  // Dashboard
  balance:         { th: 'คงเหลือเดือนนี้',                     en: 'Balance this month' },
  recent:          { th: 'รายการล่าสุด',                        en: 'Recent entries' },
  noRecent:        { th: 'ยังไม่มีรายการเดือนนี้',              en: 'No entries this month' },
  usedBudget:      { th: 'ใช้งบไปแล้ว',                        en: 'Budget used' },
  leftToSpend:     { th: 'เหลือใช้',                            en: 'Left to spend' },
  overBy:          { th: 'เกินงบ ฿{n}',                        en: 'Over by ฿{n}' },
  noBudgetSet:     { th: 'ไม่มีงบประมาณ',                      en: 'No budget set' },
  viewAll:         { th: 'ดูทั้งหมด',                           en: 'View all' },
  logout:          { th: 'ออกจากระบบ',                         en: 'Log out' },
  // Budget page
  totalThisMonth:    { th: 'งบทั้งหมดเดือนนี้',                 en: 'Total budget this month' },
  totalBudgetMonth:  { th: 'งบทั้งหมดเดือน{m}',                 en: 'Total budget · {m}' },
  spent:           { th: 'ใช้ไป',                              en: 'Spent' },
  // Undo snackbar
  undo:            { th: 'เลิกทำ',                              en: 'Undo' },
  categoryDeleted: { th: 'ลบหมวดหมู่แล้ว',                     en: 'Category deleted' },
  entryDeleted:    { th: 'ลบรายการแล้ว',                       en: 'Entry deleted' },
}

export function t(key: string, lang: Lang, vars?: Record<string, string | number>): string {
  const entry = STR[key]
  let s = entry ? entry[lang] : key
  if (vars) {
    Object.entries(vars).forEach(([k, v]) => {
      s = s.replace(`{${k}}`, String(v))
    })
  }
  return s
}
