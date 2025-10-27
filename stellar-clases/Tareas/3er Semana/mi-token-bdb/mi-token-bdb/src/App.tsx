// ========================================
// IMPORTS - Librerías que necesitamos
// ========================================

// React hooks para manejar estado
import { useState } from 'react'

// Freighter API para conectar la wallet
import { isConnected, getPublicKey } from '@stellar/freighter-api'

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

function App() {
  // ========================================
  // ESTADO - Variables que React va a "vigilar"
  // ========================================
  
  // Public key del usuario (su dirección Stellar)
  const [publicKey, setPublicKey] = useState<string>('')
  
  // Si la wallet está conectada o no
  const [connected, setConnected] = useState<boolean>(false)

  // ========================================
  // FUNCIÓN: Conectar Wallet
  // ========================================
  
  const connectWallet = async () => {
    try {
      // 1. Verificar si Freighter está instalado
      if (await isConnected()) {
        // 2. Pedir la public key del usuario
        const pk = await getPublicKey()
        
        // 3. Guardar en el estado
        setPublicKey(pk)
        setConnected(true)
        
        // 4. Log para debugging (ver en consola F12)
        console.log('Wallet conectada:', pk)
      } else {
        // Si Freighter no está instalado, mostrar alerta
        alert('Por favor instalá Freighter wallet desde https://freighter.app')
      }
    } catch (error) {
      // Si algo sale mal, mostrar el error
      console.error('Error conectando wallet:', error)
      alert('Error al conectar. Asegurate de que Freighter esté instalado y desbloqueado.')
    }
  }

  // ========================================
  // INTERFAZ - Lo que el usuario ve
  // ========================================
  
  return (
    <div style={{ 
      padding: '40px', 
      maxWidth: '600px', 
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Título principal */}
      <h1 style={{ color: '#0088cc' }}>Mi Token BDB</h1>
      
      {/* Mostrar diferentes cosas según si está conectado o no */}
      {!connected ? (
        // ====================================
        // SI NO ESTÁ CONECTADO - Mostrar botón
        // ====================================
        <div>
          <p>Conectá tu wallet para interactuar con el token BDB</p>
          
          <button 
            onClick={connectWallet}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#0088cc',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Conectar Wallet
          </button>
        </div>
      ) : (
        // ====================================
        // SI ESTÁ CONECTADO - Mostrar info
        // ====================================
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f0f0f0', 
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <p style={{ fontWeight: 'bold' }}>Conectado como:</p>
          
          {/* Mostrar public key truncada (primeros y últimos caracteres) */}
          <code style={{ 
            backgroundColor: '#fff', 
            padding: '8px', 
            borderRadius: '4px',
            display: 'block',
            marginTop: '8px',
            wordBreak: 'break-all'
          }}>
            {publicKey.slice(0, 8)}...{publicKey.slice(-8)}
          </code>
        </div>
      )}
    </div>
  )
}

// Exportar para que React pueda usar este componente
export default App
