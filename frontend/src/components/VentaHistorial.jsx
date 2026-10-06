import { useEffect, useState } from "react";
import { Alert, Badge, Spinner, Table } from "react-bootstrap";
import { listarVentas } from "../services/api.js";

export default function VentaHistorial({ refrescar }) {
  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;
    setCargando(true);
    setError(null);
    listarVentas()
      .then((datos) => {
        if (activo) setVentas(datos);
      })
      .catch((e) => {
        if (activo) {
          setVentas([]);
          setError(e.mensaje ?? e.message);
        }
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, [refrescar]);

  function formatearFecha(fecha) {
    return fecha ? new Date(fecha).toLocaleString("es-CL") : "—";
  }

  function formatearPrecio(precio) {
    return `$ ${precio.toLocaleString("es-CL")}`;
  }

  return (
    <div className="my-4">
      <h2 className="h4 mb-3">Historial de ventas</h2>

      {cargando && ventas.length === 0 && (
        <div className="text-center py-4">
          <Spinner animation="border" role="status" />
        </div>
      )}

      {error && !cargando && <Alert variant="danger">{error}</Alert>}

      <Table striped hover responsive>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Bebida</th>
            <th>Unidades</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Motivo</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((v) => (
            <tr key={v.id}>
              <td>{formatearFecha(v.fecha)}</td>
              <td>{v.nombre}</td>
              <td>{v.unidades}</td>
              <td>{v.estado === "AUTORIZADA" ? formatearPrecio(v.total) : "—"}</td>
              <td>
                {v.estado === "AUTORIZADA" ? (
                  <Badge bg="success">Autorizada</Badge>
                ) : (
                  <Badge bg="danger">Rechazada</Badge>
                )}
              </td>
              <td>{v.motivo ?? "—"}</td>
            </tr>
          ))}
          {!cargando && !error && ventas.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center text-muted py-4">
                Aún no hay ventas registradas.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}