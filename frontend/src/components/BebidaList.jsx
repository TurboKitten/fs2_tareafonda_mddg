import { useState } from "react";
import { Alert, Badge, Button, Form, Spinner, Table } from "react-bootstrap";
import { eliminarBebida, restringirVenta } from "../services/api.js";

export default function BebidaList({ bebidas, cargando, error, filtro, onFiltro, onEditar, onCambio }) {
  const [ocupada, setOcupada] = useState(null); // id con una accion en curso
  const [accionError, setAccionError] = useState(null);

  function formatearPrecio(precio) {
    return `$ ${precio.toLocaleString("es-CL")}`;
  }

  async function eliminar(bebida) {
    if (!window.confirm(`¿Eliminar "${bebida.nombre}"? Esta accion no se puede deshacer.`)) return;
    setOcupada(bebida.id);
    setAccionError(null);
    try {
      await eliminarBebida(bebida.id);
      onCambio();
    } catch (e) {
      setAccionError(e.mensaje ?? e.message);
    } finally {
      setOcupada(null);
    }
  }

  async function restringir(bebida) {
    setOcupada(bebida.id);
    setAccionError(null);
    try {
      await restringirVenta(bebida.id);
      onCambio();
    } catch (e) {
      setAccionError(e.mensaje ?? e.message);
    } finally {
      setOcupada(null);
    }
  }

  return (
    <>
      <Form.Group className="mb-3">
        <Form.Control type="search" placeholder="Filtrar por nombre..." value={filtro} onChange={(e) => onFiltro(e.target.value)}/>
      </Form.Group>

      {cargando && bebidas.length === 0 && (
        <div className="text-center py-4">
          <Spinner animation="border" role="status" />
        </div>
      )}

      {error && !cargando && (
        <Alert variant="danger">{error}</Alert>
      )}

      {accionError && <Alert variant="danger">{accionError}</Alert>}

      <Table striped hover responsive>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Volumen (ml)</th>
            <th>Stock</th>
            <th>Precio</th>
            <th>Venta</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {bebidas.map((b) => (
            <tr key={b.id}>
              <td>{b.nombre}</td>
              <td>{b.tipo === "ALCOHOLICA" ? "Alcohólica" : "Sin alcohol"}</td>
              <td>{b.volumenML}</td>
              <td>
                <Badge bg={b.stock === 0 ? "danger" : "secondary"}>{b.stock}</Badge>
              </td>
              <td>{formatearPrecio(b.precio)}</td>
              <td>
                {b.ventaRestringida ? (
                  <Badge bg="warning" text="dark">Restringida</Badge>
                ) : (
                  <Badge bg="success">Normal</Badge>
                )}
              </td>
              <td>
                <Button size="sm" variant="outline-primary" onClick={() => onEditar(b)}>
                  Editar
                </Button>{" "}
                {!b.ventaRestringida && (
                  <Button size="sm" variant="outline-warning" disabled={ocupada === b.id} onClick={() => restringir(b)}>
                    Restringir
                  </Button>
                )}{" "}
                <Button size="sm" variant="outline-danger" disabled={ocupada === b.id} onClick={() => eliminar(b)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
          {!cargando && !error && bebidas.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center text-muted py-4">
                No hay bebidas que mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );
}