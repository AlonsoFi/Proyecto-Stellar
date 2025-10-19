# Hello Tiburona Profesional

## Descripción

Contrato inteligente desarrollado en Soroban (Stellar) que implementa un sistema de mensajes personalizados con contador y gestión de estado. Este proyecto demuestra las capacidades de desarrollo de contratos inteligentes en la red Stellar utilizando el SDK de Soroban.

## Características Principales

- **Sistema de inicialización**: Configuración segura con administrador designado
- **Mensajes personalizados**: Generación de mensajes únicos con contador automático
- **Gestión de estado**: Almacenamiento persistente de datos del contrato
- **Autenticación**: Validación de permisos para operaciones sensibles
- **Testing completo**: 8 tests unitarios que validan toda la funcionalidad
- **Optimización**: Contrato compilado y optimizado para producción

## Estructura del Proyecto

```
hello-tiburona/
├── contracts/
│   └── hello-world/
│       ├── src/
│       │   ├── lib.rs          # Lógica principal del contrato
│       │   └── test.rs         # Suite de tests unitarios
│       ├── Cargo.toml          # Configuración de dependencias
│       └── Makefile            # Scripts de compilación
├── Cargo.toml                  # Configuración del workspace
└── README.md                   # Documentación del proyecto
```

## Instalación

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

## Ejecución de Tests

### Método Local

```bash
cd contracts/hello-world
cargo test
```

### Método Docker (Recomendado)

```bash
docker run --rm -v ${PWD}:/workspace -w /workspace rust:latest bash -c "
source /usr/local/cargo/env &&
cargo test
"
```

## Resultados de Tests

```
running 8 tests
test test_hello ... ok
test test_hello_multiple ... ok
test test_get_contador ... ok
test test_get_ultimo_saludo ... ok
test test_initialize ... ok
test test_no_reinicializar ... ok
test test_reset_contador ... ok
test test_reset_contador_no_admin ... ok

test result: ok. 8 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out
```

## Compilación del Contrato

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

## Resultados de Optimización

- **Tamaño original**: ~1.2MB
- **Tamaño optimizado**: ~780KB
- **Reducción de tamaño**: 35%
- **Archivo de salida**: `hello_world.optimized.wasm`

## API del Contrato

### `initialize(admin: Address)`

- Inicializa el contrato con un administrador
- Solo se puede ejecutar una vez
- Establece el contador en 0

### `hello(usuario: Address, nombre: String) -> Symbol`

- Genera un mensaje personalizado
- Incrementa el contador automáticamente
- Almacena el último mensaje
- Requiere autenticación del usuario

### `get_contador() -> u32`

- Retorna el valor actual del contador

### `get_ultimo_saludo() -> String`

- Retorna el último mensaje generado

### `reset_contador(admin: Address)`

- Reinicia el contador a 0
- Solo el administrador puede ejecutarlo

## Suite de Tests

1. **test_initialize**: Verifica inicialización correcta
2. **test_no_reinicializar**: Previene reinicialización
3. **test_hello**: Prueba funcionalidad básica de mensaje
4. **test_hello_multiple**: Verifica incremento de contador
5. **test_get_contador**: Verifica lectura del contador
6. **test_get_ultimo_saludo**: Verifica almacenamiento de mensaje
7. **test_reset_contador**: Verifica reset por administrador
8. **test_reset_contador_no_admin**: Previene reset no autorizado

## Solución de Problemas

### Error: "Rust installation issues"

**Solución**: Usar Docker para entorno aislado

```bash
docker run --rm -v ${PWD}:/workspace -w /workspace rust:latest bash -c "
source /usr/local/cargo/env &&
cargo test
"
```

### Error: "Missing system dependencies"

**Solución**: Instalar dependencias en Docker

```bash
docker run --rm -v ${PWD}:/workspace -w /workspace rust:latest bash -c "
apt update && apt install -y build-essential pkg-config libdbus-1-dev libudev-dev libssl-dev libcurl4-openssl-dev zlib1g-dev libc6-dev linux-libc-dev g++ libstdc++-dev &&
source /usr/local/cargo/env &&
cargo install --locked soroban-cli &&
cargo test
"
```

## Recursos Adicionales

- [Documentación de Soroban](https://soroban.stellar.org/docs)
- [Guía de desarrollo de contratos](https://soroban.stellar.org/docs/getting-started/hello-world)
- [Stellar Developer Portal](https://developers.stellar.org/)

## Información del Proyecto

**Desarrollado como parte de la Clase 4 - Stellar Development**

Este proyecto forma parte de un programa educativo de desarrollo blockchain, demostrando las capacidades de desarrollo de contratos inteligentes en la red Stellar utilizando el SDK de Soroban.
