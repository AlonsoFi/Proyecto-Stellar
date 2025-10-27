import { useState } from "react";
// Usamos una implementación híbrida que funciona
declare global {
  interface Window {
    freighterApi?: {
      isConnected: () => Promise<boolean>;
      getPublicKey: () => Promise<string>;
    };
  }
}

// Configuración de la red
const CONTRACT_ID = "CCJAELYKO44YV3KOAPRFJ67FD5H64OJIVZCXNQ4F5X5K7VZWEZCTA27F";
// const NETWORK_PASSPHRASE = "Test SDF Network ; September 2015"; // No se usa por ahora
const RPC_URL = "https://soroban-testnet.stellar.org";

function App() {
  const [connected, setConnected] = useState<boolean>(false);
  const [publicKey, setPublicKey] = useState<string>("");
  const [balance, setBalance] = useState<string>("0");
  const [loading, setLoading] = useState<boolean>(false);

  // Obtener información del token
  const getTokenInfo = () => {
    return {
      name: "Buen Dia Builders",
      symbol: "BDB",
      decimals: 7,
      totalSupply: 1000000,
    };
  };

  // Conectar wallet REAL con Freighter
  const connectWallet = async () => {
    try {
      // Verificar si Freighter está disponible
      if (window.freighterApi) {
        // Verificar si está conectado
        if (await window.freighterApi.isConnected()) {
          // Obtener la public key real del usuario
          const pk = await window.freighterApi.getPublicKey();
          setPublicKey(pk);
          setConnected(true);
          alert("¡Wallet conectada exitosamente! 🎉");
          console.log("Wallet conectada:", pk);
        } else {
          alert("Por favor conectá tu wallet en Freighter primero");
        }
      } else {
        alert("Por favor instalá Freighter wallet desde https://freighter.app");
      }
    } catch (error) {
      console.error("Error conectando wallet:", error);
      alert(
        "Error al conectar. Asegurate de que Freighter esté instalado y desbloqueado."
      );
    }
  };

  // Obtener balance REAL del contrato
  const getBalance = async () => {
    if (!connected) {
      alert("Conectá tu wallet primero");
      return;
    }

    setLoading(true);
    try {
      // Hacer llamada directa al RPC de Stellar
      const response = await fetch(RPC_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "callContract",
          params: {
            contractAddress: CONTRACT_ID,
            method: "balance",
            args: [publicKey],
          },
        }),
      });

      const data = await response.json();

      if (data.result) {
        // El resultado viene como ScVal, necesitamos convertirlo
        const balanceValue = data.result.value?.i128?.lo || 0;

        // Convertir a string (considerando 7 decimales)
        const formattedBalance = (Number(balanceValue) / 10000000).toFixed(2);
        setBalance(formattedBalance);

        console.log("Balance obtenido:", formattedBalance);
        alert(
          `¡Balance obtenido del contrato! Tienes ${formattedBalance} BDB 🦈`
        );
      } else {
        throw new Error(data.error?.message || "Error desconocido");
      }
    } catch (error) {
      console.error("Error obteniendo balance:", error);
      setBalance("Error");
      alert(
        "Error al obtener balance del contrato. Verificá que el contrato esté deployado."
      );
    } finally {
      setLoading(false);
    }
  };

  const tokenInfo = getTokenInfo();

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background:
          "linear-gradient(135deg, #0a1929 0%, #1e3a8a 25%, #1e40af 50%, #3b82f6 75%, #60a5fa 100%)",
        padding: "20px",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: 0,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            padding: "30px",
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(20px)",
            borderRadius: "20px",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: "800",
              margin: "0 0 10px 0",
              color: "#60a5fa",
              textShadow: "0 0 20px rgba(96, 165, 250, 0.5)",
            }}
          >
            🦈 Token BDB - Mi Primera DApp
          </h1>
          <p
            style={{
              color: "#e2e8f0",
              fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
              margin: "0 0 20px 0",
              opacity: 0.9,
            }}
          >
            por [Tu Nombre] 🦈
          </p>
          <div
            style={{
              padding: "8px 16px",
              background: "rgba(59, 130, 246, 0.15)",
              borderRadius: "12px",
              border: "1px solid rgba(59, 130, 246, 0.4)",
              display: "inline-block",
            }}
          >
            <p
              style={{
                color: "#60a5fa",
                margin: "0",
                fontSize: "clamp(0.8rem, 2vw, 1rem)",
                fontFamily: "monospace",
              }}
            >
              Contract ID: {CONTRACT_ID.slice(0, 8)}...{CONTRACT_ID.slice(-8)}
            </p>
          </div>
        </div>

        {/* Token Info */}
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(20px)",
            padding: "25px",
            borderRadius: "20px",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          }}
        >
          <h2
            style={{
              color: "#60a5fa",
              marginTop: "0",
              fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
              fontWeight: "600",
              marginBottom: "20px",
            }}
          >
            📊 Información del Token
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "15px",
            }}
          >
            <div
              style={{
                padding: "15px",
                background: "rgba(59, 130, 246, 0.12)",
                borderRadius: "12px",
                border: "1px solid rgba(59, 130, 246, 0.25)",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.background = "rgba(59, 130, 246, 0.2)";
                e.currentTarget.style.boxShadow =
                  "0 10px 25px rgba(59, 130, 246, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = "rgba(59, 130, 246, 0.12)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <p
                style={{
                  color: "#cbd5e1",
                  margin: "0 0 5px 0",
                  fontSize: "0.9em",
                  opacity: 0.8,
                }}
              >
                Nombre
              </p>
              <p
                style={{
                  color: "#60a5fa",
                  margin: "0",
                  fontSize: "1.2em",
                  fontWeight: "600",
                }}
              >
                {tokenInfo.name}
              </p>
            </div>
            <div
              style={{
                padding: "15px",
                background: "rgba(59, 130, 246, 0.12)",
                borderRadius: "12px",
                border: "1px solid rgba(59, 130, 246, 0.25)",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.background = "rgba(59, 130, 246, 0.2)";
                e.currentTarget.style.boxShadow =
                  "0 10px 25px rgba(59, 130, 246, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = "rgba(59, 130, 246, 0.12)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <p
                style={{
                  color: "#cbd5e1",
                  margin: "0 0 5px 0",
                  fontSize: "0.9em",
                  opacity: 0.8,
                }}
              >
                Símbolo
              </p>
              <p
                style={{
                  color: "#60a5fa",
                  margin: "0",
                  fontSize: "1.2em",
                  fontWeight: "600",
                }}
              >
                {tokenInfo.symbol}
              </p>
            </div>
            <div
              style={{
                padding: "15px",
                background: "rgba(59, 130, 246, 0.12)",
                borderRadius: "12px",
                border: "1px solid rgba(59, 130, 246, 0.25)",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.background = "rgba(59, 130, 246, 0.2)";
                e.currentTarget.style.boxShadow =
                  "0 10px 25px rgba(59, 130, 246, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = "rgba(59, 130, 246, 0.12)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <p
                style={{
                  color: "#cbd5e1",
                  margin: "0 0 5px 0",
                  fontSize: "0.9em",
                  opacity: 0.8,
                }}
              >
                Decimales
              </p>
              <p
                style={{
                  color: "#60a5fa",
                  margin: "0",
                  fontSize: "1.2em",
                  fontWeight: "600",
                }}
              >
                {tokenInfo.decimals}
              </p>
            </div>
            <div
              style={{
                padding: "15px",
                background: "rgba(59, 130, 246, 0.12)",
                borderRadius: "12px",
                border: "1px solid rgba(59, 130, 246, 0.25)",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.background = "rgba(59, 130, 246, 0.2)";
                e.currentTarget.style.boxShadow =
                  "0 10px 25px rgba(59, 130, 246, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = "rgba(59, 130, 246, 0.12)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <p
                style={{
                  color: "#cbd5e1",
                  margin: "0 0 5px 0",
                  fontSize: "0.9em",
                  opacity: 0.8,
                }}
              >
                Total Supply
              </p>
              <p
                style={{
                  color: "#60a5fa",
                  margin: "0",
                  fontSize: "1.2em",
                  fontWeight: "600",
                }}
              >
                {tokenInfo.totalSupply.toLocaleString()} {tokenInfo.symbol}
              </p>
            </div>
          </div>
        </div>

        {/* Wallet Connection */}
        <div
          style={{
            textAlign: "center",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(20px)",
            padding: "30px",
            borderRadius: "20px",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          }}
        >
          <h2
            style={{
              color: "#60a5fa",
              fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
              marginBottom: "15px",
              fontWeight: "600",
            }}
          >
            🔗 Conectar Wallet
          </h2>
          <p
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.1rem)",
              marginBottom: "25px",
              color: "#e2e8f0",
              opacity: 0.9,
            }}
          >
            ¡Bienvenida a tu primera DApp! Conecta tu wallet para empezar a usar
            TokenBDB y explorar el mundo de la blockchain 🚀
          </p>
          <div
            style={{
              display: "flex",
              gap: "15px",
              justifyContent: "center",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <button
              onClick={connectWallet}
              style={{
                background: "linear-gradient(45deg, #ff6b9d, #ff8fab)",
                color: "white",
                border: "none",
                padding: "15px 30px",
                fontSize: "clamp(1rem, 2.5vw, 1.1rem)",
                fontWeight: "600",
                borderRadius: "15px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 10px 25px rgba(255, 107, 157, 0.4)",
                minWidth: "150px",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-3px) scale(1.05)";
                e.currentTarget.style.boxShadow =
                  "0 15px 35px rgba(255, 107, 157, 0.6)";
                e.currentTarget.style.background =
                  "linear-gradient(45deg, #ff4757, #ff6b9d)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 10px 25px rgba(255, 107, 157, 0.4)";
                e.currentTarget.style.background =
                  "linear-gradient(45deg, #ff6b9d, #ff8fab)";
              }}
            >
              🔌 Conectar Freighter
            </button>
            <button
              onClick={() => {
                setConnected(true);
                setPublicKey(
                  "GA7IOL2PQSSQ2UH3HTFFD4COT2D53LPXJ4CHQQB7TY4ZHM27QWWA6BEI"
                );
                alert("Modo demo activado con tu public key! 🎮");
              }}
              style={{
                background: "linear-gradient(45deg, #f59e0b, #fbbf24)",
                color: "white",
                border: "none",
                padding: "15px 30px",
                fontSize: "clamp(1rem, 2.5vw, 1.1rem)",
                fontWeight: "600",
                borderRadius: "15px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 10px 25px rgba(245, 158, 11, 0.3)",
                minWidth: "150px",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-3px) scale(1.05)";
                e.currentTarget.style.boxShadow =
                  "0 15px 35px rgba(245, 158, 11, 0.5)";
                e.currentTarget.style.background =
                  "linear-gradient(45deg, #d97706, #f59e0b)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 10px 25px rgba(245, 158, 11, 0.3)";
                e.currentTarget.style.background =
                  "linear-gradient(45deg, #f59e0b, #fbbf24)";
              }}
            >
              🎮 Modo Demo
            </button>
          </div>
        </div>

        {/* Balance Display */}
        {connected && (
          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(20px)",
              padding: "25px",
              borderRadius: "20px",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  color: "#60a5fa",
                  margin: "0 0 20px 0",
                  fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                  fontWeight: "600",
                }}
              >
                Conectado: {publicKey.slice(0, 8)}...{publicKey.slice(-8)}
              </p>
              <button
                onClick={getBalance}
                disabled={loading}
                style={{
                  background: loading
                    ? "linear-gradient(45deg, #6b7280, #9ca3af)"
                    : "linear-gradient(45deg, #8b5cf6, #a78bfa)",
                  color: "white",
                  border: "none",
                  padding: "15px 30px",
                  fontSize: "clamp(1rem, 2.5vw, 1.1rem)",
                  fontWeight: "600",
                  borderRadius: "15px",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 10px 25px rgba(139, 92, 246, 0.3)",
                  opacity: loading ? 0.7 : 1,
                  minWidth: "150px",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform =
                      "translateY(-3px) scale(1.05)";
                    e.currentTarget.style.boxShadow =
                      "0 15px 35px rgba(139, 92, 246, 0.5)";
                    e.currentTarget.style.background =
                      "linear-gradient(45deg, #7c3aed, #8b5cf6)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 25px rgba(139, 92, 246, 0.3)";
                    e.currentTarget.style.background =
                      "linear-gradient(45deg, #8b5cf6, #a78bfa)";
                  }
                }}
              >
                {loading ? "⏳ Cargando..." : "💰 Ver Balance"}
              </button>

              <div
                style={{
                  marginTop: "25px",
                  padding: "20px",
                  background: "rgba(59, 130, 246, 0.15)",
                  borderRadius: "15px",
                  border: "1px solid rgba(59, 130, 246, 0.4)",
                }}
              >
                <h3
                  style={{
                    color: "#60a5fa",
                    margin: "0 0 15px 0",
                    fontSize: "clamp(1.1rem, 2.5vw, 1.3rem)",
                    fontWeight: "600",
                  }}
                >
                  💎 Tu Balance
                </h3>
                <p
                  style={{
                    fontSize: "clamp(1.5rem, 4vw, 2rem)",
                    fontWeight: "bold",
                    color: "#60a5fa",
                    margin: "0",
                    textShadow: "0 0 20px rgba(96, 165, 250, 0.5)",
                  }}
                >
                  {balance} BDB
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
