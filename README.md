# Registro de Ventas · App

![Registro de Ventas · App — Solana, TypeScript y React](./images/banner-app.png)

Frontend educativo desarrollado con **TypeScript y React** para interactuar con el programa [Registro de Ventas con PDAs](https://github.com/WayLearnLatam/Registro-Ventas-Solana-PDA) en **Solana Devnet**.

Esta copia de trabajo publica una versión base reproducible del material del **Solana Engineering Track: Advanced** de [WayLearn](https://github.com/WayLearnLatam/Registro-Ventas-Solana-App). Aquí se conectan cuentas, instrucciones y PDAs con una aplicación que se utiliza desde el navegador.

> 📖 Sigue las explicaciones y actividades en el [GitBook de Advanced](https://waylearn.gitbook.io/solana-engineering-track-advanced).

**Red configurada:** Solana **Devnet** (`https://api.devnet.solana.com` por defecto; opcionalmente `VITE_SOLANA_RPC_URL` según `.env.example`). El IDL incluido es de **referencia** (`esReferencia: true`): puedes conectar la wallet y consultar saldos; las escrituras on-chain quedan bloqueadas hasta importar el IDL de tu despliegue.

## ¿Qué puedes hacer con la app?

- Conectar una wallet y consultar saldos de Devnet.
- Consultar un registro de ventas, sus clientes y las ventas activas de cada uno.
- Crear un negocio y dar de alta a sus clientes.
- Registrar ventas, corregir su importe y realizar devoluciones.
- Revisar solicitudes de firma, confirmaciones y errores de las transacciones.

El recorrido del proyecto sigue esta relación:

**Registro del negocio → Clientes → Ventas**

Cada entidad tiene su propia cuenta. El frontend deriva sus direcciones y utiliza el cliente generado a partir del IDL para leer datos y construir instrucciones.

> ℹ️ El importe de una venta es un dato del ejercicio: **no cobra ni transfiere SOL o tokens**. La devolución elimina la venta del historial activo y cierra su cuenta; no realiza un reembolso comercial.

## Antes de comenzar

Necesitas una cuenta de GitHub y, para las operaciones que requieren firma, una wallet de navegador compatible con Solana y SOL de prueba en **Devnet**.

Es recomendable tener conocimientos básicos de JavaScript o TypeScript y haber revisado el modelo de cuentas del [programa base](https://github.com/WayLearnLatam/Registro-Ventas-Solana-PDA).

**No necesitas la Solana CLI para ejecutar este frontend.** Puedes trabajar con el programa desplegado desde Solana Playground.

## Requisitos

- **Node.js** `>=22.12.0` y `<25` (ver `.nvmrc`)
- **npm** (el repositorio incluye `package-lock.json`; usa `npm ci`)
- Wallet de navegador compatible con Solana y SOL de prueba en **Devnet** (solo para firmas reales)
- Opcional: Docker + extensión Dev Containers / GitHub Codespaces

## Ejecutar en tu computadora

```bash
git clone https://github.com/jpgsChile/bootcamp-solana.git
cd bootcamp-solana
npm ci
npm run cliente
npm run dev
```

Abre `http://localhost:5173` en el navegador con tu wallet instalada.

### Comandos útiles

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo (Vite, puerto 5173). |
| `npm run verificar` | Typecheck + tests + build. |
| `npm run typecheck` | Comprueba TypeScript. |
| `npm test` | Pruebas automatizadas (sin enviar transacciones). |
| `npm run build` | Build de producción. |
| `npm run configurar:idl -- <idl.json>` | Importa el IDL de tu despliegue en Devnet. |

En Windows puedes ejecutar estos comandos desde WSL. El repositorio también incluye una configuración de Dev Container para VS Code.

### Codespaces

Desde este repositorio: **Code → Codespaces → Create codespace on main**. El contenedor incluye Node 22. Luego ejecuta `npm run dev` y abre el puerto **5173** en una pestaña normal del navegador (la vista incrustada puede no detectar la wallet).

## Conectar el programa de Solana

El frontend y el programa son dos partes del mismo proyecto:

| Parte | Responsabilidad |
| --- | --- |
| [Programa Rust + Anchor](https://github.com/WayLearnLatam/Registro-Ventas-Solana-PDA) | Define las cuentas, ejecuta instrucciones y valida permisos. |
| Este frontend | Lee cuentas, construye instrucciones y solicita a la wallet que firme las transacciones. |
| IDL y cliente generado | Describen la interfaz del programa y permiten utilizarla desde TypeScript. |

### Si aparece «programa de referencia»

El repositorio incluye un **IDL de referencia** para estudiar la estructura y generar el cliente. Con esa configuración puedes conectar tu wallet y consultar saldos; la consulta del registro y sus operaciones permanecen bloqueadas hasta importar el IDL del despliegue que utilizarás.

Si la versión de clase ya viene configurada para el programa correspondiente, puedes continuar con las actividades sin repetir este paso.

### Importar tu IDL

Exporta desde Playground el IDL del programa que realmente compilaste y desplegaste en **Devnet**. Coloca el JSON dentro de tu espacio de trabajo, por ejemplo en `tmp-idl/registro.json`, y ejecuta desde la raíz:

```bash
npm run configurar:idl -- ./tmp-idl/registro.json
```

Si el archivo no incluye la dirección del programa, agrega su Program ID público:

```bash
npm run configurar:idl -- ./tmp-idl/registro.json --program-id TU_PROGRAM_ID
```

El comando comprueba la estructura esperada, importa el IDL y regenera el cliente. Detén el servidor con `Ctrl+C` y vuelve a ejecutar `npm run dev` después de la importación.

**No edites manualmente el cliente generado.** Si cambias el IDL, ejecuta `npm run cliente`. Conserva juntos en tu repositorio `idl.json`, `src/config/programa.json` y `clients/js/`.

> 🔎 La wallet de Playground y la del navegador pueden ser distintas. Como la autoridad participa en la PDA, lo más sencillo es crear un negocio nuevo desde la app con la wallet del navegador. No necesitas trasladar claves privadas entre entornos.

Consulta la [guía de IDL y Playground](./docs/IDL-Y-PLAYGROUND.md) si necesitas revisar la configuración.

## Seguir las sesiones

El proyecto utiliza el mismo frontend durante ambos días. Puedes elegir el punto de partida con estos comandos:

| Comando | Qué prepara |
| --- | --- |
| `npm run clase:dia3` | Pantalla de conexión para explorar wallet, RPC, saldos e IDL. Reserva Registro para el día siguiente. |
| `npm run clase:dia4` | Pantalla del registro con dos funciones por completar: `crearCliente` y `registrarVenta`. |
| `npm run clase:resuelto` | Las cinco operaciones implementadas, como referencia para estudiar y contrastar. |

Detén `npm run dev` antes de cambiar de modo y vuelve a iniciarlo al terminar.

> **Guarda tu avance antes de cambiar de modo.** Estos comandos reemplazan `src/solana/acciones.ts`. Los cambios anteriores se respaldan en `.aula/respaldos/`; el IDL y el cliente generado se conservan. Puedes consultar la solución en `materiales/acciones-resuelto.ts.txt` sin reemplazar tu archivo.

## ¿Dónde está cada cosa?

| Ruta | Qué encontrarás |
| --- | --- |
| `src/components/` | Pantallas y formularios de la aplicación. |
| `src/solana/acciones.ts` | Funciones que conectan los formularios con las instrucciones del programa. |
| `src/solana/lecturas.ts` | Lectura de Registro, Cliente y Venta. |
| `src/solana/pdas.ts` y `seeds.ts` | Derivación de las direcciones de las cuentas. |
| `src/solana/tx.ts` | Preparación, envío, confirmación y errores de las transacciones. |
| `src/config/interfaz.ts` | Título y valores iniciales para personalizar la demo. |
| `idl.json` | IDL utilizado para generar el cliente del programa. |
| `clients/js/src/generated/` | Código generado con Codama; no se modifica a mano. |
| `materiales/` | Versión de ejercicio y solución de las operaciones. |
| `docs/` | Guías de configuración, pruebas y alcance del ejemplo. |

La base utiliza **React + Vite**, **TypeScript**, **Wallet Adapter**, **Solana Kit**, **web3.js** y **Codama**. La integración entre las librerías ya está preparada para que puedas concentrarte en el flujo de cuentas e instrucciones.

## Probar tus cambios

```bash
npm run verificar
```

Este comando comprueba TypeScript, ejecuta las pruebas automatizadas y genera el build del frontend. Las pruebas automatizadas **no envían transacciones**: completa también el recorrido de [pruebas manuales en Devnet](./docs/PRUEBAS-MANUALES.md).

Para tu primera prueba, crea un negocio, agrega un cliente, registra una venta y consulta el resultado. Después prueba corregir el importe, devolver la venta y cancelar una solicitud de firma.

## Si algo no funciona

| Situación | Qué revisar |
| --- | --- |
| La wallet no aparece | Abre la app en una pestaña normal del navegador con una extensión compatible instalada. |
| Falta SOL de prueba | Solicítalo en [Solana Faucet](https://faucet.solana.com/), seleccionando Devnet. |
| No aparece tu negocio | Comprueba el nombre exacto y la dirección de su autoridad; ambos participan en la PDA. |
| No puedes repetir un SKU | Cada cliente solo puede tener una venta activa con ese SKU. |
| El RPC responde con un límite de uso | Espera y vuelve a intentar, o configura otro endpoint de Devnet en `.env.local` siguiendo `.env.example`. |
| Cambiaste el IDL y falla la comprobación | Ejecuta `npm run cliente` y reinicia el servidor. |

## Cómo probar el flujo de registro de ventas

1. `npm run verificar` en local (no envía transacciones).
2. `npm run dev` y conecta tu wallet en Devnet.
3. Con el IDL de referencia solo verás saldos y la aviso de programa de referencia.
4. Importa el IDL de tu programa desplegado en Devnet (`npm run configurar:idl`) para habilitar escrituras.
5. Recorrido manual: crear negocio → cliente → venta → corregir importe → devolución. Detalle en [pruebas manuales](./docs/PRUEBAS-MANUALES.md).

**No se despliega el programa ni se envían transacciones a mainnet desde este material.**

## Recursos y comunidad

- Material original: [WayLearnLatam/Registro-Ventas-Solana-App](https://github.com/WayLearnLatam/Registro-Ventas-Solana-App).
- [GitBook de Solana Engineering Track: Advanced](https://waylearn.gitbook.io/solana-engineering-track-advanced).
- [Programa Registro de Ventas con PDAs](https://github.com/WayLearnLatam/Registro-Ventas-Solana-PDA).
- [Solana Playground](https://beta.solpg.io/).
- [Comunidad de WayLearn en Discord](https://discord.gg/hvnpbZxu9b).

## Atribución y licencia

Este repositorio reproduce el material educativo de WayLearn (Registro de Ventas · App). Se conserva la atribución al curso y a los repositorios originales. El repositorio fuente público invita a hacer **Fork** para las actividades del bootcamp; al momento de esta publicación **no declara un archivo `LICENSE`** en GitHub. Si WayLearn publica una licencia explícita más adelante, conviene alinearla aquí.

Este es un proyecto educativo para **Devnet**. Las validaciones del formulario no sustituyen las restricciones del programa. Revisa [seguridad y alcance](./docs/SEGURIDAD-Y-ALCANCE.md) para conocer los límites del ejemplo y los aspectos que deben revisarse antes de producción.
