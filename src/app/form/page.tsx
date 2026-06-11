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
import { StepSuccess } from '@/components/form/StepSuccess'
import { useCategories } from '@/hooks/useCategories'
import { useLang } from '@/hooks/useLang'
import { t } from '@/lib/i18n'
import {
  insertTransaction,
  updateTransaction,
  fetchLatestTransaction,
  fetchTransactionById,
} from '@/lib/db'
import { todayISO } from '@/lib/dates'
import type { Transaction } from '@/lib/types'

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
  // Expense is by far the most common entry, so the form starts on the
  // amount step with type preset — step 1 (type) is reachable via back
  const [step, setStep] = useState(2)
  const [animDir, setAnimDir] = useState<'forward' | 'back'>('forward')
  const [draft, setDraft] = useState<Draft>({ type: 'expense' })
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [latestTx, setLatestTx] = useState<Transaction | null>(null)

  const { categories } = useCategories(userId)

  useEffect(() => {
    void (async () => {
      const { data: { user } } = await getSupabase().auth.getUser()
      if (!user) { router.push('/'); return }
      setUserId(user.id)
    })()
  }, [router])

  useEffect(() => {
    if (!userId) return
    fetchLatestTransaction(userId).then(setLatestTx).catch(() => {})
  }, [userId])

  // Opened from the dashboard history list: /form?edit=<id>
  useEffect(() => {
    if (!userId) return
    const editParam = new URLSearchParams(window.location.search).get('edit')
    if (!editParam) return
    fetchTransactionById(editParam)
      .then((tx) => {
        if (!tx || tx.user_id !== userId) return
        prefillFrom(tx)
      })
      .catch(() => {})
  }, [userId]) // eslint-disable-line react-hooks/exhaustive-deps

  function advance() { setAnimDir('forward'); setStep((s) => s + 1) }
  function goBack()  { setAnimDir('back');    setStep((s) => s - 1) }

  function prefillFrom(tx: Transaction) {
    setEditId(tx.id)
    setDraft({
      type: tx.type,
      amount: String(tx.amount),
      categoryId: tx.category_id,
      note: tx.note ?? '',
      date: tx.date,
    })
    setAnimDir('forward')
    setStep(6) // jump straight to confirm; "แก้ไข" walks the steps
  }

  async function handleSave() {
    if (saving) return
    if (!draft.type || !draft.amount || !draft.categoryId || !draft.date || !userId) return
    const note = draft.note?.trim()
    const tx = {
      user_id: userId,
      type: draft.type,
      amount: Number(draft.amount),
      category_id: draft.categoryId,
      note: note ? note : null,
      date: draft.date,
    }
    setSaving(true)
    setSaveError(false)
    try {
      if (editId) {
        await updateTransaction(editId, tx)
      } else {
        const created = await insertTransaction(tx)
        setLatestTx(created)
      }
      setSaved(true)
    } catch {
      setSaveError(true)
    } finally {
      setSaving(false)
    }
  }

  function handleAddAnother() {
    window.history.replaceState(null, '', '/form')
    setDraft({ type: 'expense' })
    setEditId(null)
    setSaved(false)
    setSaveError(false)
    setAnimDir('forward')
    setStep(2)
  }

  const isDraftComplete =
    draft.type && draft.amount && draft.categoryId && draft.date

  const typeChipColor = draft.type === 'income'
    ? { bg: '#DCFCE7', text: '#15803D' }
    : { bg: '#FEE2E2', text: '#DC2626' }

  return (
    <AppShell nav={<BottomNav lang={lang} />}>
      <FormShell
        step={step}
        totalSteps={TOTAL_STEPS}
        onBack={goBack}
        animDir={animDir}

      >
        {step === 1 && (
          <StepType
            lang={lang}
            onSelect={(type) => {
              setDraft((d) => ({
                ...d,
                type,
                // category list depends on type — drop a stale selection
                categoryId: d.type === type ? d.categoryId : undefined,
              }))
              advance()
            }}
          />
        )}

        {step === 2 && (
          <>
            {/* Current type chip — tap to change (goes back to step 1) */}
            <button
              onClick={() => { setAnimDir('back'); setStep(1) }}
              style={{
                alignSelf: 'center',
                background: typeChipColor.bg,
                color: typeChipColor.text,
                border: 'none',
                borderRadius: 9999,
                padding: '6px 16px',
                fontSize: 13,
                fontWeight: 700,
                fontFamily: 'var(--font-thai)',
                cursor: 'pointer',
                marginBottom: 16,
              }}
            >
              {draft.type === 'income' ? t('income', lang) : t('expense', lang)} ▾
            </button>

            <StepAmount
              lang={lang}
              initial={draft.amount}
              onChange={(amount) => setDraft((d) => ({ ...d, amount }))}
              onNext={(amount) => { setDraft((d) => ({ ...d, amount })); advance() }}
            />

            {!editId && latestTx && (
              <button
                onClick={() => prefillFrom(latestTx)}
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
            onChange={(note) => setDraft((d) => ({ ...d, note }))}
            onNext={(note) => { setDraft((d) => ({ ...d, note })); advance() }}
            onSkip={() => { setDraft((d) => ({ ...d, note: '' })); advance() }}
          />
        )}

        {step === 5 && (
          <StepDate
            lang={lang}
            initial={draft.date}
            onChange={(date) => setDraft((d) => ({ ...d, date }))}
            onNext={(date) => { setDraft((d) => ({ ...d, date })); advance() }}
          />
        )}

        {step === 6 && isDraftComplete && (
          <StepConfirm
            lang={lang}
            draft={draft as Required<Draft>}
            categories={categories}
            saving={saving}
            error={saveError}
            onSave={handleSave}
            onEdit={() => { setAnimDir('back'); setStep(1) }}
          />
        )}
      </FormShell>

      {saved && draft.type && draft.amount && draft.categoryId && (
        <StepSuccess
          lang={lang}
          amount={draft.amount}
          type={draft.type}
          categoryId={draft.categoryId}
          categories={categories}
          onHome={() => router.push('/dashboard')}
          onAgain={handleAddAnother}
        />
      )}
    </AppShell>
  )
}
