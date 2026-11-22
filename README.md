# Registro de ventas · Pablo Guzmán

![Registro de Ventas · App — Solana, TypeScript y React](./images/banner-app.png)

Aplicación educativa en **Solana Devnet** (TypeScript + React) para operar el programa de registro de ventas con PDAs.

- **Programa de esta app:** [jpgsChile/solana-registro-ventas-program](https://github.com/jpgsChile/solana-registro-ventas-program) (Program ID `C2dJeFBUGCgjgWdzh28tJZ6dPTmXAiVfod3DBhPy7EUA`).
- **Material y atribución:** basado en el bootcamp de [WayLearn](https://github.com/WayLearnLatam/Registro-Ventas-Solana-App) · [GitBook Advanced](https://waylearn.gitbook.io/solana-engineering-track-advanced).

**Red:** Devnet (`https://api.devnet.solana.com` por defecto; opcional `VITE_SOLANA_RPC_URL` según `.env.example`).

Esta rama (`feat/actualizar-cliente`) **ya incluye el IDL configurado** de ese programa (`esReferencia: false`). Tras un clon limpio puedes consultar el negocio y firmar operaciones sin volver a importar el IDL, salvo que quieras apuntar a otro despliegue.

## Arranque desde un clon limpio

Requisitos: **Node.js** `>=22.12.0` y `<25` (ver `.nvmrc`), **npm**, wallet de navegador en Devnet con SOL de prueba para firmar.

```bash
git clone https://github.com/jpgsChile/bootcamp-solana.git
cd bootcamp-solana
git checkout feat/actualizar-cliente
npm ci
npm run cliente
npm run dev
```

Abre `http://localhost:5173` (o `http://127.0.0.1:5173`) con Solflare u otra wallet compatible, en **Devnet**.

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor Vite (puerto 5173). |
| `npm run verificar` | Typecheck + tests + build. |
| `npm run typecheck` / `npm test` / `npm run build` | Pasos sueltos del verificador. |
| `npm run configurar:idl -- <ruta/al/idl.json>` | Importa un IDL nuevo o cambia de programa; regenera Codama. |
| `npm run cliente` | Regenera el cliente a partir de `idl.json` (sin reimportar). |

Si el JSON no trae dirección:

```bash
npm run configurar:idl -- ./tmp-idl/registro.json --program-id TU_PROGRAM_ID
```

Reinicia `npm run dev` después de importar. **No edites a mano** `clients/js/`; conserva juntos `idl.json`, `src/config/programa.json` y el cliente generado.

> Playground sigue siendo referencia histórica del material original (exportar IDL / desplegar desde el navegador). Este frontend trabaja contra el programa Anchor en [solana-registro-ventas-program](https://github.com/jpgsChile/solana-registro-ventas-program). Detalle en [docs/IDL-Y-PLAYGROUND.md](./docs/IDL-Y-PLAYGROUND.md).

## Demo con Solflare en Devnet

1. Conecta Solflare en **Devnet** (la misma wallet que es **autoridad** del negocio).
2. En **Localizar el negocio**, deja o escribe **Café Demo** y la dirección de esa autoridad; pulsa **Consultar registro**.
3. En **Operaciones → Actualizar cliente**, elige un cliente **con ventas**, cambia el nombre y confirma en Solflare.
4. Vuelve a **Consultar registro**: el cliente conserva **ID** y **ventas**; solo cambia el nombre.
5. **Exportar CSV** (con o sin filtro): el `nombre_cliente` de sus filas refleja el nombre actualizado.

Las escrituras exigen genesis de Devnet y el programa desplegado; no uses un validador local contra esta UI sin cambiar esas protecciones.

## Operaciones en la interfaz

Relación: **Registro → Clientes → Ventas** (cada una con su cuenta/PDA). El importe de una venta es un dato del ejercicio: **no transfiere SOL**. La devolución cierra la cuenta de la venta; no es un reembolso comercial.

- **Nueva venta** (en cada tarjeta de cliente): abre **Registrar venta**, precarga solo el **ID** y deja SKU, descripción e importe **vacíos**. También funciona si el cliente **no tiene ventas**.
- Clic en una **fila de venta existente**: abre **Corregir importe** con ID, SKU e importe de esa fila (y la descripción como referencia).
- Al volver a **Registrar venta** (pestaña o Nueva venta), se limpian los campos de la venta anterior.
- **Actualizar cliente**: lista todos los clientes del registro consultado; **Guardar** solo si eres el dueño, el nombre es válido y cambió respecto al actual.

### Filtro y exportación CSV

Con un registro cargado (consulta on-chain o, en desarrollo, **Cargar datos de demostración**):

1. **Buscar ventas activas** filtra por SKU o descripción (sin distinguir mayúsculas). El filtrado es local: no añade RPC.
2. La tabla sigue agrupada por cliente; el contador indica coincidencias.
3. **Exportar CSV** descarga las filas visibles (`id_cliente`, `nombre_cliente`, `sku`, `descripcion`, `importe`). Con búsqueda vacía exporta todas las ventas activas cargadas.
4. El CSV escapa comillas y saltos de línea, y neutraliza valores que una hoja podría tratar como fórmula.

El botón de demostración solo aparece con `npm run dev`; no habilita firmas on-chain.

## Verificar cambios

```bash
npm run verificar
```

Comprueba TypeScript, ejecuta las pruebas automatizadas (sin enviar transacciones) y genera el build. Completa también el recorrido manual en Devnet ([docs/PRUEBAS-MANUALES.md](./docs/PRUEBAS-MANUALES.md)).

## Sesiones de clase (opcional)

| Comando | Qué prepara |
| --- | --- |
| `npm run clase:dia3` | Pantalla de conexión (wallet, RPC, saldos). |
| `npm run clase:dia4` | Ejercicios: completar `crearCliente` y `registrarVenta`. |
| `npm run clase:resuelto` | Operaciones resueltas (incluye `actualizarCliente`). |

Detén `npm run dev` antes de cambiar de modo. Estos comandos **reemplazan** `src/solana/acciones.ts` (respaldo en `.aula/respaldos/`).

## Si algo no funciona

| Situación | Qué revisar |
| --- | --- |
| La wallet no aparece | Pestaña normal del navegador + extensión en Devnet. |
| Falta SOL de prueba | [Solana Faucet](https://faucet.solana.com/) (Devnet). |
| No aparece el negocio | Nombre exacto y dirección de la autoridad (ambos en la PDA). |
| «Revisa la conexión RPC» | `getGenesisHash` falló; prueba otro RPC de Devnet en `.env.local`. |
| Cambiaste el IDL y falla la comprobación | `npm run cliente` y reinicia el servidor. |

## Recursos

- Programa: [jpgsChile/solana-registro-ventas-program](https://github.com/jpgsChile/solana-registro-ventas-program)
- Material original (app): [WayLearnLatam/Registro-Ventas-Solana-App](https://github.com/WayLearnLatam/Registro-Ventas-Solana-App)
- Material original (programa): [WayLearnLatam/Registro-Ventas-Solana-PDA](https://github.com/WayLearnLatam/Registro-Ventas-Solana-PDA)
- [Solana Playground](https://beta.solpg.io/) (referencia histórica)
- [Discord WayLearn](https://discord.gg/hvnpbZxu9b)

## Atribución

Proyecto educativo para **Devnet**, derivado del material de WayLearn. Las validaciones del formulario no sustituyen las del programa. Revisa [seguridad y alcance](./docs/SEGURIDAD-Y-ALCANCE.md).
