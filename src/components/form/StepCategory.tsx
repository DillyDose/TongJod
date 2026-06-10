import type { Lang, Category } from '@/lib/types'

interface Props {
  lang: Lang
  categories: Category[]
  type: 'income' | 'expense'
  initial?: string
  onNext: (catId: string) => void
}

const ICON_MAP: Record<string, string> = {
  // Expense categories (Thai names)
  'อาหาร': 'restaurant',
  'เดินทาง': 'directions_car',
  'ช็อปปิ้ง': 'shopping_bag',
  'บันเทิง': 'movie',
  'สุขภาพ': 'favorite',
  'ค่าเช่า': 'home',
  'สาธารณูปโภค': 'bolt',
  'การศึกษา': 'school',
  'ดูแลตัวเอง': 'spa',
  'อื่นๆ': 'more_horiz',
  // Income categories (Thai names)
  'เงินเดือน': 'payments',
  'ฟรีแลนซ์': 'laptop_mac',
  'ลงทุน': 'trending_up',
  'ของขวัญ': 'card_giftcard',
}

function getIcon(name: string): string {
  return ICON_MAP[name] ?? 'category'
}

export function StepCategory({ lang: _lang, categories, type, initial, onNext }: Props) {
  const filtered = categories
    .filter((c) => c.type === type)
    .sort((a, b) => b.usage_count - a.usage_count)

  return (
    <div>
      <h1
        style={{
          fontSize: 28,
          fontWeight: 700,
          fontFamily: 'var(--font-display)',
          textAlign: 'center',
          marginBottom: 8,
        }}
      >
        เลือกหมวดหมู่
      </h1>
      <p
        style={{
          fontSize: 14,
          color: 'var(--text-secondary)',
          textAlign: 'center',
          marginBottom: 24,
          marginTop: 0,
        }}
      >
        {type === 'expense' ? 'รายจ่ายวันนี้เป็นอะไร?' : 'รับเงินจากที่ไหน?'}
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 10,
        }}
      >
        {filtered.map((cat) => {
          const selected = cat.id === initial
          const icon = getIcon(cat.name)
          return (
            <button
              key={cat.id}
              onClick={() => onNext(cat.id)}
              style={{
                borderRadius: 20,
                padding: '16px 8px',
                background: selected ? '#58CC02' : '#F7F7F7',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                boxShadow: selected ? '0 4px 0 0 #58A700' : '0 2px 0 0 #E5E5E5',
                transition: 'transform 120ms ease-out, box-shadow 120ms',
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translateY(2px)'
                e.currentTarget.style.boxShadow = selected ? '0 2px 0 0 #58A700' : '0 1px 0 0 #E5E5E5'
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.boxShadow = selected ? '0 4px 0 0 #58A700' : '0 2px 0 0 #E5E5E5'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.boxShadow = selected ? '0 4px 0 0 #58A700' : '0 2px 0 0 #E5E5E5'
              }}
            >
              {/* Icon circle */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 9999,
                  background: selected ? 'rgba(255,255,255,0.25)' : '#E8E8E8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: 22,
                    color: selected ? '#fff' : '#555',
                    userSelect: 'none',
                  }}
                >
                  {icon}
                </span>
              </div>
              {/* Label */}
              <span
                style={{
                  fontFamily: 'var(--font-thai)',
                  fontSize: 12,
                  fontWeight: 600,
                  color: selected ? '#fff' : 'var(--text-primary)',
                  textAlign: 'center',
                  lineHeight: 1.3,
                }}
              >
                {cat.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
