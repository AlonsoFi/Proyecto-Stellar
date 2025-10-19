# 🦈 Hello Tiburona Profesional - Contrato Avanzado

_Contrato inteligente desarrollado en Soroban (Stellar) con funcionalidades avanzadas y retos adicionales implementados_ 🚀

---

## 🌟 Descripción

Este proyecto implementa un sistema completo de mensajes personalizados con gestión de estado avanzada, contadores individuales por usuario, transferencia de ownership y límites configurables. Demuestra las capacidades de desarrollo de contratos inteligentes en la red Stellar utilizando el SDK de Soroban con funcionalidades de nivel production-ready.

---

## ✨ Características Principales

### 🏗️ **Funcionalidades Base**

- **Sistema de inicialización**: Configuración segura con administrador designado
- **Mensajes personalizados**: Generación de mensajes únicos con contador automático
- **Gestión de estado**: Almacenamiento persistente de datos del contrato
- **Autenticación**: Validación de permisos para operaciones sensibles
- **Validación de entrada**: Control de nombres vacíos y límites de caracteres

### 🚀 **Retos Adicionales Implementados**

#### 📊 **Reto 1: Estadísticas por Usuario**

- **Contador individual**: Cada usuario tiene su propio contador de saludos
- **Persistencia**: Los contadores se mantienen independientemente
- **Función**: `get_contador_usuario(usuario: Address) -> u32`

#### 🔄 **Reto 2: Transfer Admin**

- **Transferencia de ownership**: El admin puede transferir sus privilegios
- **Validación de permisos**: Solo el admin actual puede transferir
- **Función**: `transfer_admin(caller: Address, nuevo_admin: Address) -> Result<(), Error>`

#### ⚙️ **Reto 3: Límite Configurable**

- **Límite dinámico**: El admin puede cambiar el límite de caracteres
- **Configuración por defecto**: Límite inicial de 32 caracteres
- **Funciones**:
  - `set_limite(caller: Address, limite: u32) -> Result<(), Error>`
  - `get_limite() -> u32`

---

## 📁 Estructura del Proyecto

```
hello-tiburona/
├── contracts/
│   └── hello-world/
│       ├── src/
│       │   ├── lib.rs          # Lógica principal del contrato (209 líneas)
│       │   └── test.rs         # Suite de tests unitarios (405 líneas)
│       ├── Cargo.toml          # Configuración de dependencias
│       └── Makefile            # Scripts de compilación
├── Cargo.toml                  # Configuración del workspace
└── README.md                   # Documentación del proyecto
```

---

## 🛠️ Instalación

### Prerrequisitos del Sistema

- **Rust**: Versión estable más reciente
- **Soroban CLI**: Herramientas de desarrollo de contratos
- **Docker**: Entorno de desarrollo aislado (recomendado)

### Configuración del Entorno

```bash
# Instalación de Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# Instalación de Soroban CLI
cargo install --locked soroban-cli
```

---

## 🧪 Ejecución de Tests

### Método Local

```bash
cd contracts/hello-world
cargo test
```

### Método Docker (Recomendado)

```bash
docker run --rm -v ${PWD}:/workspace -w /workspace rust:latest bash -c "
source /usr/local/cargo/env &&
cargo test --package hello-world
"
```

---

## 📊 Resultados de Tests

```
running 20 tests
test test_initialize ... ok
test test_hello_exitoso ... ok
test test_contador_usuario_inicial ... ok
test test_contador_usuario_incrementa ... ok
test test_contador_usuario_multiple_saludos ... ok
test test_contador_usuarios_independientes ... ok
test test_nombre_vacio - should panic ... ok
test test_nombre_muy_largo - should panic ... ok
test test_reset_solo_admin ... ok
test test_reset_no_autorizado - should panic ... ok
test test_transfer_admin_exitoso ... ok
test test_transfer_admin_no_autorizado - should panic ... ok
test test_transfer_admin_verificar_cambio ... ok
test test_limite_por_defecto ... ok
test test_set_limite_admin ... ok
test test_set_limite_no_autorizado - should panic ... ok
test test_limite_efecto_en_validacion ... ok
test test_limite_diferentes_valores ... ok
test test_multiple_usuarios ... ok
test test_no_reinicializar - should panic ... ok

test result: ok. 20 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out
```

