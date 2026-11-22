import { address, type Address } from '@solana/kit';
import { PublicKey } from '@solana/web3.js';
import type { RegistroUI } from './lecturas';

function direccionDemo(relleno: number): Address {
  return address(new PublicKey(new Uint8Array(32).fill(relleno)).toBase58());
}

/**
 * Fixture local solo para demos visuales en desarrollo.
 * No llama al RPC, no habilita escrituras y no simula confirmaciones.
 * Incluye cliente con ventas (CAF02) y otro sin ventas para probar el formulario.
 */
export const DEMO_REGISTRO: RegistroUI = {
  direccion: direccionDemo(11),
  nombreNegocio: 'Café Demo',
  idCounter: 3,
  clientes: [
    {
      direccion: direccionDemo(21),
      idCliente: 1,
      nombre: 'Ana',
      compras: 2,
      ventas: [
        { direccion: direccionDemo(31), sku: 'CAF01', descripcion: 'Cafe americano', monto: 50 },
        { direccion: direccionDemo(32), sku: 'TEA02', descripcion: 'Te verde', monto: 35 },
      ],
    },
    {
      direccion: direccionDemo(22),
      idCliente: 2,
      nombre: 'Luis',
      compras: 2,
      ventas: [
        { direccion: direccionDemo(33), sku: 'CAF02', descripcion: 'Cafe latte', monto: 65 },
        {
          direccion: direccionDemo(34),
          sku: 'PROMO',
          descripcion: '=2x1 oferta "especial"\nfin de semana',
          monto: 25,
        },
      ],
    },
    {
      direccion: direccionDemo(23),
      idCliente: 3,
      nombre: 'Marta',
      compras: 0,
      ventas: [],
    },
  ],
};
