import { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { registrarVenta } from "../services/api.js";

export default function VentaForm({ bebidas, onVenta }) {
  const [bebidaId, setBebidaId] = useState("");
  const [unidades, setUnidades] = useState(1);
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState(null); // { tipo: "ok"|"error", ... }

  function formatearPrecio(precio) {
    return `$ ${precio.toLocaleString("es-CL")}`;
  }

  async function enviar(e) {
    e.preventDefault();
    if (!bebidaId) return;
    setEnviando(true);
    setResultado(null);
    try {
      const venta = await registrarVenta(Number(bebidaId), Number(unidades));
      setResultado({ tipo: "ok", venta });
    } catch (err) {
      setResultado({ tipo: "error", error: err.error, mensaje: err.mensaje ?? err.message });
    } finally {
      setEnviando(false);
      onVenta();
    }
  }

  return (
    <div className="my-4">
      <h2 className="h4 mb-3">Registrar venta</h2>
      <Form onSubmit={enviar} className="row g-3 align-items-end">
        <Form.Group className="col-md-6">
          <Form.Label>Bebida</Form.Label>
          <Form.Select value={bebidaId} onChange={(e) => setBebidaId(e.target.value)} disabled={bebidas.length === 0}>
            <option value="">Selecciona una bebida...</option>
            {bebidas.map((b) => (
              <option key={b.id} value={b.id}>
                {b.nombre} ({b.tipo === "ALCOHOLICA" ? "alcohólica" : "sin alcohol"}) — {b.volumenML} ml
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="col-md-3">
          <Form.Label>Unidades</Form.Label>
          <Form.Control type="number" min="1" value={unidades} onChange={(e) => setUnidades(e.target.value)}/>
        </Form.Group>

        <div className="col-md-3">
          <Button type="submit" disabled={enviando || !bebidaId}>
            {enviando ? "Registrando..." : "Registrar venta"}
          </Button>
        </div>
      </Form>

      {resultado?.tipo === "ok" && (
        <Alert variant="success" className="mt-3">
          Venta autorizada: {resultado.venta.unidades} × {resultado.venta.nombre} ={" "}
          <strong>{formatearPrecio(resultado.venta.total)}</strong>
        </Alert>
      )}

      {resultado?.tipo === "error" && (
        <Alert variant="danger" className="mt-3">
          <strong>{resultado.error ?? "ERROR"}:</strong> {resultado.mensaje}
        </Alert>
      )}
    </div>
  );
}