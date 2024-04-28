import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge class names with tailwind css
 * @param inputs - Array of class names
 * @returns Tailwind CSS class names
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
