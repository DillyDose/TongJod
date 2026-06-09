'use client'
import { useState, useEffect } from 'react'
import { fetchCategories, insertCategory, softDeleteCategory } from '@/lib/db'
import type { Category } from '@/lib/types'

export function useCategories(userId: string | null) {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    if (!userId) return
    fetchCategories(userId).then(setCategories)
  }, [userId])

  async function addCategory(name: string, type: 'income' | 'expense') {
    if (!userId) return
    const cat = await insertCategory(userId, name, type)
    setCategories((prev) => [...prev, cat])
  }

  async function deleteCategory(id: string) {
    await softDeleteCategory(id)
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }

  return { categories, addCategory, deleteCategory }
}
