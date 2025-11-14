import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return "N/A"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "N/A"
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))
}

export function calculateDaysUntilExpiry(expiryDate: Date | null | undefined): number | null {
  if (!expiryDate) return null
  const now = new Date()
  const diff = new Date(expiryDate).getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function isExpired(endDate: Date | null | undefined): boolean {
  if (!endDate) return false
  return new Date(endDate) < new Date()
}
