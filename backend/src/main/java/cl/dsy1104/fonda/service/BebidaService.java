package cl.dsy1104.fonda.service;

import cl.dsy1104.fonda.dto.BebidaRequest;
import cl.dsy1104.fonda.dto.BebidaResponse;
import cl.dsy1104.fonda.exception.*;
import cl.dsy1104.fonda.model.Bebida;
import cl.dsy1104.fonda.model.TipoBebida;
import cl.dsy1104.fonda.repository.*;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BebidaService {

    private static final int PRECIO_BASE_ALCOHOLICA = 3500;
    private static final int PRECIO_BASE_SIN_ALCOHOL = 2000;
    private static final double INCREMENTO_SIN_CERTIFICADO = 1.2;
    private static final double INCREMENTO_AZUCAR_ELEVADA = 1.1;
    private static final int AZUCAR_MAXIMO_SIN_RECARGO = 80;

    private final BebidaRepository bebidaRepository;
    private final VentaRepository ventaRepository;

    public BebidaService(BebidaRepository bebidaRepository, VentaRepository ventaRepository) {
        this.bebidaRepository = bebidaRepository;
        this.ventaRepository = ventaRepository;
    }

    public List<BebidaResponse> listar(String nombre) {
        List<Bebida> bebidas = (nombre == null || nombre.isBlank())
            ? bebidaRepository.findAll(): bebidaRepository.findByNombreContainingIgnoreCase(nombre.trim());
        return bebidas.stream().map(this::aResponse).toList();
    }

    public BebidaResponse obtenerPorId(Long id) {
        return aResponse(buscar(id));
    }

    public BebidaResponse crear(BebidaRequest request) {
        Bebida bebida = new Bebida();
        aplicar(request, bebida);
        return aResponse(bebidaRepository.save(bebida));
    }

    public BebidaResponse actualizar(Long id, BebidaRequest request) {
        Bebida bebida = buscar(id);
        aplicar(request, bebida);
        return aResponse(bebidaRepository.save(bebida));
    }

    public void eliminar(Long id) {
        Bebida bebida = buscar(id);
        if (ventaRepositoryTieneVentas(id)) {
        throw new ConflictoException("No se puede eliminar: la bebida tiene ventas registradas.");
        }
        bebidaRepository.delete(bebida);
    }

    public BebidaResponse marcarRestriccion(Long id) {
        Bebida bebida = buscar(id);
        bebida.setVentaRestringida(true);
        return aResponse(bebidaRepository.save(bebida));
    }

    //PARA VENTA SERVICE
    public Bebida obtenerBebida(Long id) {
        return buscar(id);
    }
    public void guardar(Bebida bebida) {
        bebidaRepository.save(bebida);
    }

    //calculo precios
    public int calcularPrecio(Bebida bebida) {
        if (bebida.getTipo() == TipoBebida.ALCOHOLICA) {
            int precio = PRECIO_BASE_ALCOHOLICA;
            if (bebida.getCertificada() == null || !bebida.getCertificada()) {
                precio = (int) Math.round(precio * INCREMENTO_SIN_CERTIFICADO);
            }
            return precio;
        }
        int precio = PRECIO_BASE_SIN_ALCOHOL;
        if (bebida.getAzucarPorLitro() != null
                && bebida.getAzucarPorLitro() > AZUCAR_MAXIMO_SIN_RECARGO) {
            precio = (int) Math.round(precio * INCREMENTO_AZUCAR_ELEVADA);
        }
        return precio;
    }

    //metodos privados
    private Bebida buscar(Long id) {
        return bebidaRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Bebida con id " + id + " no encontrada."));
    }

    private boolean ventaRepositoryTieneVentas(Long id) {
        return ventaRepository.existsByBebidaId(id);
    }

    private void aplicar(BebidaRequest request, Bebida bebida) {
        bebida.setNombre(request.getNombre());
        bebida.setTipo(request.getTipo());
        bebida.setVolumenML(request.getVolumenML());
        bebida.setStock(request.getStock());
        bebida.setGradosAlcohol(request.getGradosAlcohol());
        bebida.setCertificada(request.getCertificada());
        bebida.setAzucarPorLitro(request.getAzucarPorLitro());
        bebida.setVentaRestringida(request.isVentaRestringida());
    }

    private BebidaResponse aResponse(Bebida b) {
        BebidaResponse r = new BebidaResponse();
        r.setId(b.getId());
        r.setNombre(b.getNombre());
        r.setTipo(b.getTipo());
        r.setVolumenML(b.getVolumenML());
        r.setStock(b.getStock());
        r.setGradosAlcohol(b.getGradosAlcohol());
        r.setCertificada(b.getCertificada());
        r.setAzucarPorLitro(b.getAzucarPorLitro());
        r.setVentaRestringida(b.isVentaRestringida());
        r.setPrecio(calcularPrecio(b));
        return r;
    }
}