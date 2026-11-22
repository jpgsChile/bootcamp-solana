import test from 'node:test';
import assert from 'node:assert/strict';
import { address } from '@solana/kit';
import { PublicKey } from '@solana/web3.js';
import type { ClienteUI } from '../src/solana/lecturas';
import { DEMO_REGISTRO } from '../src/solana/demo-registro';
import {
  contarVentasActivas,
  filtrarClientesPorVentas,
  filasVentasVisibles,
  ventaCoincide,
} from '../src/solana/ventas-filtro';
import { celdaCsv, construirCsvVentas, neutralizarFormula } from '../src/solana/ventas-csv';

function dir(byte: number) {
  return address(new PublicKey(new Uint8Array(32).fill(byte)).toBase58());
}

const clientesFixture: ClienteUI[] = [
  {
    direccion: dir(1),
    idCliente: 1,
    nombre: 'Ana',
    compras: 2,
    ventas: [
      { direccion: dir(2), sku: 'CAF01', descripcion: 'Cafe americano', monto: 50 },
      { direccion: dir(3), sku: 'TEA02', descripcion: 'Te verde', monto: 35 },
    ],
  },
  {
    direccion: dir(4),
    idCliente: 2,
    nombre: 'Luis',
    compras: 1,
    ventas: [{ direccion: dir(5), sku: 'CAF01', descripcion: 'Cafe latte', monto: 60 }],
  },
];

test('el filtro por SKU o descripción ignora mayúsculas y no altera el original', () => {
  assert.equal(ventaCoincide('CAF01', 'Cafe americano', 'caf'), true);
  assert.equal(ventaCoincide('CAF01', 'Cafe americano', 'AMERICANO'), true);
  assert.equal(ventaCoincide('CAF01', 'Cafe americano', 'te '), false);

  const filtrados = filtrarClientesPorVentas(clientesFixture, 'caf');
  assert.equal(filtrados.length, 2);
  assert.equal(filtrados[0].ventas.length, 1);
  assert.equal(filtrados[0].ventas[0].sku, 'CAF01');
  assert.equal(filtrados[1].ventas[0].descripcion, 'Cafe latte');
  assert.equal(clientesFixture[0].ventas.length, 2);

  const vacio = filtrarClientesPorVentas(clientesFixture, 'xyz');
  assert.deepEqual(vacio, []);
  assert.equal(contarVentasActivas(vacio), 0);

  const todos = filtrarClientesPorVentas(clientesFixture, '  ');
  assert.equal(contarVentasActivas(todos), 3);
  assert.equal(filasVentasVisibles(clientesFixture, '').length, 3);
});

test('el CSV escapa comillas y saltos de línea y neutraliza fórmulas', () => {
  assert.equal(neutralizarFormula('=2+2'), "'=2+2");
  assert.equal(neutralizarFormula('+cmd'), "'+cmd");
  assert.equal(neutralizarFormula('-1'), "'-1");
  assert.equal(neutralizarFormula('@SUM(A1)'), "'@SUM(A1)");
  assert.equal(neutralizarFormula('Cafe'), 'Cafe');
  assert.equal(celdaCsv('texto "con" comillas'), '"texto ""con"" comillas"');
  assert.equal(celdaCsv('linea1\nlinea2'), '"linea1\nlinea2"');

  const filas = filasVentasVisibles(DEMO_REGISTRO.clientes, 'promo');
  assert.equal(filas.length, 1);
  const csv = construirCsvVentas(filas);
  assert.ok(csv.startsWith('\uFEFF'));
  assert.match(csv, /id_cliente,nombre_cliente,sku,descripcion,importe/);
  assert.match(csv, /"'=2x1 oferta ""especial""\r?\nfin de semana"/);
  assert.match(csv, /,25(?:\r?\n|$)/);

  const completo = construirCsvVentas(filasVentasVisibles(DEMO_REGISTRO.clientes, ''));
  assert.equal(contarVentasActivas(DEMO_REGISTRO.clientes), 4);
  assert.match(completo, /,50\r\n/);
  assert.match(completo, /,35\r\n/);
  assert.match(completo, /,65\r\n/);
  assert.match(completo, /,25\r\n/);
});
