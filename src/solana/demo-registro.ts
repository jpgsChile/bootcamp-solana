import { address, type Address } from '@solana/kit';
import { PublicKey } from '@solana/web3.js';
import type { RegistroUI } from './lecturas';

function direccionDemo(relleno: number): Address {
  return address(new PublicKey(new Uint8Array(32).fill(relleno)).toBase58());
}

/**
 * Fixture local solo para demos visuales en desarrollo.
 * No llama al RPC, no habilita escrituras y no simula confirmaciones.
 */
export const DEMO_REGISTRO: RegistroUI = {
  direccion: direccionDemo(11),
  nombreNegocio: 'Cafe Demo Local',
  idCounter: 2,
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
        { direccion: direccionDemo(33), sku: 'CAF01', descripcion: 'Cafe latte', monto: 60 },
        {
          direccion: direccionDemo(34),
          sku: 'PROMO',
          descripcion: '=2x1 oferta "especial"\nfin de semana',
          monto: 25,
        },
      ],
    },
  ],
};
