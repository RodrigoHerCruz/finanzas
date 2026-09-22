import type { FormEvent, ReactNode } from 'react'
export function FormCard({
  title,
  onSubmit,
  children,
}: {
  title: string
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  children: ReactNode
}) {
  return (
    <form className="panel form-card" onSubmit={onSubmit}>
      <h2>{title}</h2>
      {children}
    </form>
  )
}
