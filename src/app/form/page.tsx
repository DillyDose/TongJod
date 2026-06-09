'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabase } from '@/lib/supabase/client'
import { AppShell } from '@/components/AppShell'
import { BottomNav } from '@/components/BottomNav'
import { FormShell } from '@/components/form/FormShell'
import { StepType } from '@/components/form/StepType'
import { StepAmount } from '@/components/form/StepAmount'
import { StepCategory } from '@/components/form/StepCategory'
import { StepNote } from '@/components/form/StepNote'
import { StepDate } from '@/components/form/StepDate'
import { StepConfirm } from '@/components/form/StepConfirm'
import { useCategories } from '@/hooks/useCategories'
import { useTransactions } from '@/hooks/useTransactions'
import { useLang } from '@/hooks/useLang'
import { t } from '@/lib/i18n'

interface Draft {
  type?: 'income' | 'expense'
  amount?: string
  categoryId?: string
  note?: string
  date?: string
}

const TOTAL_STEPS = 6

export default function FormPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [lang] = useLang()
  const [step, setStep] = useState(1)
  const [animDir, setAnimDir] = useState<'forward' | 'back'>('forward')
  const [draft, setDraft] = useState<Draft>({})
  const [toast, setToast] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const now = new Date()
  const { categories } = useCategories(userId)
  const { transactions, addTransaction, editTransaction } = useTransactions(
    userId,
    now.getFullYear(),
    now.getMonth() + 1,
  )

  useEffect(() => {
    getSupabase()
      .auth.getUser()
      .then(({ data }) => {
        if (!data.user) { router.push('/'); return }
        setUserId(data.user.id)
      })
  }, [router])

  function advance() { setAnimDir('forward'); setStep((s) => s + 1) }
  function goBack()  { setAnimDir('back');    setStep((s) => s - 1) }

  function prefillLast() {
    const sorted = [...transactions].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    const last = sorted[0]
    if (!last) return
    setEditId(last.id)
    setDraft({
      type: last.type,
      amount: String(last.amount),
      categoryId: last.category_id,
      note: last.note ?? '',
      date: last.date,
    })
    setAnimDir('forward')
    setStep(1)
  }

  async function handleSave() {
    if (!draft.type || !draft.amount || !draft.categoryId || !draft.date || !userId) return
    const tx = {
      user_id: userId,
      type: draft.type,
      amount: Number(draft.amount),
      category_id: draft.categoryId,
      note: draft.note ?? null,
      date: draft.date,
    }
    if (editId) {
      await editTransaction(editId, tx)
    } else {
      await addTransaction(tx)
    }
    setToast(true)
    setTimeout(() => { setToast(false); router.push('/dashboard') }, 1500)
  }

  const isDraftComplete =
    draft.type && draft.amount && draft.categoryId && draft.date

  return (
    <AppShell>
      <FormShell
        step={step}
        totalSteps={TOTAL_STEPS}
        onBack={goBack}
        animDir={animDir}
      >
        {step === 1 && (
          <>
            <StepType
              lang={lang}
              onSelect={(type) => { setDraft((d) => ({ ...d, type })); advance() }}
            />
            {transactions.length > 0 && (
              <button
                onClick={prefillLast}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  fontSize: 13,
                  textAlign: 'center',
                  display: 'block',
                  width: '100%',
                  marginTop: 24,
                  fontFamily: 'var(--font-thai)',
                }}
              >
                {t('editLast', lang)} →
              </button>
            )}
          </>
        )}

        {step === 2 && (
          <StepAmount
            lang={lang}
            initial={draft.amount}
            onNext={(amount) => { setDraft((d) => ({ ...d, amount })); advance() }}
          />
        )}

        {step === 3 && draft.type && (
          <StepCategory
            lang={lang}
            categories={categories}
            type={draft.type}
            initial={draft.categoryId}
            onNext={(categoryId) => { setDraft((d) => ({ ...d, categoryId })); advance() }}
          />
        )}

        {step === 4 && (
          <StepNote
            lang={lang}
            initial={draft.note}
            onNext={(note) => { setDraft((d) => ({ ...d, note })); advance() }}
            onSkip={() => { setDraft((d) => ({ ...d, note: '' })); advance() }}
          />
        )}

        {step === 5 && (
          <StepDate
            lang={lang}
            initial={draft.date}
            onNext={(date) => { setDraft((d) => ({ ...d, date })); advance() }}
          />
        )}

        {step === 6 && isDraftComplete && (
          <StepConfirm
            lang={lang}
            draft={draft as Required<Draft>}
            categories={categories}
            onSave={handleSave}
            onEdit={() => { setAnimDir('back'); setStep(1) }}
          />
        )}
      </FormShell>

      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: 84,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--text-primary)',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: 999,
            fontSize: 14,
            fontWeight: 600,
            fontFamily: 'var(--font-thai)',
            boxShadow: '0 8px 24px rgba(28,25,23,0.3)',
            zIndex: 60,
            whiteSpace: 'nowrap',
          }}
          className="anim-card"
        >
          {t('saved', lang)}
        </div>
      )}

      <BottomNav lang={lang} />
    </AppShell>
  )
}
