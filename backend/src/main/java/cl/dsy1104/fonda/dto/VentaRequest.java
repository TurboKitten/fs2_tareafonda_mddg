package cl.dsy1104.fonda.dto;

import jakarta.validation.constraints.*;

public class VentaRequest {
    @NotNull(message = "es obligatorio")
    private Long bebidaId;

    @NotNull(message = "es obligatorio")
    @Min(value = 1, message = "debe ser al menos 1")
    private Integer unidades;

    public Long getBebidaId() {
        return bebidaId;
    }
    public void setBebidaId(Long bebidaId) {
        this.bebidaId = bebidaId;
    }

    public Integer getUnidades() {
        return unidades;
    }
    public void setUnidades(Integer unidades) {
        this.unidades = unidades;
    }
}