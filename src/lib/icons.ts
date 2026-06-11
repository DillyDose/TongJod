/** Material Symbols icon per category name. Covers all seeded categories
 *  (see auth/callback seeding) plus common custom names. */
const CATEGORY_ICONS: Record<string, string> = {
  // Expense
  'อาหาร': 'restaurant',
  'เดินทาง': 'directions_car',
  'ช้อปปิ้ง': 'shopping_bag',
  'ช็อปปิ้ง': 'shopping_bag',
  'บิล/ค่าใช้จ่าย': 'receipt_long',
  'สุขภาพ': 'favorite',
  'บันเทิง': 'movie',
  'กาแฟ': 'local_cafe',
  'ค่าเช่า': 'home',
  'สาธารณูปโภค': 'bolt',
  'การศึกษา': 'school',
  'ดูแลตัวเอง': 'spa',
  'อื่นๆ': 'more_horiz',
  // Income
  'เงินเดือน': 'payments',
  'ฟรีแลนซ์': 'laptop_mac',
  'โบนัส': 'redeem',
  'ลงทุน': 'trending_up',
  'ของขวัญ': 'card_giftcard',
}

export function categoryIcon(name: string): string {
  return CATEGORY_ICONS[name] ?? 'category'
}
