import type { VentaFila } from './ventas-filtro';

const ENCABEZADOS = ['id_cliente', 'nombre_cliente', 'sku', 'descripcion', 'importe'] as const;

/** Prefija campos que Excel/LibreOffice podrían interpretar como fórmula. */
export function neutralizarFormula(valor: string): string {
  return /^[=+\-@\t\r]/.test(valor) ? `'${valor}` : valor;
}

export function celdaCsv(valor: string | number): string {
  const texto = typeof valor === 'number' ? String(valor) : neutralizarFormula(valor);
  if (/[",\n\r]/.test(texto)) return `"${texto.replace(/"/g, '""')}"`;
  return texto;
}

/** CSV de las filas visibles (búsqueda vacía = todas las ventas activas cargadas). */
export function construirCsvVentas(filas: VentaFila[]): string {
  const lineas = [
    ENCABEZADOS.join(','),
    ...filas.map((fila) =>
      [
        celdaCsv(fila.idCliente),
        celdaCsv(fila.nombreCliente),
        celdaCsv(fila.sku),
        celdaCsv(fila.descripcion),
        celdaCsv(fila.monto),
      ].join(','),
    ),
  ];
  // BOM UTF-8 para que hojas de cálculo abran acentos correctamente.
  return `\uFEFF${lineas.join('\r\n')}\r\n`;
}

export function descargarCsv(nombreArchivo: string, contenido: string): void {
  const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombreArchivo;
  enlace.click();
  URL.revokeObjectURL(url);
}
