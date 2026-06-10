import { fmt } from '@/lib/theme'
import type { Category } from '@/lib/types'

interface Draft {
  type: 'income' | 'expense'
  amount: string
  categoryId: string
  note: string
  date: string
}

interface Props {
  draft: Draft
  categories: Category[]
  onSave: () => void
  onEdit: () => void
}

function ConfirmRow({ label, children, borderBottom }: { label: string; children: React.ReactNode; borderBottom?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: borderBottom ? '1px solid var(--border)' : 'none' }}>
      <span style={{ color: 'var(--text-muted)', fontSize: 13, fontFamily: 'var(--font-thai)' }}>{label}</span>
      {children}
    </div>
  )
}

export function StepConfirm({ draft, categories, onSave, onEdit }: Props) {
  const cat = categories.find((c) => c.id === draft.categoryId)
  const typeColor = draft.type === 'income' ? '#22C55E' : '#EF4444'
  const typeLabel = draft.type === 'income' ? 'รายรับ' : 'รายจ่าย'

  return (
    <div>
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 28,
          marginBottom: 24,
          textAlign: 'center',
        }}
      >
        ยืนยันรายการ
      </h2>

      <div className="tj-card" style={{ marginBottom: 24 }}>
        {/* Type row */}
        <ConfirmRow label="ประเภท" borderBottom>
          <span style={{ fontWeight: 700, fontSize: 14, color: typeColor, fontFamily: 'var(--font-thai)' }}>
            {typeLabel}
          </span>
        </ConfirmRow>

        {/* Amount row */}
        <ConfirmRow label="จำนวน" borderBottom>
          <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
            ฿{fmt(Number(draft.amount))}
          </span>
        </ConfirmRow>

        {/* Category row */}
        <ConfirmRow label="หมวดหมู่" borderBottom>
          <span style={{ fontWeight: 500, fontSize: 14, fontFamily: 'var(--font-thai)' }}>
            {cat?.name ?? '—'}
          </span>
        </ConfirmRow>

        {/* Note row */}
        <ConfirmRow label="โน้ต" borderBottom>
          <span style={{ fontWeight: 400, fontSize: 14, color: draft.note ? 'var(--text-primary)' : 'var(--text-muted)', fontFamily: 'var(--font-thai)' }}>
            {draft.note || '—'}
          </span>
        </ConfirmRow>

        {/* Date row — no bottom border */}
        <ConfirmRow label="วันที่">
          <span style={{ fontWeight: 500, fontSize: 14, fontFamily: 'var(--font-display)' }}>
            {draft.date}
          </span>
        </ConfirmRow>
      </div>

      <button
        className="tj-btn-primary"
        style={{ width: '100%', marginBottom: 12 }}
        onClick={onSave}
      >
        บันทึก
      </button>

      <button className="tj-btn-ghost" style={{ width: '100%' }} onClick={onEdit}>
        แก้ไข
      </button>
    </div>
  )
}
