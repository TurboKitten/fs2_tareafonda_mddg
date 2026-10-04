package cl.dsy1104.fonda.controller;

import cl.dsy1104.fonda.dto.BebidaRequest;
import cl.dsy1104.fonda.dto.BebidaResponse;
import cl.dsy1104.fonda.service.BebidaService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/bebidas")
public class BebidaController {

    private final BebidaService bebidaService;

    public BebidaController(BebidaService bebidaService) {
        this.bebidaService = bebidaService;
    }

    @GetMapping
    public List<BebidaResponse> listar(@RequestParam(required = false) String nombre) {
        return bebidaService.listar(nombre);
    }

    @GetMapping("/{id}")
    public BebidaResponse obtener(@PathVariable Long id) {
        return bebidaService.obtenerPorId(id);
    }

    @PostMapping
    public ResponseEntity<BebidaResponse> crear(@Valid @RequestBody BebidaRequest request) {
        BebidaResponse creada = bebidaService.crear(request);
        return ResponseEntity.created(URI.create("/api/bebidas/" + creada.getId())).body(creada);
    }

    @PutMapping("/{id}")
    public BebidaResponse actualizar(@PathVariable Long id, @Valid @RequestBody BebidaRequest request) {
        return bebidaService.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        bebidaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/restriccion")
    public BebidaResponse restringir(@PathVariable Long id) {
        return bebidaService.marcarRestriccion(id);
    }
}

