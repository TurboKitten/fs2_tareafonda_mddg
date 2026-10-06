import { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { actualizarBebida, crearBebida } from "../services/api.js";

export default function BebidaForm({ bebida, onGuardado, onCancelar }) {
  const [nombre, setNombre] = useState(bebida?.nombre ?? "");
  const [tipo, setTipo] = useState(bebida?.tipo ?? "SIN_ALCOHOL");
  const [volumenML, setVolumenML] = useState(bebida?.volumenML ?? "");
  const [stock, setStock] = useState(bebida?.stock ?? "");
  const [gradosAlcohol, setGradosAlcohol] = useState(bebida?.gradosAlcohol ?? "");
  const [certificada, setCertificada] = useState(bebida?.certificada ?? false);
  const [azucarPorLitro, setAzucarPorLitro] = useState(bebida?.azucarPorLitro ?? "");
  const [ventaRestringida, setVentaRestringida] = useState(bebida?.ventaRestringida ?? false);

  const [errores, setErrores] = useState({});   // errores campo por campo (400)
  const [errorGeneral, setErrorGeneral] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const esAlcoholica = tipo === "ALCOHOLICA";

  //el atributo que no aplica al tipo viaja como null (lo exige el backend)
  function construirDatos() {
    return {
      nombre: nombre.trim(),
      tipo,
      volumenML: Number(volumenML),
      stock: Number(stock),
      gradosAlcohol: esAlcoholica && gradosAlcohol !== "" ? Number(gradosAlcohol) : null,
      certificada: esAlcoholica ? certificada : null,
      azucarPorLitro: !esAlcoholica && azucarPorLitro !== "" ? Number(azucarPorLitro) : null,
      ventaRestringida,
    };
  }

  async function enviar(e) {
    e.preventDefault();
    setEnviando(true);
    setErrores({});
    setErrorGeneral(null);
    try {
      if (bebida) {
        await actualizarBebida(bebida.id, construirDatos());
      } else {
        await crearBebida(construirDatos());
      }
      onGuardado();
    } catch (err) {
      if (err.campos) {
        setErrores(err.campos);
      } else {
        setErrorGeneral(err.mensaje ?? err.message);
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Form onSubmit={enviar} noValidate>
      {errorGeneral && <Alert variant="danger">{errorGeneral}</Alert>}

      <Form.Group className="mb-3" controlId="formNombre">
        <Form.Label>Nombre</Form.Label>
        <Form.Control type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} isInvalid={!!errores.nombre}/>
        <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formTipo">
        <Form.Label>Tipo</Form.Label>
        <Form.Select value={tipo} onChange={(e) => setTipo(e.target.value)} isInvalid={!!errores.tipo}>
          <option value="SIN_ALCOHOL">Sin alcohol</option>
          <option value="ALCOHOLICA">Alcohólica</option>
        </Form.Select>
        <Form.Control.Feedback type="invalid">{errores.tipo}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formVolumen">
        <Form.Label>Volumen (ml)</Form.Label>
        <Form.Control type="number" value={volumenML} onChange={(e) => setVolumenML(e.target.value)} isInvalid={!!errores.volumenML}/>
        <Form.Control.Feedback type="invalid">{errores.volumenML}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formStock">
        <Form.Label>Stock</Form.Label>
        <Form.Control type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} isInvalid={!!errores.stock}/>
        <Form.Control.Feedback type="invalid">{errores.stock}</Form.Control.Feedback>
      </Form.Group>

      {esAlcoholica ? (
        <>
          <Form.Group className="mb-3" controlId="formGrados">
            <Form.Label>Grados de alcohol</Form.Label>
            <Form.Control type="number" step="0.1" min="0.5" max="45" value={gradosAlcohol} onChange={(e) => setGradosAlcohol(e.target.value)} isInvalid={!!errores.gradosAlcohol}/>
            <Form.Control.Feedback type="invalid">{errores.gradosAlcohol}</Form.Control.Feedback>
          </Form.Group>
          <Form.Check className="mb-3" type="checkbox" label="Certificada por el proveedor" checked={certificada} onChange={(e) => setCertificada(e.target.checked)}/>
        </>
      ) : (
        <Form.Group className="mb-3" controlId="formAzucar">
          <Form.Label>Azúcar (g/L)</Form.Label>
          <Form.Control type="number" min="0" value={azucarPorLitro} onChange={(e) => setAzucarPorLitro(e.target.value)} isInvalid={!!errores.azucarPorLitro}/>
          <Form.Control.Feedback type="invalid">{errores.azucarPorLitro}</Form.Control.Feedback>
        </Form.Group>
      )}

      <Form.Check className="mb-4" type="checkbox" label="Venta restringida (control de consumo responsable)" checked={ventaRestringida} onChange={(e) => setVentaRestringida(e.target.checked)}/>

      <div className="d-flex gap-2 justify-content-end">
        <Button variant="secondary" onClick={onCancelar} disabled={enviando}>
          Cancelar
        </Button>
        <Button type="submit" disabled={enviando}>
          {enviando ? "Guardando..." : bebida ? "Guardar cambios" : "Crear bebida"}
        </Button>
      </div>
    </Form>
  );
}