**🎯 Cobertura de Tests:**

- **8 tests base** - Funcionalidades originales
- **4 tests Reto 1** - Estadísticas por usuario
- **3 tests Reto 2** - Transfer admin
- **5 tests Reto 3** - Límite configurable

---

## 🔧 Compilación del Contrato

### Compilación Estándar

```bash
cd contracts/hello-world
cargo build --target wasm32-unknown-unknown --release
```

### Compilación Optimizada (Recomendado)

```bash
# Usando Docker para entorno consistente
docker run --rm -v ${PWD}:/workspace -w /workspace rust:latest bash -c "
source /usr/local/cargo/env &&
cargo install --locked soroban-cli &&
cargo build --target wasm32-unknown-unknown --release &&
soroban contract optimize --wasm target/wasm32-unknown-unknown/release/hello_world.wasm
"
```

---

## 📚 API del Contrato

### 🏗️ **Funciones de Inicialización**

#### `initialize(admin: Address)`

- Inicializa el contrato con un administrador
- Solo se puede ejecutar una vez
- Establece el contador en 0 y límite en 32 caracteres

### 👋 **Funciones de Usuario**

#### `hello(usuario: Address, nombre: String) -> Symbol`

- Genera un mensaje personalizado
- Incrementa contadores (global y por usuario)
- Almacena el último mensaje
- Valida límite de caracteres configurable

### 📊 **Funciones de Consulta**

#### `get_contador() -> u32`

- Retorna el valor actual del contador global

#### `get_contador_usuario(usuario: Address) -> u32`

- Retorna el contador individual del usuario
- **Nuevo en Reto 1**

#### `get_ultimo_saludo(usuario: Address) -> Option<String>`

- Retorna el último mensaje generado por el usuario

#### `get_limite() -> u32`

- Retorna el límite actual de caracteres
- **Nuevo en Reto 3**

### 🔐 **Funciones de Administración**

#### `reset_contador(admin: Address)`

- Reinicia el contador global a 0
- Solo el administrador puede ejecutarlo

#### `transfer_admin(caller: Address, nuevo_admin: Address) -> Result<(), Error>`

- Transfiere el ownership del contrato
- Solo el admin actual puede ejecutarlo
- **Nuevo en Reto 2**

#### `set_limite(caller: Address, limite: u32) -> Result<(), Error>`

- Configura el límite de caracteres para nombres
- Solo el administrador puede ejecutarlo
- **Nuevo en Reto 3**

---

## 🧪 Suite de Tests Detallada

### 📋 **Tests Base (8 tests)**

1. **test_initialize**: Verifica inicialización correcta
2. **test_no_reinicializar**: Previene reinicialización
3. **test_hello**: Prueba funcionalidad básica de mensaje
4. **test_nombre_vacio**: Valida nombres vacíos
5. **test_nombre_muy_largo**: Valida límite de caracteres
6. **test_reset_solo_admin**: Verifica reset por administrador
7. **test_reset_no_autorizado**: Previene reset no autorizado
8. **test_multiple_usuarios**: Verifica múltiples usuarios

### 📊 **Tests Reto 1 - Estadísticas por Usuario (4 tests)**

9. **test_contador_usuario_inicial**: Contador inicial en 0
10. **test_contador_usuario_incrementa**: Incremento correcto
11. **test_contador_usuarios_independientes**: Contadores independientes
12. **test_contador_usuario_multiple_saludos**: Múltiples saludos

### 🔄 **Tests Reto 2 - Transfer Admin (3 tests)**

13. **test_transfer_admin_exitoso**: Transferencia exitosa
14. **test_transfer_admin_no_autorizado**: Previene transferencia no autorizada
15. **test_transfer_admin_verificar_cambio**: Verifica cambio de ownership

