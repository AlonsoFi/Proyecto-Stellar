#![cfg(test)]

use super::*;
use soroban_sdk::{Env, String, Symbol, testutils::Address};

#[test]
fn test_initialize() {
    let env = Env::default();
    let contract_id = env.register(HelloContract, ());
    let client = HelloContractClient::new(&env, &contract_id);
    
    let admin = <soroban_sdk::Address as Address>::generate(&env);
    
    // Primera inicialización debe funcionar
    client.initialize(&admin);
    
    // Verificar contador en 0
    assert_eq!(client.get_contador(), 0);
}

#[test]
    #[should_panic(expected = "Error(Contract, #4)")]
fn test_no_reinicializar() {
    let env = Env::default();
    let contract_id = env.register(HelloContract, ());
    let client = HelloContractClient::new(&env, &contract_id);
    
    let admin = <soroban_sdk::Address as Address>::generate(&env);
    
    client.initialize(&admin);
    client.initialize(&admin);  // Segunda vez debe fallar
}

#[test]
fn test_hello_exitoso() {
    let env = Env::default();
    let contract_id = env.register(HelloContract, ());
    let client = HelloContractClient::new(&env, &contract_id);
    
    let admin = <soroban_sdk::Address as Address>::generate(&env);
    let usuario = <soroban_sdk::Address as Address>::generate(&env);
    
    client.initialize(&admin);
    
    let nombre = String::from_str(&env, "Ana");
    let resultado = client.hello(&usuario, &nombre);
    
    assert_eq!(resultado, Symbol::new(&env, "Hola"));
    assert_eq!(client.get_contador(), 1);
    assert_eq!(client.get_ultimo_saludo(&usuario), Some(nombre));
}

#[test]
    #[should_panic(expected = "Error(Contract, #1)")]
fn test_nombre_vacio() {
    let env = Env::default();
    let contract_id = env.register(HelloContract, ());
    let client = HelloContractClient::new(&env, &contract_id);
    
    let admin = <soroban_sdk::Address as Address>::generate(&env);
    let usuario = <soroban_sdk::Address as Address>::generate(&env);
    
    client.initialize(&admin);
    
    let vacio = String::from_str(&env, "");
    client.hello(&usuario, &vacio);  // Debe fallar
}

#[test]
#[should_panic(expected = "NombreMuyLargo")]
fn test_nombre_muy_largo() {
    let env = Env::default();
    let contract_id = env.register(HelloContract, ());
    let client = HelloContractClient::new(&env, &contract_id);
    
    let admin = <soroban_sdk::Address as Address>::generate(&env);
    let usuario = <soroban_sdk::Address as Address>::generate(&env);
    
    client.initialize(&admin);
    
    // Crear un nombre de más de 32 caracteres
    let nombre_largo = String::from_str(&env, "EsteEsUnNombreMuyLargoQueExcedeLos32CaracteresPermitidos");
    client.hello(&usuario, &nombre_largo);  // Debe fallar
}

#[test]
fn test_reset_solo_admin() {
    let env = Env::default();
    let contract_id = env.register(HelloContract, ());
    let client = HelloContractClient::new(&env, &contract_id);
    
    let admin = <soroban_sdk::Address as Address>::generate(&env);
    let otro = <soroban_sdk::Address as Address>::generate(&env);
    let usuario = <soroban_sdk::Address as Address>::generate(&env);
    
    client.initialize(&admin);
    
    // Hacer saludos
    client.hello(&usuario, &String::from_str(&env, "Test"));
    assert_eq!(client.get_contador(), 1);
    
    // Admin puede resetear
    client.reset_contador(&admin);
    assert_eq!(client.get_contador(), 0);
}

#[test]
    #[should_panic(expected = "Error(Contract, #3)")]
fn test_reset_no_autorizado() {
    let env = Env::default();
    let contract_id = env.register(HelloContract, ());
    let client = HelloContractClient::new(&env, &contract_id);
    
    let admin = <soroban_sdk::Address as Address>::generate(&env);
    let otro = <soroban_sdk::Address as Address>::generate(&env);
    
    client.initialize(&admin);
    
    // Otro usuario intenta resetear
    client.reset_contador(&otro);  // Debe fallar
}

#[test]
fn test_multiple_usuarios() {
    let env = Env::default();
    let contract_id = env.register(HelloContract, ());
    let client = HelloContractClient::new(&env, &contract_id);
    
    let admin = <soroban_sdk::Address as Address>::generate(&env);
    let usuario1 = <soroban_sdk::Address as Address>::generate(&env);
    let usuario2 = <soroban_sdk::Address as Address>::generate(&env);
    
    client.initialize(&admin);
    
    // Usuario 1 saluda
    let nombre1 = String::from_str(&env, "Ana");
    client.hello(&usuario1, &nombre1);
    assert_eq!(client.get_contador(), 1);
    assert_eq!(client.get_ultimo_saludo(&usuario1), Some(nombre1));
    
    // Usuario 2 saluda
    let nombre2 = String::from_str(&env, "Bob");
    client.hello(&usuario2, &nombre2);
    assert_eq!(client.get_contador(), 2);
    assert_eq!(client.get_ultimo_saludo(&usuario2), Some(nombre2));
    
    // Verificar que cada usuario mantiene su último saludo
    assert_eq!(client.get_ultimo_saludo(&usuario1), Some(String::from_str(&env, "Ana")));
    assert_eq!(client.get_ultimo_saludo(&usuario2), Some(String::from_str(&env, "Bob")));
}