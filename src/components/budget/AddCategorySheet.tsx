import { useState } from 'react'
import { X } from 'lucide-react'
import { t } from '@/lib/i18n'
import type { Lang } from '@/lib/types'

interface Props {
  lang: Lang
  type: 'income' | 'expense'
  onAdd: (name: string) => void
  onClose: () => void
}

export function AddCategorySheet({ lang, type, onAdd, onClose }: Props) {
  const [name, setName] = useState('')

  function handleSave() {
    if (!name.trim()) return
    onAdd(name.trim())
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 40,
        }}
        className="anim-fade"
      />
      {/* Sheet */}
      <div
        className="anim-sheet"
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 480,
          background: 'var(--surface)',
          borderRadius: '24px 24px 0 0',
          padding: 24,
          zIndex: 50,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: 17,
            }}
          >
            {t('newCategory', lang)}
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <input
          autoFocus
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('categoryName', lang)}
          className="tj-input"
          style={{ marginBottom: 16 }}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
        />

        <button
          className="tj-btn-primary"
          style={{ width: '100%' }}
          disabled={!name.trim()}
          onClick={handleSave}
        >
          {t('save', lang)}
        </button>
      </div>
    </>
  )
}