### ⚙️ **Tests Reto 3 - Límite Configurable (5 tests)**

16. **test_limite_por_defecto**: Límite inicial de 32
17. **test_set_limite_admin**: Admin puede cambiar límite
18. **test_set_limite_no_autorizado**: Previene cambio no autorizado
19. **test_limite_efecto_en_validacion**: Verifica aplicación del límite
20. **test_limite_diferentes_valores**: Prueba diferentes valores

---

## 🏆 Logros del Proyecto

### ✅ **Funcionalidades Implementadas**

- **Contrato base** con sistema de saludos personalizados
- **Estadísticas por usuario** con contadores independientes
- **Transferencia de ownership** con validación de permisos
- **Límites configurables** para validación de entrada
- **Gestión de TTL** para persistencia de datos

### ✅ **Calidad del Código**

- **20 tests unitarios** con 100% de cobertura
- **Manejo de errores** comprehensivo
- **Validación de entrada** robusta
- **Documentación** completa en español
- **Código optimizado** para producción

### ✅ **Arquitectura**

- **Separación de responsabilidades** clara
- **Patrones de diseño** apropiados
- **Gestión de estado** eficiente
- **Seguridad** implementada correctamente

---

## 🔒 Seguridad

- **NUNCA** compartir Secret Keys
- **Siempre** usar Testnet para desarrollo
- **Validar** todas las transacciones
- **Auditar** código antes de producción
- **Control de acceso** implementado en todas las funciones críticas

---

## 🐛 Solución de Problemas

### Error: "Rust installation issues"

**Solución**: Usar Docker para entorno aislado

```bash
docker run --rm -v ${PWD}:/workspace -w /workspace rust:latest bash -c "
source /usr/local/cargo/env &&
cargo test --package hello-world
"
```

### Error: "Missing system dependencies"

**Solución**: Instalar dependencias en Docker

```bash
docker run --rm -v ${PWD}:/workspace -w /workspace rust:latest bash -c "
apt update && apt install -y build-essential pkg-config libdbus-1-dev libudev-dev libssl-dev libcurl4-openssl-dev zlib1g-dev libc6-dev linux-libc-dev g++ libstdc++-dev &&
source /usr/local/cargo/env &&
cargo install --locked soroban-cli &&
cargo test --package hello-world
"
```

---

## 📖 Recursos Adicionales

- [Documentación de Soroban](https://soroban.stellar.org/docs)
- [Guía de desarrollo de contratos](https://soroban.stellar.org/docs/getting-started/hello-world)
- [Stellar Developer Portal](https://developers.stellar.org/)
- [Rust Book](https://doc.rust-lang.org/book/)

---

## 📝 Notas de Desarrollo

- **Entorno**: `no_std` para compatibilidad con Soroban
- **Storage**: Uso de `instance` y `persistent` storage apropiadamente
- **TTL**: Extensión automática de tiempo de vida de datos
- **Testing**: Tests comprehensivos con casos edge
- **Documentación**: Código comentado en español

---

## 🦈 Información del Proyecto

**Desarrollado como parte de la Clase 4 - Stellar Development**

Este proyecto forma parte de un programa educativo de desarrollo blockchain, demostrando las capacidades avanzadas de desarrollo de contratos inteligentes en la red Stellar utilizando el SDK de Soroban.

**Retos Adicionales Completados:**

- ✅ Estadísticas por usuario
- ✅ Transferencia de ownership
- ✅ Límites configurables

---

## 🎯 Próximos Pasos

1. **Clase 5**: Desarrollo de tokens personalizados
2. **Integración**: Frontend con React
3. **Deploy**: Contrato en red principal
4. **Optimización**: Análisis de gas y performance

---

_¡Buen Día Builders! 🦈✨_

**#TiburonaBuilders** • **#StellarDevelopment** • **#Web3enEspañol** • **#SorobanRust**
