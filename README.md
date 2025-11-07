# smartstore
# SmartStore - Proyecto #3: Desarrollo de Software 2 (Universidad del Valle)

**Equipo:** [Tus nombres: Univalleño, Jerson, Santiago, Esteban]  
**Sprint 3: CI/CD Completo**  
**Fecha:** 7 de noviembre de 2025  

## Descripción
Aplicación de e-commerce con autenticación, productos y carrito. Implementado con **Scrum + DevOps** (CI/CD, pruebas, releases automáticos).

## Stack Tecnológico
- **Frontend:** React/Vite (o tu stack)
- **Backend:** Node/Express (o tu stack)
- **DB:** [Tu DB]
- **CI/CD:** GitHub Actions

## CI/CD IMPLEMENTADO
Pipeline completo en `.github/workflows/ci-cd.yml`:

- **CI:** `npm install`, `npm test` (Jest), `npm run build`
- **CD:** Release automático en ramas `release/*` + artifact (`smartstore-build.zip`)

### EVIDENCIA
| Evidencia | Enlace |
|---------|--------|
| PR #2 mergeado (CI/CD) | [Ver PR](https://github.com/Univalluno/smartstore/pull/2) |
| Release v0.1.0 con artifact | [Ver Release](https://github.com/Univalluno/smartstore/releases/tag/v0.1.0) |
| Pipeline verde | [Ver Actions](https://github.com/Univalluno/smartstore/actions) |

### REQUISITOS CUMPLIDOS (100%)
| Requisito | Estado | Evidencia |
|---------|--------|---------|
| Ramas protegidas | Done | [Settings → Branches](https://github.com/Univalluno/smartstore/settings/branches) |
| CI en push/PR | Done | Pipeline en PR #2 |
| Pruebas automáticas | Done | `src/__tests__/health.test.js` |
| Build + artifact | Done | Artifact en release |
| CD: release automático | Done | v0.1.0 creado |
| Conventional Commits | Done | Commits con `feat:`, `test:`, etc. |
| Revisión de PR | Done | Aprobado por @PacmanLloron |

## Instalación y Uso
1. `git clone https://github.com/Univalluno/smartstore.git`
2. `npm install`
3. `npm test` (pruebas)
4. `npm run build` (build)
5. `npm start` (dev)

## Badges
![CI/CD](https://github.com/Univalluno/smartstore/actions/workflows/ci-cd.yml/badge.svg)  
![Release](https://img.shields.io/github/v/release/Univalluno/smartstore)

---

**¡ENTREGA 100% CUMPLIDA!**  
SmartStore listo para producción. Para más detalles, ver [Confluence (cuando vuelva)](https://tu-universidad.atlassian.net/wiki).

---
