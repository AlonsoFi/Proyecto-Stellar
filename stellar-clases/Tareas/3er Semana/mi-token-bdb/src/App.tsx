// ========================================
// IMPORTS - Librerías que necesitamos
// ========================================

// React hooks para manejar estado
import { useState } from "react";

// Freighter API para conectar la wallet
import { isConnected, requestAccess } from '@stellar/freighter-api';

// Tipos para Vite
/// <reference types="vite/client" />

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

function App() {
  // ========================================
  // ESTADO - Variables que React va a "vigilar"
  // ========================================

  // Public key del usuario (su dirección Stellar)
  const [publicKey, setPublicKey] = useState<string>("");

  // Si la wallet está conectada o no
  const [connected, setConnected] = useState<boolean>(false);

  // NUEVO: Estado para el balance
  const [balance, setBalance] = useState<string>("0");

  // NUEVO: Estado para mostrar "Cargando..."
  const [loading, setLoading] = useState<boolean>(false);

  // NUEVO: Estados para transferencia
  const [toAddress, setToAddress] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [transferring, setTransferring] = useState<boolean>(false);

  // NUEVO: Estados para features avanzadas
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });
  const [wallets, setWallets] = useState<string[]>(() => {
    const saved = localStorage.getItem("wallets");
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedWallet, setSelectedWallet] = useState<string>("");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showDashboard, setShowDashboard] = useState<boolean>(false);

  // NUEVO: Estados para notificaciones
  const [notifications, setNotifications] = useState<
    Array<{
      id: string;
      type: "success" | "error" | "warning" | "info";
      title: string;
      message: string;
      duration?: number;
    }>
  >([]);

  // ========================================
  // TEMAS - Colores para modo claro y oscuro
  // ========================================

  const themes = {
    light: {
      background:
        "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f8fafc 100%)",
      surface: "#ffffff",
      text: "#1e293b",
      textSecondary: "#64748b",
      primary: "#0ea5e9",
      secondary: "#10b981",
      accent: "#f59e0b",
      warning: "#f97316",
      success: "#22c55e",
      info: "#3b82f6",
      border: "#e2e8f0",
      card: "#ffffff",
      walletCard: "#f8fafc",
      contractCard: "#fef3c7",
      contractCardBorder: "#f59e0b",
      contractCardText: "#92400e",
      shadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      shadowHover:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      gradient: "linear-gradient(135deg, #0ea5e9, #10b981)",
      gradientSecondary: "linear-gradient(135deg, #f59e0b, #f97316)",
    },
    dark: {
      background:
        "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
      surface: "#1e293b",
      text: "#f1f5f9",
      textSecondary: "#94a3b8",
      primary: "#38bdf8",
      secondary: "#34d399",
      accent: "#fbbf24",
      warning: "#fb923c",
      success: "#4ade80",
      info: "#60a5fa",
      border: "#475569",
      card: "#334155",
      walletCard: "#475569",
      contractCard: "#451a03",
      contractCardBorder: "#fbbf24",
      contractCardText: "#fcd34d",
      shadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
      shadowHover:
        "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)",
      gradient: "linear-gradient(135deg, #38bdf8, #34d399)",
      gradientSecondary: "linear-gradient(135deg, #fbbf24, #fb923c)",
    },
  };

  const currentTheme = darkMode ? themes.dark : themes.light;

  // ========================================
  // FUNCIONES PARA NOTIFICACIONES
  // ========================================

  // Mostrar notificación
  const showNotification = (
    type: "success" | "error" | "warning" | "info",
    title: string,
    message: string,
    duration: number = 5000
  ) => {
    const id = Date.now().toString();
    const notification = { id, type, title, message, duration };

    setNotifications((prev) => [...prev, notification]);

    // Auto-remover después de la duración especificada
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  };

  // Remover notificación
  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  // ========================================
  // FUNCIONES PARA FEATURES AVANZADAS
  // ========================================

  // Toggle modo oscuro/claro
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
  };

  // Agregar wallet a la lista
  const addWallet = (walletAddress: string) => {
    if (!wallets.includes(walletAddress)) {
      const newWallets = [...wallets, walletAddress];
      setWallets(newWallets);
      localStorage.setItem("wallets", JSON.stringify(newWallets));
    }
  };

  // Cambiar wallet seleccionada
  const changeWallet = (walletAddress: string) => {
    setSelectedWallet(walletAddress);
    setPublicKey(walletAddress);
    setBalance("0"); // Reset balance when changing wallet
  };

  // Desconectar wallet
  const disconnectWallet = () => {
    setConnected(false);
    setPublicKey("");
    setBalance("0");
    setSelectedWallet("");
    setTransactions([]);
    setShowDashboard(false);
    // Limpiar localStorage de wallets si queremos
    // localStorage.removeItem('wallets');
  };

  // Obtener historial de transacciones
  const getTransactionHistory = async () => {
    if (!publicKey || publicKey === "") return;

    try {
      // Primero intentar obtener transacciones reales
      const response = await fetch(
        `https://horizon-testnet.stellar.org/accounts/${publicKey}/operations?limit=10&order=desc`
      );
      const data = await response.json();

      const tokenTransactions = data._embedded.records
        .filter(
          (op: any) =>
            op.type === "payment" &&
            op.asset_type === "native" &&
            op.asset_code === "XLM"
        )
        .slice(0, 10);

      if (tokenTransactions.length > 0) {
        setTransactions(tokenTransactions);
      } else {
        // Si no hay transacciones reales, usar las del localStorage (modo demo)
        const savedTransactions = localStorage.getItem(
          `transactions_${publicKey}`
        );
        if (savedTransactions) {
          setTransactions(JSON.parse(savedTransactions));
        } else {
          // Transacciones de ejemplo
          setTransactions([
            {
              id: "1",
              created_at: new Date().toISOString(),
              from: publicKey,
              to: "GDMOZILJ...",
              amount: "100.00",
            },
            {
              id: "2",
              created_at: new Date(Date.now() - 3600000).toISOString(),
              from: "GA7IOL2P...",
              to: publicKey,
              amount: "50.00",
            },
          ]);
        }
      }
    } catch (error) {
      console.error("Error obteniendo historial:", error);
      // Usar transacciones guardadas en localStorage
      const savedTransactions = localStorage.getItem(
        `transactions_${publicKey}`
      );
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions));
      } else {
        setTransactions([]);
      }
    }
  };

  // Toggle dashboard
  const toggleDashboard = () => {
    setShowDashboard(!showDashboard);
    if (!showDashboard) {
      getTransactionHistory();
    }
  };

  // ========================================
  // FUNCIONES: Conectar Wallet
  // ========================================

  // FUNCIÓN: Conectar Freighter (Wallet Real)
  const connectFreighter = async () => {
    try {
      console.log("🔍 Conectando con Freighter...");
      
      // 1. Verificar si Freighter está conectado
      const connected = await isConnected();
      
      if (connected) {
        // 2. Solicitar acceso a la wallet
        const access = await requestAccess();
        
        if (access) {
          // 3. Obtener la public key del usuario
          const pk = access.address;
          
          // 4. Guardar en el estado
          setPublicKey(pk);
          setConnected(true);
          addWallet(pk); // Agregar a la lista de wallets
          setSelectedWallet(pk);
          
          showNotification(
            "success",
            "¡Freighter Conectado!",
            "Tu wallet se conectó exitosamente 🎉"
          );
          console.log("✅ Freighter conectado:", pk);
        } else {
          showNotification(
            "warning",
            "Acceso Denegado",
            "No se otorgó acceso a la wallet. Intenta de nuevo."
          );
        }
      } else {
        showNotification(
          "error",
          "Freighter No Instalado",
          "Por favor instala Freighter desde https://freighter.app y asegúrate de estar en modo TESTNET."
        );
      }
    } catch (error) {
      console.error("❌ Error conectando Freighter:", error);
      showNotification(
        "error",
        "Error de Conexión",
        "No se pudo conectar Freighter. Asegúrate de tener Freighter instalado y en modo TESTNET."
      );
    }
  };

  // FUNCIÓN: Activar Modo Demo
  const connectDemo = async () => {
    try {
      // Simular conexión para demo
      const simulatedPublicKey =
        "GA7IOL2PQSSQ2UH3HTFFD4COT2D53LPXJ4CHQQB7TY4ZHM27QWWA6BEI";
      setPublicKey(simulatedPublicKey);
      setConnected(true);
      addWallet(simulatedPublicKey);
      setSelectedWallet(simulatedPublicKey);
      showNotification(
        "info",
        "Modo Demo Activado",
        "Usando datos simulados para demostración 🎮"
      );
      console.log("Modo demo activado");
    } catch (error) {
      console.error("Error activando demo:", error);
      showNotification(
        "error",
        "Error de Demo",
        "No se pudo activar el modo demo. Intenta de nuevo."
      );
    }
  };

  // ========================================
  // FUNCIÓN NUEVA: Obtener Balance
  // ========================================

  const getBalance = async () => {
    // 1. Verificar que la wallet esté conectada
    if (!connected || !publicKey || publicKey === "") {
      // Si no está conectado, usar modo demo
      console.log("Modo demo: mostrando balance simulado");
      setBalance("1000.00");
      showNotification(
        "info",
        "Modo Demo",
        "Balance simulado: 1000.00 BDB"
      );
      return;
    }

    // 2. Mostrar estado de carga
    setLoading(true);

    try {
      // 3. Obtener Contract ID desde variables de entorno
      const contractId = import.meta.env.VITE_BDB_CONTRACT_ID;
      const rpcUrl = import.meta.env.VITE_STELLAR_RPC_URL;

      console.log("Contract ID:", contractId);
      console.log("RPC URL:", rpcUrl);
      console.log("Public Key:", publicKey);

      // 4. Hacer llamada directa al RPC de Stellar
      const response = await fetch(rpcUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "callContract",
          params: {
            contractAddress: contractId,
            method: "balance",
            args: [publicKey],
          },
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Error de red: ${response.status} - ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Response data:", data);

      if (data.error) {
        throw new Error(
          `Error del servidor: ${data.error.message || "Error desconocido"}`
        );
      }

      if (data.result) {
        // El resultado viene como ScVal, necesitamos convertirlo
        const balanceValue = data.result.value?.i128?.lo || 0;

        // Convertir a string (considerando 7 decimales)
        const formattedBalance = (Number(balanceValue) / 10000000).toFixed(2);
        setBalance(formattedBalance);

        console.log("Balance obtenido:", formattedBalance);
        showNotification(
          "success",
          "Balance Obtenido",
          `Tienes ${formattedBalance} BDB 🦈`
        );
      } else {
        throw new Error("No se pudo obtener el balance del contrato");
      }
    } catch (error) {
      // Si algo sale mal, mostrar balance simulado
      console.error("Error obteniendo balance:", error);

      // Mostrar error específico al usuario
      showNotification(
        "warning",
        "Error de Conexión",
        `Modo demo activado con balance simulado`
      );

      const simulatedBalance = "1000.00";
      setBalance(simulatedBalance);
    } finally {
      // 10. Ocultar estado de carga (pase lo que pase)
      setLoading(false);
    }
  };

  // ========================================
  // FUNCIÓN: Transferir Tokens
  // ========================================

  const transferTokens = async () => {
    // 1. VALIDACIÓN BÁSICA
    if (!connected || !publicKey || publicKey === "") {
      showNotification("error", "Error", "Conectá tu wallet primero");
      return;
    }

    if (!toAddress || !amount || amount <= 0) {
      showNotification(
        "error",
        "Error de Validación",
        "Por favor ingresá una dirección y cantidad válidas (mayor a 0)"
      );
      return;
    }

    // 2. VALIDACIÓN DE DIRECCIÓN STELLAR
    // Las direcciones Stellar empiezan con G y tienen 56 caracteres
    if (!toAddress.startsWith("G") || toAddress.length !== 56) {
      showNotification(
        "error",
        "Dirección Inválida",
        "Debe empezar con G y tener 56 caracteres"
      );
      return;
    }

    // 3. VALIDACIÓN DE CANTIDAD
    if (amount > 1000000) {
      showNotification(
        "error",
        "Cantidad Inválida",
        "La cantidad no puede ser mayor a 1,000,000 BDB"
      );
      return;
    }

    // 4. VALIDACIÓN DE BALANCE SUFICIENTE
    const currentBalance = parseFloat(balance);
    if (currentBalance <= 0) {
      showNotification(
        "error",
        "Sin Balance",
        "No tenés BDB para transferir. Balance actual: 0 BDB"
      );
      return;
    }
    if (amount > currentBalance) {
      showNotification(
        "error",
        "Balance Insuficiente",
        `No tenés suficiente BDB. Balance actual: ${currentBalance} BDB`
      );
      return;
    }

    // 3. INICIAR PROCESO DE TRANSFERENCIA
    setTransferring(true);

    try {
      // 4. OBTENER CONTRACT ID
      const contractId = import.meta.env.VITE_BDB_CONTRACT_ID;
      const rpcUrl = import.meta.env.VITE_STELLAR_RPC_URL;

      console.log("Transferiendo:", { toAddress, amount, contractId });

      // 5. HACER LLAMADA AL RPC PARA TRANSFERIR
      const response = await fetch(rpcUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "callContract",
          params: {
            contractAddress: contractId,
            method: "transfer",
            args: [publicKey, toAddress, amount * 10000000], // Convertir a la unidad correcta
          },
        }),
      });

      const data = await response.json();
      console.log("Transfer response:", data);

      if (data.result) {
        // 6. ÉXITO
        console.log("Transfer exitoso:", data.result);
        showNotification(
          "success",
          "Transferencia Exitosa",
          `Enviaste ${amount} BDB a ${toAddress?.slice(0, 8) || 'dirección'}...`
        );

        // 7. ACTUALIZAR BALANCE
        getBalance();

        // 8. LIMPIAR FORMULARIO
        setToAddress("");
        setAmount(0);
      } else {
        // Si hay error, simular transferencia exitosa para demo
        console.log("Transfer simulado:", { toAddress, amount });
        showNotification(
          "info",
          "Transferencia Simulada",
          `Enviaste ${amount} BDB a ${toAddress?.slice(0, 8) || 'dirección'}... (Modo demo)`
        );

        // Actualizar balance simulado
        const currentBalance = parseFloat(balance);
        const newBalance = Math.max(0, currentBalance - amount);
        setBalance(newBalance.toFixed(2));

        // Guardar transacción en localStorage (modo demo)
        const newTransaction = {
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          from: publicKey,
          to: toAddress,
          amount: amount.toString(),
        };

        const savedTransactions = localStorage.getItem(
          `transactions_${publicKey}`
        );
        const transactions = savedTransactions
          ? JSON.parse(savedTransactions)
          : [];
        transactions.unshift(newTransaction); // Agregar al inicio
        localStorage.setItem(
          `transactions_${publicKey}`,
          JSON.stringify(transactions.slice(0, 10))
        ); // Mantener solo las últimas 10

        // Limpiar formulario
        setToAddress("");
        setAmount(0);
      }
    } catch (error) {
      // SI ALGO SALE MAL, simular transferencia
      console.error("Error en transfer:", error);
      showNotification(
        "info",
        "Transferencia Simulada",
        `Enviaste ${amount} BDB a ${toAddress?.slice(0, 8) || 'dirección'}... (Modo demo)`
      );

      // Actualizar balance simulado
      const currentBalance = parseFloat(balance);
      const newBalance = Math.max(0, currentBalance - amount);
      setBalance(newBalance.toFixed(2));

      // Guardar transacción en localStorage (modo demo)
      const newTransaction = {
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        from: publicKey,
        to: toAddress,
        amount: amount.toString(),
      };

      const savedTransactions = localStorage.getItem(
        `transactions_${publicKey}`
      );
      const transactions = savedTransactions
        ? JSON.parse(savedTransactions)
        : [];
      transactions.unshift(newTransaction); // Agregar al inicio
      localStorage.setItem(
        `transactions_${publicKey}`,
        JSON.stringify(transactions.slice(0, 10))
      ); // Mantener solo las últimas 10

      // Limpiar formulario
      setToAddress("");
      setAmount(0);
    } finally {
      // SIEMPRE OCULTAR LOADING (pase lo que pase)
      setTransferring(false);
    }
  };

  // ========================================
  // INTERFAZ - Lo que el usuario ve
  // ========================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background: darkMode
          ? "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)"
          : "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%)",
        color: currentTheme.text,
        fontFamily: "'Inter', sans-serif",
        padding: "20px",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Contenedor principal centrado */}
      <div
        className="main-container"
        style={{
          flex: "1",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* Contenedor de botones de control - responsivo */}
        <div
          className="control-buttons"
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            zIndex: "1000",
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {/* Botón Dashboard cuando está conectado */}
          {connected && (
            <button
              className="theme-toggle"
              onClick={toggleDashboard}
              style={{
                padding: "10px 16px",
                fontSize: "12px",
                fontWeight: "600",
                background: `linear-gradient(135deg, ${currentTheme.secondary}, ${currentTheme.primary})`,
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: currentTheme.shadow,
                transition: "all 0.3s ease",
                backdropFilter: "blur(10px)",
                minWidth: "auto",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = currentTheme.shadowHover;
                e.currentTarget.style.scale = "1.02";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = currentTheme.shadow;
                e.currentTarget.style.scale = "1";
              }}
            >
              📊 {showDashboard ? "Ocultar" : "Dashboard"}
            </button>
          )}

          {/* Botón de modo oscuro/claro */}
          <button
            className="theme-toggle"
            onClick={toggleDarkMode}
            style={{
              padding: "10px 16px",
              fontSize: "12px",
              fontWeight: "600",
              background: currentTheme.surface,
              color: currentTheme.text,
              border: `2px solid ${currentTheme.border}`,
              borderRadius: "10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: currentTheme.shadow,
              transition: "all 0.3s ease",
              backdropFilter: "blur(10px)",
              minWidth: "auto",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = currentTheme.shadowHover;
              e.currentTarget.style.scale = "1.02";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = currentTheme.shadow;
              e.currentTarget.style.scale = "1";
            }}
          >
            {darkMode ? "☀️" : "🌙"} {darkMode ? "Claro" : "Oscuro"}
          </button>
        </div>

        {/* Header centrado */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "12px",
              marginBottom: "8px",
            }}
          >
            <span style={{ fontSize: "2.5rem" }}>🦈</span>
            <h1
              style={{
                color: currentTheme.text,
                margin: "0",
                fontSize: "2.8rem",
                fontWeight: "700",
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "-0.025em",
              }}
            >
              Buen Día Builders Token
            </h1>
            <span style={{ fontSize: "2rem" }}>🚀</span>
          </div>
          <p
            style={{
              color: currentTheme.textSecondary,
              fontSize: "18px",
              margin: "0 0 16px 0",
              fontWeight: "500",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Token BDB en Stellar Testnet
          </p>
          <p
            style={{
              color: currentTheme.textSecondary,
              fontSize: "16px",
              margin: "0",
              fontWeight: "400",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            por Alonso Florencia 🦈
          </p>
          {connected && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "16px",
                padding: "6px 12px",
                background: currentTheme.success,
                color: "white",
                borderRadius: "16px",
                fontSize: "12px",
                fontWeight: "600",
                boxShadow: currentTheme.shadow,
                animation: "fadeInUp 1s ease-out",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  backgroundColor: "white",
                  borderRadius: "50%",
                  animation: "pulse 2s infinite",
                }}
              ></div>
              Wallet Conectada
            </div>
          )}
        </div>

      {/* Mostrar diferentes cosas según si está conectado o no */}
        {!connected ? (
          // ====================================
          // SI NO ESTÁ CONECTADO - Contenido centrado
          // ====================================
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "20px",
              maxWidth: "800px",
              width: "100%",
            }}
          >
            <div
              style={{
                marginBottom: "40px",
              }}
            >
              <p
                style={{
                  color: currentTheme.textSecondary,
                  fontSize: "24px",
                  lineHeight: "1.6",
                  margin: "0 0 20px 0",
                  fontWeight: "500",
                }}
              >
                ¡Bienvenida a tu primera DApp! Elige cómo quieres conectarte para
                empezar a usar TokenBDB 🚀
              </p>

              <p
                style={{
                  color: currentTheme.textSecondary,
                  fontSize: "18px",
                  lineHeight: "1.5",
                  margin: "0 0 30px 0",
                  opacity: "0.8",
                }}
              >
                <strong>Conectar Freighter:</strong> Usa tu wallet real de Stellar<br/>
                <strong>Modo Demo:</strong> Explora la DApp con datos simulados
              </p>
            </div>

            {/* Botones de conexión */}
            <div
              style={{
                display: "flex",
                gap: "20px",
                justifyContent: "center",
                flexWrap: "wrap",
                width: "100%",
                maxWidth: "600px",
              }}
            >
              {/* Botón Conectar Freighter */}
              <button
                onClick={connectFreighter}
                style={{
                  padding: "20px 30px",
                  fontSize: "18px",
                  fontWeight: "700",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "16px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: currentTheme.shadow,
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  minWidth: "220px",
                  justifyContent: "center",
                  flex: "1",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = currentTheme.shadowHover;
                  e.currentTarget.style.scale = "1.05";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = currentTheme.shadow;
                  e.currentTarget.style.scale = "1";
                }}
              >
                <span style={{ fontSize: "20px" }}>🔌</span>
                Conectar Freighter
              </button>

              {/* Botón Modo Demo */}
              <button
                onClick={connectDemo}
                style={{
                  padding: "20px 30px",
                  fontSize: "18px",
                  fontWeight: "700",
                  background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "16px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: currentTheme.shadow,
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  minWidth: "220px",
                  justifyContent: "center",
                  flex: "1",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = currentTheme.shadowHover;
                  e.currentTarget.style.scale = "1.05";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = currentTheme.shadow;
                  e.currentTarget.style.scale = "1";
                }}
              >
                <span style={{ fontSize: "20px" }}>🎮</span>
                Modo Demo
              </button>
            </div>
          </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            marginTop: "30px",
          }}
        >
          {/* Información de conexión */}
          <div
            style={{
              padding: "24px",
              background: currentTheme.walletCard,
              borderRadius: "16px",
              border: `1px solid ${currentTheme.border}`,
              boxShadow: currentTheme.shadow,
              backdropFilter: "blur(20px)",
              animation: "fadeInUp 0.6s ease-out",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "16px",
              }}
            >
              <span style={{ fontSize: "16px" }}>✅</span>
              <p
                style={{
                  fontWeight: "600",
                  margin: "0",
                  color: currentTheme.text,
                  fontSize: "16px",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Wallet Conectada
              </p>
            </div>

            {/* Selector de múltiples wallets */}
            {wallets.length > 1 && (
              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    fontSize: "12px",
                    color: currentTheme.textSecondary,
                    fontWeight: "bold",
                    display: "block",
                    marginBottom: "5px",
                  }}
                >
                  Seleccionar Wallet:
                </label>
                <select
                  value={selectedWallet}
                  onChange={(e) => changeWallet(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: `2px solid ${currentTheme.border}`,
                    backgroundColor: currentTheme.card,
                    color: currentTheme.text,
                    fontSize: "14px",
                  }}
                >
                  {wallets.map((wallet, index) => (
                    <option key={index} value={wallet}>
                      {wallet?.slice(0, 8) || 'dirección'}...{wallet?.slice(-8) || 'ción'}{" "}
                      {wallet === publicKey ? "(Actual)" : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Dirección completa */}
            <div
              style={{
                backgroundColor: currentTheme.card,
                padding: "12px",
                borderRadius: "8px",
                border: `2px solid ${currentTheme.border}`,
                marginBottom: "15px",
              }}
            >
              <p
                style={{
                  fontSize: "12px",
                  color: currentTheme.textSecondary,
                  margin: "0 0 5px 0",
                  fontWeight: "bold",
                }}
              >
                Tu dirección Stellar:
              </p>
              <code
                style={{
                  fontSize: "14px",
                  wordBreak: "break-all",
                  color: currentTheme.text,
                  fontFamily: "monospace",
                }}
              >
                {publicKey}
              </code>
            </div>

            {/* Botón de desconectar */}
            <button
              onClick={disconnectWallet}
              style={{
                padding: "8px 16px",
                fontSize: "14px",
                backgroundColor: currentTheme.accent,
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                width: "100%",
                fontWeight: "bold",
                transition: "all 0.3s ease",
              }}
            >
              🔌 Desconectar Wallet
            </button>
          </div>

          {/* Contract ID simple */}
          <div
            style={{
              padding: "20px",
              backgroundColor: currentTheme.contractCard,
              borderRadius: "12px",
              border: `1px solid ${currentTheme.contractCardBorder}`,
              boxShadow: currentTheme.shadow,
              animation: "fadeInUp 1s ease-out",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              <span style={{ fontSize: "16px" }}>ℹ️</span>
              <p
                style={{
                  margin: "0",
                  fontWeight: "600",
                  fontSize: "14px",
                  color: currentTheme.contractCardText,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Contract ID:
              </p>
            </div>
            <code
              style={{
                fontSize: "12px",
                wordBreak: "break-all",
                color: currentTheme.contractCardText,
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: "500",
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                padding: "8px 12px",
                borderRadius: "8px",
                display: "block",
                lineHeight: "1.4",
              }}
            >
              {import.meta.env.VITE_BDB_CONTRACT_ID}
            </code>
          </div>

          {/* NUEVO: Botón para ver balance */}
          <div>
            <button
              onClick={() => {
                if (!connected || !publicKey || publicKey === "") {
                  // Modo demo: mostrar balance simulado
                  setBalance("1000.00");
                  showNotification(
                    "info",
                    "Modo Demo",
                    "Balance simulado: 1000.00 BDB"
                  );
                } else {
                  // Con wallet conectada: obtener balance real
                  getBalance();
                }
              }}
              disabled={loading} // Deshabilitar mientras carga
              style={{
                padding: "12px 24px",
                fontSize: "14px",
                fontWeight: "600",
                backgroundColor: loading
                  ? currentTheme.border
                  : currentTheme.success,
                color: "white",
                border: "none",
                borderRadius: "12px",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                boxShadow: currentTheme.shadow,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                margin: "0 auto",
              }}
            >
              <span style={{ fontSize: "16px" }}>💰</span>
              {loading ? "Cargando..." : "Ver mi Balance BDB"}
            </button>

            {/* NUEVO: Mostrar el balance */}
            <div
              style={{
                marginTop: "24px",
                padding: "24px",
                background: currentTheme.gradient,
                borderRadius: "16px",
                textAlign: "center",
                boxShadow: currentTheme.shadow,
                animation: "fadeInUp 0.8s ease-out",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  marginBottom: "12px",
                }}
              >
                <span style={{ fontSize: "20px" }}>💎</span>
                <p
                  style={{
                    fontSize: "16px",
                    margin: "0",
                    color: "white",
                    fontWeight: "600",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  Tu Balance Actual:
                </p>
              </div>
              <p
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "800",
                  margin: "0 0 8px 0",
                  color: "white",
                  fontFamily: "'Inter', sans-serif",
                  textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              >
                {balance} BDB
              </p>
              <p
                style={{
                  fontSize: "12px",
                  margin: "0",
                  color: "rgba(255, 255, 255, 0.8)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                (0 unidades base con 7 decimales)
              </p>
            </div>

            {/* FORMULARIO DE TRANSFERENCIA */}
            <div style={{ marginTop: "30px" }}>
              <h3
                style={{
                  color: currentTheme.text,
                  marginBottom: "20px",
                  fontSize: "18px",
                }}
              >
                💸 Transferir BDB
              </h3>

              {/* Input para dirección destino */}
              <input
                type="text"
                placeholder="Dirección destino (G...)"
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "15px",
                  borderRadius: "8px",
                  border: `2px solid ${currentTheme.border}`,
                  fontSize: "14px",
                  boxSizing: "border-box",
                  backgroundColor: currentTheme.card,
                  color: currentTheme.text,
                  transition: "all 0.3s ease",
                }}
              />

              {/* Input para cantidad */}
              <input
                type="number"
                placeholder="Cantidad de BDB"
                value={amount || ""}
                onChange={(e) => setAmount(Number(e.target.value))}
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "15px",
                  borderRadius: "8px",
                  border: `2px solid ${currentTheme.border}`,
                  fontSize: "14px",
                  boxSizing: "border-box",
                  backgroundColor: currentTheme.card,
                  color: currentTheme.text,
                  transition: "all 0.3s ease",
                }}
              />

              {/* Botón de transferir */}
              <button
                onClick={transferTokens}
                disabled={transferring || parseFloat(balance) <= 0}
                style={{
                  padding: "12px 24px",
                  fontSize: "16px",
                  fontWeight: "600",
                  backgroundColor:
                    transferring || parseFloat(balance) <= 0
                      ? currentTheme.border
                      : currentTheme.accent,
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  cursor:
                    transferring || parseFloat(balance) <= 0
                      ? "not-allowed"
                      : "pointer",
                  width: "100%",
                  transition: "all 0.3s ease",
                  boxShadow: currentTheme.shadow,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) => {
                  if (!transferring && parseFloat(balance) > 0) {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = currentTheme.shadowHover;
                    e.currentTarget.style.scale = "1.02";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = currentTheme.shadow;
                  e.currentTarget.style.scale = "1";
                }}
              >
                {transferring
                  ? "⏳ Transfiriendo..."
                  : parseFloat(balance) <= 0
                  ? "❌ Sin Balance"
                  : "🚀 Transferir BDB"}
              </button>

              {/* Información adicional */}
              <p
                style={{
                  fontSize: "12px",
                  color: currentTheme.textSecondary,
                  marginTop: "10px",
                  textAlign: "center",
                }}
              >
                💡 Las direcciones Stellar empiezan con 'G' y tienen 56
                caracteres
              </p>
            </div>
          </div>

          {/* Dashboard Avanzado - Fila completa */}
          {showDashboard && (
            <div style={{ marginTop: "30px" }}>
              <h3
                style={{
                  color: currentTheme.text,
                  marginBottom: "20px",
                  fontSize: "20px",
                  borderBottom: `2px solid ${currentTheme.border}`,
                  paddingBottom: "10px",
                }}
              >
                📊 Dashboard Avanzado
              </h3>

              {/* Historial de Transacciones */}
              <div
                style={{
                  backgroundColor: currentTheme.card,
                  padding: "20px",
                  borderRadius: "8px",
                  border: `2px solid ${currentTheme.border}`,
                  marginBottom: "20px",
                }}
              >
                <h4
                  style={{
                    color: currentTheme.text,
                    marginBottom: "15px",
                    fontSize: "16px",
                  }}
                >
                  📈 Últimas Transacciones
                </h4>

                {transactions.length > 0 ? (
                  <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                    {transactions.map((tx, index) => (
                      <div
                        key={index}
                        style={{
                          padding: "12px",
                          border: `1px solid ${currentTheme.border}`,
                          borderRadius: "6px",
                          marginBottom: "8px",
                          backgroundColor: currentTheme.surface,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: "10px",
                          }}
                        >
                          <div>
                            <strong style={{ color: currentTheme.text }}>
                              {tx.from?.slice(0, 8) || 'dirección'}...{tx.from?.slice(-8) || 'ción'} →{" "}
                              {tx.to?.slice(0, 8) || 'dirección'}...{tx.to?.slice(-8) || 'ción'}
                            </strong>
                            <br />
                            <span
                              style={{
                                color: currentTheme.textSecondary,
                                fontSize: "12px",
                              }}
                            >
                              {new Date(tx.created_at).toLocaleString()}
                            </span>
                          </div>
                          <div
                            style={{
                              backgroundColor: currentTheme.primary,
                              color: "white",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontSize: "14px",
                              fontWeight: "bold",
                            }}
                          >
                            {tx.amount} BDB
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p
                    style={{
                      color: currentTheme.textSecondary,
                      textAlign: "center",
                      fontStyle: "italic",
                    }}
                  >
                    No hay transacciones disponibles
                  </p>
                )}
              </div>

              {/* Estadísticas del Token */}
              <div
                style={{
                  backgroundColor: currentTheme.card,
                  padding: "20px",
                  borderRadius: "8px",
                  border: `2px solid ${currentTheme.border}`,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "15px",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <h5
                    style={{
                      color: currentTheme.textSecondary,
                      margin: "0 0 5px 0",
                    }}
                  >
                    Balance Actual
                  </h5>
                  <p
                    style={{
                      color: currentTheme.secondary,
                      fontSize: "24px",
                      fontWeight: "bold",
                      margin: "0",
                    }}
                  >
                    {balance} BDB
                  </p>
                </div>

                <div style={{ textAlign: "center" }}>
                  <h5
                    style={{
                      color: currentTheme.textSecondary,
                      margin: "0 0 5px 0",
                    }}
                  >
                    Wallets Conectadas
                  </h5>
                  <p
                    style={{
                      color: currentTheme.primary,
                      fontSize: "24px",
                      fontWeight: "bold",
                      margin: "0",
                    }}
                  >
                    {connected ? Math.max(1, wallets.length) : 0}
                  </p>
                </div>

                <div style={{ textAlign: "center" }}>
                  <h5
                    style={{
                      color: currentTheme.textSecondary,
                      margin: "0 0 5px 0",
                    }}
                  >
                    Transacciones
                  </h5>
                  <p
                    style={{
                      color: currentTheme.accent,
                      fontSize: "24px",
                      fontWeight: "bold",
                      margin: "0",
                    }}
                  >
                    {transactions.length}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      </div>

      {/* Sistema de Notificaciones */}
      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "400px",
        }}
      >
        {notifications.map((notification) => (
          <div
            key={notification.id}
            style={{
              backgroundColor: currentTheme.card,
              border: `2px solid ${
                notification.type === "success"
                  ? currentTheme.secondary
                  : notification.type === "error"
                  ? currentTheme.accent
                  : notification.type === "warning"
                  ? "#ffc107"
                  : currentTheme.primary
              }`,
              borderRadius: "8px",
              padding: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              animation: "slideIn 0.3s ease-out",
              position: "relative",
              minWidth: "300px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    fontSize: "20px",
                  }}
                >
                  {notification.type === "success"
                    ? "✅"
                    : notification.type === "error"
                    ? "❌"
                    : notification.type === "warning"
                    ? "⚠️"
                    : "ℹ️"}
                </div>
                <h4
                  style={{
                    margin: "0",
                    color: currentTheme.text,
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  {notification.title}
                </h4>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: currentTheme.textSecondary,
                  cursor: "pointer",
                  fontSize: "18px",
                  padding: "0",
                  marginLeft: "10px",
                }}
              >
                ×
              </button>
            </div>
            <p
              style={{
                margin: "0",
                color: currentTheme.textSecondary,
                fontSize: "14px",
                lineHeight: "1.4",
              }}
            >
              {notification.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Exportar para que React pueda usar este componente
export default App;
