// Unico punto del frontend que conoce la direccion del backend.
// Los componentes importan estas funciones y no usan fetch directamente.

const API = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";

/**
 * Error de la aplicacion con la informacion que manda el backend.
 * Los componentes lo cazan para mostrar cada parte en su lugar:
 *   campos  -> errores campo por campo (400 VALIDACION)
 *   mensaje -> texto para el usuario (409 con motivo, etc.)
 */
export class ApiError extends Error {
  constructor(status, cuerpo = null) {
    super(cuerpo?.mensaje ?? `HTTP ${status}`);
    this.status = status;
    this.error = cuerpo?.error;
    this.mensaje = cuerpo?.mensaje;
    this.campos = cuerpo?.campos;
  }
}

/** Lanza un ApiError con el cuerpo de la respuesta cuando el status no es 2xx. */
async function pedir(ruta, opciones = {}) {
  let res;
  try {
    res = await fetch(`${API}${ruta}`, {
      headers: { "Content-Type": "application/json" },
      ...opciones,
    });
  } catch {
    // fetch solo lanza por problemas de red: el backend no responde.
    throw new ApiError(0, {
      error: "SIN_CONEXION",
      mensaje: "No se pudo conectar con el servidor. Revisa que el backend este corriendo.",
    });
  }

  if (!res.ok) {
    let cuerpo = null;
    try {
      cuerpo = await res.json();
    } catch {
      // la respuesta no trae JSON: se usa el cuerpo null.
    }
    throw new ApiError(res.status, cuerpo);
  }

  return res.status === 204 ? null : res.json();
}

export function listarBebidas(nombre) {
  // el filtrado lo hace el servidor (?nombre=...), no este archivo.
  const query = nombre ? `?nombre=${encodeURIComponent(nombre)}` : "";
  return pedir(`/bebidas${query}`);
}

export function crearBebida(datos) {
  return pedir("/bebidas", { method: "POST", body: JSON.stringify(datos) });
}

export function actualizarBebida(id, datos) {
  return pedir(`/bebidas/${id}`, { method: "PUT", body: JSON.stringify(datos) });
}

export function eliminarBebida(id) {
  return pedir(`/bebidas/${id}`, { method: "DELETE" });
}

export function restringirVenta(id) {
  return pedir(`/bebidas/${id}/restriccion`, { method: "PATCH" });
}

export function registrarVenta(bebidaId, unidades) {
  return pedir("/ventas", {
    method: "POST",
    body: JSON.stringify({ bebidaId, unidades }),
  });
}

export function listarVentas() {
  return pedir("/ventas");
}