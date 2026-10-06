import { useCallback, useEffect, useState } from "react";
import { Button, Container, Modal } from "react-bootstrap";
import BebidaList from "./components/BebidaList.jsx";
import BebidaForm from "./components/BebidaForm.jsx";
import VentaForm from "./components/VentaForm.jsx";
import VentaHistorial from "./components/VentaHistorial.jsx";
import { listarBebidas } from "./services/api.js";

/**
 * Fonda San Belarmino — control de bebidas y ventas.
 *
 * App coordina los componentes y comparte el catalogo cargado:
 * BebidaList lo muestra y VentaForm lo usa para el selector.
 * Ningun componente calcula precios ni decide ventas: esos datos
 * vienen del backend.
 */
export default function App() {
  const [bebidas, setBebidas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState("");

  const [formAbierto, setFormAbierto] = useState(false);
  const [editando, setEditando] = useState(null); // bebida en edicion o null (crear)

  const [refrescarVentas, setRefrescarVentas] = useState(0); // contador para recargar historial

  // la recarga depende del filtro: cada cambio vuelve a consultar el backend
  // (?nombre=...), que es quien filtra.
  const cargarBebidas = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      setBebidas(await listarBebidas(filtro.trim()));
    } catch (e) {
      // el backend puede estar apagado: la interfaz lo comunica, no se queda
      // en blanco ni muestra la excepcion cruda.
      setBebidas([]);
      setError(e.mensaje ?? e.message);
    } finally {
      setCargando(false);
    }
  }, [filtro]);

  useEffect(() => {
    cargarBebidas();
  }, [cargarBebidas]);

  function abrirCrear() {
    setEditando(null);
    setFormAbierto(true);
  }

  function abrirEditar(bebida) {
    setEditando(bebida);
    setFormAbierto(true);
  }

  function trasGuardar() {
    setFormAbierto(false);
    cargarBebidas();
  }

  function trasVenta() {
    // el stock de la bebida pudo cambiar y el historial crecio.
    cargarBebidas();
    setRefrescarVentas((n) => n + 1);
  }

      /* TODO: montar aqui los componentes de la interfaz. */
  return (
      <Container className="py-4">
        <h1 className="mb-1">Fonda San Belarmino</h1>
        <p className="text-muted">Control de bebidas y ventas</p>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h4 mb-0">Catálogo de bebidas</h2>
          <Button onClick={abrirCrear}>+ Nueva bebida</Button>
        </div>

        <BebidaList
          bebidas={bebidas}
          cargando={cargando}
          error={error}
          filtro={filtro}
          onFiltro={setFiltro}
          onEditar={abrirEditar}
          onCambio={cargarBebidas}
        />

        <VentaForm bebidas={bebidas} onVenta={trasVenta} />

        <VentaHistorial refrescar={refrescarVentas} />

        <Modal show={formAbierto} onHide={() => setFormAbierto(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{editando ? "Editar bebida" : "Nueva bebida"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* key fuerza a reiniciar el estado del formulario al cambiar de bebida */}
            <BebidaForm
              key={editando?.id ?? "nueva"}
              bebida={editando}
              onGuardado={trasGuardar}
              onCancelar={() => setFormAbierto(false)}
            />
          </Modal.Body>
        </Modal>
      </Container>
    );
  }