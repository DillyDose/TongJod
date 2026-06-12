'use client'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSupabase } from '@/lib/supabase/client'
import { AppShell } from '@/components/AppShell'
import { BottomNav } from '@/components/BottomNav'
import { FormShell } from '@/components/form/FormShell'
import { StepType } from '@/components/form/StepType'
import { StepAmount } from '@/components/form/StepAmount'
import { StepCategory } from '@/components/form/StepCategory'
import { StepDetails } from '@/components/form/StepDetails'
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
  fetchRecentTransactions,
} from '@/lib/db'
import { todayISO } from '@/lib/dates'
import { frequentTemplates, type Template } from '@/lib/suggest'
import { categoryIcon } from '@/lib/icons'
import { fmt } from '@/lib/theme'
import type { Transaction } from '@/lib/types'

interface Draft {
  type?: 'income' | 'expense'
  amount?: string
  categoryId?: string
  note?: string
  date?: string
}

const TOTAL_STEPS = 5

function FormPageContent() {
  const router = useRouter()
  // The edit state must follow the URL: tapping the "+" tab while editing
  // navigates to /form without ?edit, which has to become a fresh entry
  const editParam = useSearchParams().get('edit')
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
  const [recentTx, setRecentTx] = useState<Transaction[]>([])

  const { categories } = useCategories(userId)

  const templates = useMemo(
    () => frequentTemplates(recentTx, categories),
    [recentTx, categories],
  )

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
    fetchRecentTransactions(userId).then(setRecentTx).catch(() => {})
  }, [userId])

  // Opened from the dashboard history list: /form?edit=<id>
  useEffect(() => {
    if (!userId) return
    if (editParam) {
      if (editParam === editId) return // already prefilled
      let stale = false
      fetchTransactionById(editParam)
        .then((tx) => {
          if (stale || !tx || tx.user_id !== userId) return
          prefillFrom(tx)
        })
        .catch(() => {})
      return () => { stale = true }
    }
    // No ?edit in the URL: if we were editing, the user navigated to a
    // fresh form (e.g. the "+" tab) — drop the edit state or the next save
    // would overwrite the old transaction
    if (editId) resetToNewEntry()
  }, [userId, editParam, editId]) // eslint-disable-line react-hooks/exhaustive-deps

  function advance() { setAnimDir('forward'); setStep((s) => s + 1) }
  function goBack()  { setAnimDir('back');    setStep((s) => s - 1) }

  function prefillFrom(tx: Transaction) {
    // Keep the URL in sync so navigation can tell edit mode from new-entry
    window.history.replaceState(null, '', `/form?edit=${tx.id}`)
    setEditId(tx.id)
    setDraft({
      type: tx.type,
      amount: String(tx.amount),
      categoryId: tx.category_id,
      note: tx.note ?? '',
      date: tx.date,
    })
    setAnimDir('forward')
    setStep(5) // jump straight to confirm; the back arrow walks the steps
  }

  function resetToNewEntry() {
    setDraft({ type: 'expense' })
    setEditId(null)
    setSaved(false)
    setSaveError(false)
    setAnimDir('forward')
    setStep(2)
  }

  async function handleSave() {
    if (saving) return
    if (!draft.type || !draft.amount || !draft.categoryId || !draft.date || !userId) return
    const note = draft.note?.trim()
    const payload = {
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
        await updateTransaction(editId, payload)
        // keep the "edit last entry" shortcut in sync with what was just saved
        setLatestTx((prev) => (prev && prev.id === editId ? { ...prev, ...payload } : prev))
      } else {
        const created = await insertTransaction({ user_id: userId, ...payload })
        setLatestTx(created)
      }
      setSaved(true)
    } catch {
      setSaveError(true)
    } finally {
      setSaving(false)
    }
  }

  function applyTemplate(tpl: Template) {
    setDraft({
      type: 'expense',
      amount: String(tpl.amount),
      categoryId: tpl.categoryId,
      note: '',
      date: todayISO(),
    })
    setAnimDir('forward')
    setStep(5) // straight to confirm — the user reviews, then saves
  }

  function handleAddAnother() {
    window.history.replaceState(null, '', '/form')
    resetToNewEntry()
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

            {/* One-tap repeat entries from frequent (category, amount) pairs */}
            {!editId && draft.type === 'expense' && templates.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-thai)',
                    marginBottom: 8,
                  }}
                >
                  {t('quickAdd', lang)}
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {templates.map((tpl) => {
                    const cat = categories.find((c) => c.id === tpl.categoryId)
                    if (!cat) return null
                    return (
                      <button
                        key={`${tpl.categoryId}-${tpl.amount}`}
                        onClick={() => applyTemplate(tpl)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          background: 'white',
                          border: '1.5px solid #E5E5E5',
                          borderRadius: 9999,
                          padding: '8px 14px',
                          cursor: 'pointer',
                          boxShadow: '0 2px 0 0 #E5E5E5',
                          fontFamily: 'var(--font-thai)',
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: 18, color: '#555' }}
                        >
                          {categoryIcon(cat.name)}
                        </span>
                        <span>{cat.name}</span>
                        <span style={{ fontWeight: 800 }}>฿{fmt(tpl.amount)}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

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
            recentTx={recentTx}
            onNext={(categoryId) => { setDraft((d) => ({ ...d, categoryId })); advance() }}
          />
        )}

        {step === 4 && (
          <StepDetails
            lang={lang}
            initialNote={draft.note}
            initialDate={draft.date}
            onChange={(note, date) => setDraft((d) => ({ ...d, note, date }))}
            onNext={(note, date) => { setDraft((d) => ({ ...d, note, date })); advance() }}
          />
        )}

        {step === 5 && isDraftComplete && (
          <StepConfirm
            lang={lang}
            draft={draft as Required<Draft>}
            categories={categories}
            saving={saving}
            error={saveError}
            onSave={handleSave}
            onEdit={editId ? undefined : () => { setAnimDir('back'); setStep(1) }}
            onCancel={editId ? () => router.push('/dashboard') : undefined}
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

// useSearchParams() requires a Suspense boundary for prerendering
export default function FormPage() {
  return (
    <Suspense fallback={null}>
      <FormPageContent />
    </Suspense>
  )
}
