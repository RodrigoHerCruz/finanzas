import { useEffect, useState } from 'react'
import { api } from '../api'
export function SettingsPage({ onError }: { onError: (message: string) => void }) {
  const [status, setStatus] = useState('Comprobando conexión…')
  useEffect(() => {
    api
      .health()
      .then(() => setStatus('API y MySQL conectados correctamente.'))
      .catch((error: Error) => {
        setStatus('Sin conexión al API.')
        onError(error.message)
      })
  }, [onError])
  return (
    <article className="panel settings-panel">
      <h2>Conexión de la aplicación</h2>
      <p>{status}</p>
      <p>
        Configura las credenciales de MySQL en <code>backend/.env</code>, tomando como base{' '}
        <code>backend/.env.example</code>.
      </p>
    </article>
  )
}
