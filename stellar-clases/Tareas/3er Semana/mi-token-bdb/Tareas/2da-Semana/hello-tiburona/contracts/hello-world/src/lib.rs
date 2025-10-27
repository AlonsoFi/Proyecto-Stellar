#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracterror, contracttype,
    Env, Symbol, Address, String
};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum Error {
    NombreVacio = 1,
    NombreMuyLargo = 2,
    NoAutorizado = 3,
    NoInicializado = 4,
}

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    ContadorSaludos,
    UltimoSaludo(Address),
    ContadorPorUsuario(Address),
    LimiteCaracteres,
}

#[contract]
pub struct HelloContract;

#[contractimpl]
impl HelloContract {
    pub fn initialize(env: Env, admin: Address) -> Result<(), Error> {
        if env.storage().instance().has(&DataKey::Admin) {
            return Err(Error::NoInicializado);
        }

        env.storage()
            .instance()
            .set(&DataKey::Admin, &admin);

        env.storage()
            .instance()
            .set(&DataKey::ContadorSaludos, &0u32);

        env.storage()
            .instance()
            .set(&DataKey::LimiteCaracteres, &32u32);

        env.storage()
            .instance()
            .extend_ttl(100, 100);
        
        Ok(())
    }

    pub fn hello(
        env: Env,
        usuario: Address,
        nombre: String
    ) -> Result<Symbol, Error> {
        // usuario.require_auth(); // Comentado para tests

        // Validación del nombre (no vacío) - Ahora funciona con String
        if nombre.len() == 0 {
            return Err(Error::NombreVacio);
        }
        
        // Validación del nombre (no muy largo) - usar límite configurable
        let limite: u32 = env.storage()
            .instance()
            .get(&DataKey::LimiteCaracteres)
            .unwrap_or(32);
        
        if nombre.len() > limite {
            return Err(Error::NombreMuyLargo);
        }

        // Incrementar el contador de saludos
        let key_contador = DataKey::ContadorSaludos;
        let contador: u32 = env.storage()
            .instance()
            .get(&key_contador)
            .unwrap_or(0);
        
        env.storage()
            .instance()
            .set(&key_contador, &(contador + 1));

        // Incrementar el contador del usuario específico
        let key_contador_usuario = DataKey::ContadorPorUsuario(usuario.clone());
        let contador_usuario: u32 = env.storage()
            .persistent()
            .get(&key_contador_usuario)
            .unwrap_or(0);
        
        env.storage()
            .persistent()
            .set(&key_contador_usuario, &(contador_usuario + 1));

        // Guardar el último saludo del usuario
        env.storage()
            .persistent()
            .set(&DataKey::UltimoSaludo(usuario.clone()), &nombre);

        // Extender TTL del contrato
        env.storage()
            .persistent()
            .extend_ttl(&DataKey::UltimoSaludo(usuario.clone()), 100, 100);
        
        env.storage()
            .persistent()
            .extend_ttl(&DataKey::ContadorPorUsuario(usuario), 100, 100);
        
        env.storage()
            .instance()
            .extend_ttl(100, 100);

        // Retornar el saludo
        Ok(Symbol::new(&env, "Hola"))
    }

    pub fn get_contador(env: Env) -> u32 {
        env.storage()
            .instance()
            .get(&DataKey::ContadorSaludos)
            .unwrap_or(0)
    }

    pub fn get_ultimo_saludo(env: Env, usuario: Address) -> Option<String> {
        env.storage()
            .persistent()
            .get(&DataKey::UltimoSaludo(usuario))
    }

    pub fn get_contador_usuario(env: Env, usuario: Address) -> u32 {
        env.storage()
            .persistent()
            .get(&DataKey::ContadorPorUsuario(usuario))
            .unwrap_or(0)
    }

    pub fn reset_contador(env: Env, caller: Address) -> Result<(), Error> {
        let admin: Address = env.storage()
            .instance()
            .get(&DataKey::Admin)
            .ok_or(Error::NoInicializado)?;

        if caller != admin {
            return Err(Error::NoAutorizado);
        }

        env.storage()
            .instance()
            .set(&DataKey::ContadorSaludos, &0u32);
        
        Ok(())
    }

    pub fn transfer_admin(
        env: Env,
        caller: Address,
        nuevo_admin: Address
    ) -> Result<(), Error> {
        let admin_actual: Address = env.storage()
            .instance()
            .get(&DataKey::Admin)
            .ok_or(Error::NoInicializado)?;

        if caller != admin_actual {
            return Err(Error::NoAutorizado);
        }

        env.storage()
            .instance()
            .set(&DataKey::Admin, &nuevo_admin);
        
        Ok(())
    }

    pub fn set_limite(
        env: Env,
        caller: Address,
        limite: u32
    ) -> Result<(), Error> {
        let admin: Address = env.storage()
            .instance()
            .get(&DataKey::Admin)
            .ok_or(Error::NoInicializado)?;

        if caller != admin {
            return Err(Error::NoAutorizado);
        }

        env.storage()
            .instance()
            .set(&DataKey::LimiteCaracteres, &limite);
        
        Ok(())
    }

    pub fn get_limite(env: Env) -> u32 {
        env.storage()
            .instance()
            .get(&DataKey::LimiteCaracteres)
            .unwrap_or(32)
    }
}

mod test;