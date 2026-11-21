import type { ClienteUI } from './lecturas';

/** Una fila plana de venta activa, lista para filtrar o exportar. */
export type VentaFila = {
  idCliente: number;
  nombreCliente: string;
  sku: string;
  descripcion: string;
  monto: number;
  direccion: string;
};

export function normalizarConsulta(consulta: string): string {
  return consulta.trim().toLocaleLowerCase('es');
}

/** Coincide si el texto aparece en SKU o descripción (sin distinguir mayúsculas). */
export function ventaCoincide(sku: string, descripcion: string, consulta: string): boolean {
  const q = normalizarConsulta(consulta);
  if (!q) return true;
  return sku.toLocaleLowerCase('es').includes(q) || descripcion.toLocaleLowerCase('es').includes(q);
}

export function contarVentasActivas(clientes: ClienteUI[]): number {
  return clientes.reduce((total, cliente) => total + cliente.ventas.length, 0);
}

/**
 * Conserva la agrupación por cliente y deja solo las ventas que coinciden.
 * Con consulta vacía devuelve la misma estructura (todas las ventas activas).
 * Los clientes sin coincidencias se omiten.
 */
export function filtrarClientesPorVentas(clientes: ClienteUI[], consulta: string): ClienteUI[] {
  const q = normalizarConsulta(consulta);
  if (!q) return clientes;
  return clientes
    .map((cliente) => ({
      ...cliente,
      ventas: cliente.ventas.filter((venta) => ventaCoincide(venta.sku, venta.descripcion, q)),
    }))
    .filter((cliente) => cliente.ventas.length > 0);
}

export function filasVentasVisibles(clientes: ClienteUI[], consulta: string): VentaFila[] {
  return filtrarClientesPorVentas(clientes, consulta).flatMap((cliente) =>
    cliente.ventas.map((venta) => ({
      idCliente: cliente.idCliente,
      nombreCliente: cliente.nombre,
      sku: venta.sku,
      descripcion: venta.descripcion,
      monto: venta.monto,
      direccion: String(venta.direccion),
    })),
  );
}
