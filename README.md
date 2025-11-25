# SmartStore – Éxito pero más avanzado

Tienda online moderna con autenticación multifactor (MFA), búsqueda inteligente, carrito tipo sidebar, chat en vivo y pipeline DevSecOps completo (+0.3 bonificación garantizada).

## Product Backlog – Sprint Final (12 HU)

| ID   | Como…          | Quiero…                                               | Para…                                      | Prioridad |
|------|----------------|-------------------------------------------------------|--------------------------------------------|-----------|
| HU01 | usuario        | registrarme con email, contraseña y rol              | crear mi cuenta                            | Must      |
| HU02 | usuario        | login con autenticación multifactor (TOTP + QR)       | máxima seguridad                           | Must      |
| HU03 | cliente        | buscar productos con filtros (precio, marca, color)   | encontrar rápido lo que necesito           | Must      |
| HU04 | cliente        | ver detalle de producto con galería y reviews         | decidir compra                             | Must      |
| HU05 | cliente        | agregar al carrito desde cualquier página             | comprar fácil                              | Must      |
| HU06 | cliente        | ver carrito como sidebar sin recargar página          | experiencia moderna                        | Must      |
| HU07 | cliente        | hacer checkout en 3 pasos                             | finalizar compra rápido                    | Must      |
| HU08 | cliente        | chatear en vivo con soporte (Socket.io)               | resolver dudas al instante                 | Should    |
| HU09 | cliente        | ver recomendaciones personalizadas                   | descubrir productos relevantes             | Should    |
| HU10 | admin          | gestionar productos (CRUD completo)                   | mantener catálogo actualizado              | Should    |
| HU11 | sistema        | pipeline CI/CD completo + CodeQL + deploy automático | obtener la bonificación +0.3               | Must      |
| HU12 | sistema        | documentación viva (DER + BPMN + mockups en PDF)      | cumplir 100 % los requisitos del proyecto  | Must      |

## Estado del pipeline 

[![CI/CD Pipeline](https://github.com/Univalluno/smartstore/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/Univalluno/smartstore/actions/workflows/ci-cd.yml)
[![CodeQL Security](https://github.com/Univalluno/smartstore/actions/workflows/codeql.yml/badge.svg)](https://github.com/Univalluno/smartstore/actions/workflows/codeql.yml)

## Descripción del commit 
