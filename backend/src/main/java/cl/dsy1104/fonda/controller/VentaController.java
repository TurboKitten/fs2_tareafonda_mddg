package cl.dsy1104.fonda.controller;

import cl.dsy1104.fonda.dto.VentaRequest;
import cl.dsy1104.fonda.dto.VentaResponse;
import cl.dsy1104.fonda.service.VentaService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/ventas")
public class VentaController {

    private final VentaService ventaService;

    public VentaController(VentaService ventaService) {
        this.ventaService = ventaService;
    }

    @PostMapping
    public ResponseEntity<VentaResponse> registrar(@Valid @RequestBody VentaRequest request) {
        VentaResponse venta = ventaService.registrar(request);
        return ResponseEntity.created(URI.create("/api/ventas/" + venta.getId())).body(venta);
    }

    @GetMapping
    public List<VentaResponse> historial() {
        return ventaService.historial();
    }
}