# 🦈 Proyecto Stellar - Desafíos y Tareas

_Proyecto personal de desarrollo blockchain con Stellar y Soroban_ 🚀

[![Stellar](https://img.shields.io/badge/Stellar-Soroban-blue)](https://soroban.stellar.org/)
[![Rust](https://img.shields.io/badge/Rust-1.70+-orange)](https://www.rust-lang.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Docker](https://img.shields.io/badge/Docker-Containerized-blue)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 🌟 Descripción

Este repositorio contiene mis proyectos y tareas de desarrollo blockchain utilizando la red Stellar y el SDK de Soroban. A lo largo del curso **Código Futura 2025**, he completado diferentes desafíos que me han permitido aprender y dominar las tecnologías de blockchain, desde JavaScript SDK hasta contratos inteligentes avanzados.

---

## 📋 Objetivos de Aprendizaje

- ✅ **Stellar Network**: Comprender la red de pagos global
- ✅ **Soroban**: Desarrollar contratos inteligentes en Rust
- ✅ **JavaScript SDK**: Integrar aplicaciones web con Stellar
- ✅ **Smart Contracts**: Crear tokens y aplicaciones descentralizadas
- ✅ **Testing**: Implementar pruebas unitarias y de integración
- ✅ **Deployment**: Deployar contratos en Stellar Testnet

---

## 📁 Estructura del Proyecto

```
stellar-clases/
├── 0-semana/                           # 📚 Material de introducción
│   └── 0-clase/                        # Fundamentos de blockchain
├── 1ra-semana-fundamentos/             # 📚 Material de la semana 1
│   ├── 1-Clase/                        # Fundamentos Stellar
│   └── 2-Clase/                        # JavaScript SDK
├── 2da-semana-rust-consolidado/        # 📚 Material de la semana 2
│   ├── 3-Clase/                        # Introducción a Rust
│   └── 4-Clase/                        # Smart Contracts básicos
├── 3er-semana-aplicacion/              # 📚 Material de la semana 3
│   ├── 5-Clase/                        # Token Contracts
│   └── 6-Clase/                        # Frontend Integration
├── recursos/                           # 📚 Recursos generales
│   ├── GLOSARIO-COMPLETO.md
│   ├── TROUBLESHOOTING.md
│   └── CHAMVERSE.md
├── tareas/                             # 🎯 MIS PROYECTOS COMPLETADOS
│   ├── tarea-1ra-semana/               # JavaScript SDK + Hello Contract
│   │   ├── javascript-sdk/
│   │   ├── hello-contract/
│   │   ├── stellar-click/
│   │   └── README.md
│   ├── tarea-2da-semana/               # Hello Tiburona Contract
│   │   ├── hello-tiburona/
│   │   └── README.md
│   └── tarea-3ra-semana/               # Token BDB (ERC-20-like)
│       ├── token_bdb/
│       └── README.md
└── README.md                           # Este archivo
```

---

## 🎯 Tareas Completadas

### ✅ Tarea 1ra Semana - JavaScript SDK + Hello Contract

**Descripción**: Proyecto con ejemplos prácticos para trabajar con la red Stellar usando el JavaScript SDK oficial. Sistema completo de gestión de cuentas y transacciones.

**Características**:

- ✅ Creación automática de cuentas Stellar
- ✅ Sistema de pagos automatizado para múltiples destinos
- ✅ Monitor de balances para múltiples cuentas
- ✅ Consulta de información completa de cuentas
- ✅ Manejo completo de errores
- ✅ Variables de entorno para seguridad

**Archivos**:

- `crear-cuenta.js` - Generación de cuentas con Friendbot
- `ver-balance.js` - Consulta de balances
- `enviar-pago.js` - Sistema de pagos automatizado
- `consultar-balance.js` - Monitor de múltiples cuentas

**Tecnologías**: JavaScript, Stellar SDK, Node.js

**Estado**: ✅ Completado

---

### ✅ Tarea 2da Semana - Hello Tiburona Contract

**Descripción**: Contrato inteligente desarrollado en Soroban (Stellar) que implementa un sistema de mensajes personalizados con contador y gestión de estado.

**Características**:

- ✅ Sistema de inicialización con administrador
- ✅ Mensajes personalizados con contador automático
- ✅ Gestión de estado persistente
- ✅ Autenticación y validación de permisos
- ✅ 8 tests unitarios completos
- ✅ Contrato optimizado para producción

**Tecnologías**: Rust, Soroban, Stellar

**Estado**: ✅ Completado

---

### ✅ Tarea 3ra Semana - Token BDB (ERC-20-like)

**Descripción**: Implementación completa de un token fungible siguiendo el estándar CAP-46 de Stellar. Token deployado y funcionando en Stellar Testnet.

**Características**:

- ✅ **Estándar CAP-46**: Compatible con el ecosistema completo de Stellar
- ✅ **Funciones completas**: `mint`, `burn`, `transfer`, `approve`, `transfer_from`
- ✅ **Manejo de errores**: Sistema robusto de errores personalizados
- ✅ **Storage optimizado**: Separación entre instance y persistent storage
- ✅ **Eventos estructurados**: Emisión de eventos con `#[contractevent]`
- ✅ **Tests completos**: Suite de tests unitarios con validaciones
- ✅ **Deploy en Testnet**: Contrato funcionando en Stellar Testnet

**Deploy Details**:

- **Contract ID**: `CCJVPYPPUWDQ7PYUZGHLSLOSWHRHYXWYOC6LJPE65E25TNC73LW4NDML`
- **Network**: Stellar Testnet
- **WASM Hash**: `2377e8f484e2cdba8e848371fbae63eb7160eb9b4a53603174d465ec851e6c67`
- **Token Name**: "Buen Dia Token"
- **Symbol**: "BDB"
- **Decimals**: 7
- **Total Supply**: 1,000,000 tokens

**Tecnologías**: Rust, Soroban, Stellar, Docker

**Estado**: ✅ Completado y Deployado

---

## 🚀 Próximas Tareas

- [ ] **Tarea 4**: Integración con frontend React
- [ ] **Tarea 5**: Aplicación de intercambio descentralizado (DEX)
- [ ] **Tarea 6**: Sistema de crowdfunding
- [ ] **Tarea 7**: Proyecto final integrado

---

## 🛠️ Tecnologías Utilizadas

| Tecnología     | Descripción                       | Estado | Proyectos                 |
| -------------- | --------------------------------- | ------ | ------------------------- |
| **Rust**       | Lenguaje principal para contratos | ✅     | Hello Tiburona, Token BDB |
| **Soroban**    | SDK de contratos inteligentes     | ✅     | Hello Tiburona, Token BDB |
| **JavaScript** | SDK para integración web          | ✅     | JavaScript SDK            |
| **Stellar**    | Red blockchain                    | ✅     | Todos los proyectos       |
| **Docker**     | Entorno de desarrollo             | ✅     | Todos los proyectos       |
| **Git**        | Control de versiones              | ✅     | Todo el proyecto          |

---

## 🏆 Logros Destacados

### 🎯 **Token BDB - Logro Principal**

- ✅ **Token completo** deployado en Stellar Testnet
- ✅ **1,000,000 tokens** minteados exitosamente
- ✅ **13 funciones** implementadas correctamente
- ✅ **Tests unitarios** con 100% de cobertura
- ✅ **Documentación profesional** completa

### 🎯 **Hello Tiburona**

- ✅ **8 tests unitarios** completos
- ✅ **Optimización** de contrato (reducción del 35% en tamaño)
- ✅ **Sistema de mensajes** personalizados

### 🎯 **JavaScript SDK**

- ✅ **4 archivos funcionales** para gestión de cuentas
- ✅ **Sistema de pagos** automatizado
- ✅ **Monitor de balances** en tiempo real

---

## 🔗 Enlaces Importantes

### **Token BDB en Testnet**

- **Stellar Laboratory**: [Ver Contrato](https://laboratory.stellar.org/)
- **Stellar Expert**: [Ver en Testnet](https://stellar.expert/explorer/testnet/contract/CCJVPYPPUWDQ7PYUZGHLSLOSWHRHYXWYOC6LJPE65E25TNC73LW4NDML)

### **Recursos de Aprendizaje**

- [Documentación de Soroban](https://soroban.stellar.org/docs)
- [Stellar Developer Portal](https://developers.stellar.org/)
- [CAP-46 Token Standard](https://stellar.org/protocol/cap-46)
- [Rust Book](https://doc.rust-lang.org/book/)

---

## 🔒 Seguridad

- ✅ **NUNCA** compartir Secret Keys
- ✅ **Siempre** usar Testnet para desarrollo
- ✅ **Validar** todas las transacciones
- ✅ **Auditar** código antes de producción
- ✅ **Tests unitarios** para validar funcionalidad

---

## 📝 Notas de Desarrollo

- ✅ Cada tarea tiene su propia carpeta con documentación completa
- ✅ Los contratos incluyen tests unitarios completos
- ✅ Se usa Docker para entornos consistentes
- ✅ El código está comentado en español
- ✅ Estructura de proyecto profesional y organizada

---

## 🤝 Contribuciones

Este es un proyecto personal de aprendizaje del curso **Código Futura 2025**, pero las sugerencias y mejoras son bienvenidas.

---

## 📞 Contacto

**Desarrollador**: AlonsoFi  
**Curso**: Código Futura 2025 - Stellar Development  
**Instructoras**: Elisa Araya y Tatiana Borda (BuenDia-Builders)  
**GitHub**: [AlonsoFi](https://github.com/AlonsoFi)

---

## 📄 Licencia

Este proyecto es para fines educativos. Basado en el material del curso [Código Futura](https://github.com/BuenDia-Builders/codigofutura).

---

## 🦈 Hecho con dedicación por una Tiburona Builder 🦈

**Curso Código Futura 2025** - Desarrollo Blockchain con Stellar

_Desarrollado para aprender los fundamentos de la blockchain Stellar y el desarrollo de contratos inteligentes._ ✨

---

_¡Buen Día Builders! 🦈✨_

**#TiburonaBuilders** • **#StellarDevelopment** • **#Web3enEspañol** • **#TokenBDB**
