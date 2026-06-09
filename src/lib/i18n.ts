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
  skip:            { th: 'ข้ามได้เลย',                         en: 'Skip' },
  today:           { th: 'วันนี้',                              en: 'Today' },
  save:            { th: 'บันทึก',                             en: 'Save' },
  edit:            { th: 'แก้ไข',                              en: 'Edit' },
  editLast:        { th: 'แก้ไขรายการล่าสุด',                  en: 'Edit last entry' },
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
