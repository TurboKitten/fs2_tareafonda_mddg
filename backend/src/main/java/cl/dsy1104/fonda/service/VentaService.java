package cl.dsy1104.fonda.service;

import cl.dsy1104.fonda.dto.VentaRequest;
import cl.dsy1104.fonda.dto.VentaResponse;
import cl.dsy1104.fonda.exception.*;
import cl.dsy1104.fonda.model.*;
import cl.dsy1104.fonda.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class VentaService {

    private final BebidaService bebidaService;
    private final VentaRepository ventaRepository;

    //maximo de cliente - application.properties
    @Value("${fonda.limite-unidades-por-cliente}")
    private int limiteUnidadesPorCliente;

    public VentaService(BebidaService bebidaService, VentaRepository ventaRepository) {
        this.bebidaService = bebidaService;
        this.ventaRepository = ventaRepository;
    }

    //registro de venta
    public VentaResponse registrar(VentaRequest request) {
        Bebida bebida = bebidaService.obtenerBebida(request.getBebidaId());
        int unidades = request.getUnidades();

        //restringidas
        if (bebida.isVentaRestringida()) {
            guardarRechazo(bebida, unidades, "VENTA_RESTRINGIDA");
            throw new VentaRechazadaException("VENTA_RESTRINGIDA",
                "La bebida " + bebida.getNombre() + " tiene la venta restringida.");
        }

        //limite de bebidas alcoholicas
        if (bebida.getTipo() == TipoBebida.ALCOHOLICA && unidades > limiteUnidadesPorCliente) {
            guardarRechazo(bebida, unidades, "LIMITE_EXCEDIDO");
            throw new VentaRechazadaException("LIMITE_EXCEDIDO",
                unidades + " unidades superan el limite de " + limiteUnidadesPorCliente + " por cliente.");
        }

        //stock insuficiente
        if (bebida.getStock() < unidades) {
            guardarRechazo(bebida, unidades, "STOCK_INSUFICIENTE");
            throw new VentaRechazadaException("STOCK_INSUFICIENTE",
                "Stock disponible: " + bebida.getStock() + " unidades. No alcanza para " + unidades + ".");
        }

        //autorizacion: calculo 
        int total = bebidaService.calcularPrecio(bebida) * unidades;
        bebida.setStock(bebida.getStock() - unidades);
        bebidaService.guardar(bebida);

        Venta venta = new Venta();
        venta.setBebida(bebida);
        venta.setUnidades(unidades);
        venta.setTotal(total);
        venta.setEstado(EstadoVenta.AUTORIZADA);
        venta.setFecha(LocalDateTime.now());
        return aResponse(ventaRepository.save(venta));
    }

    //historial 
    @Transactional(readOnly = true)
    public List<VentaResponse> historial() {
        return ventaRepository.findAll().stream().map(this::aResponse).toList();
    }

    private void guardarRechazo(Bebida bebida, int unidades, String motivo) {
        Venta venta = new Venta();
        venta.setBebida(bebida);
        venta.setUnidades(unidades);
        venta.setTotal(0);
        venta.setEstado(EstadoVenta.RECHAZADA);
        venta.setMotivo(motivo);
        venta.setFecha(LocalDateTime.now());
        ventaRepository.save(venta);
    }

    private VentaResponse aResponse(Venta v) {
        VentaResponse r = new VentaResponse();
        r.setId(v.getId());
        r.setBebidaId(v.getBebida().getId());
        r.setNombre(v.getBebida().getNombre());
        r.setUnidades(v.getUnidades());
        r.setTotal(v.getTotal());
        r.setEstado(v.getEstado());
        r.setMotivo(v.getMotivo());
        r.setFecha(v.getFecha());
        return r;
    }
}