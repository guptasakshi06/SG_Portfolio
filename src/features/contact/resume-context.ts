import { createContext, useContext } from 'react'
import type { ResumeStatus } from './actions'

export const ResumeContext = createContext<ResumeStatus>('checking')
export function useResumeStatus() { return useContext(ResumeContext) }
