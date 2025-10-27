# 🦈 Token BDB - Mi Primera DApp

Una aplicación web completa que conecta con Freighter Wallet y permite interactuar con tu token personalizado BDB en Stellar Testnet.

## 🚀 Deploy Rápido

### Opción 1: Deploy Manual (Más Fácil)
1. Ve a [netlify.com](https://netlify.com)
2. Arrastra la carpeta `dist/` a la zona de deploy
3. ¡Listo! Tu DApp estará disponible en internet

### Opción 2: Deploy con Git
1. Sube tu código a GitHub
2. Conecta tu repo con Netlify
3. Configura el build:
   - Build command: `npm run build`
   - Publish directory: `dist`

## 🔧 Configuración

Tu DApp está configurada con:
- **Contract ID:** `CCJAELYKO44YV3KOAPRFJ67FD5H64OJIVZCXNQ4F5X5K7VZWEZCTA27F`
- **Red:** Stellar Testnet
- **RPC:** `https://soroban-testnet.stellar.org`

## 🎯 Funcionalidades

- ✅ Conexión con Freighter Wallet
- ✅ Modo Demo para testing
- ✅ Ver balance de tokens BDB
- ✅ Transferir tokens BDB
- ✅ Dashboard avanzado
- ✅ Historial de transacciones
- ✅ Modo oscuro/claro
- ✅ Sistema de notificaciones
- ✅ Soporte para múltiples wallets
- ✅ Interfaz responsive

## 🛠️ Desarrollo Local

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 🐳 Build con Docker

```bash
# Crear imagen
docker build -t mi-token-bdb .

# Ejecutar contenedor
docker run -p 4173:4173 mi-token-bdb
```

## 📁 Estructura del Proyecto

```
mi-token-bdb/
├── src/                    # Código fuente React
│   ├── App.tsx            # Componente principal
│   └── main.tsx           # Entry point
├── contracts/              # Contratos Rust
│   └── buen_dia_token/    # Tu contrato BDB
├── dist/                  # Build de producción (para deploy)
├── public/                # Archivos estáticos
├── .env                   # Variables de entorno
├── package.json           # Dependencias
└── vite.config.ts         # Configuración de Vite
```

## 🦈 ¡Tu DApp está lista para el mundo!

Construida con ❤️ por Alonso Florencia usando Stellar + React + TypeScript
