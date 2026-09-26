package cl.dsy1104.fonda.dto;

import cl.dsy1104.fonda.model.TipoBebida;
import jakarta.validation.constraints.*;

public class BebidaRequest {
    @NotBlank(message = "*Obligatorio")
    private String nombre;

    @NotNull(message = "*Obligatorio")
    private TipoBebida tipo;

    @NotNull(message = "*Obligatorio")
    @Min(value = 100, message = "Debe estar entre 100 y 3000")
    @Max(value = 3000, message = "Debe estar entre 100 y 3000")
    private Integer volumenML; 

    @NotNull(message = "*Obligatorio")
    @Min(value = 0, message = "Debe ser mayor o igual a 0")
    private Integer stock;

    private Double gradosAlcohol;
    private Boolean certificada;
    private Integer azucarPorLitro;
    private boolean ventaRestringida;

    //Getters y setters
    public String getNombre() {
        return nombre;
    }
    public void setNombre(String nombre){
        this.nombre = nombre;
    }

    public TipoBebida getTipo() {
        return tipo;
    }
    public void setTipo(TipoBebida tipo){
        this.tipo = tipo;
    }

    public Integer getVolumenML(){
        return volumenML;
    }
    public void setVolumenML(Integer volumenML){
        this.volumenML = volumenML;
    }

    public Integer getStock() {
    return stock;
    }
    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public Double getGradosAlcohol() {
        return gradosAlcohol;
    }
    public void setGradosAlcohol(Double gradosAlcohol) {
        this.gradosAlcohol = gradosAlcohol;
    }

    public Boolean getCertificada() {
        return certificada;
    }
    public void setCertificada(Boolean certificada) {
        this.certificada = certificada;
    }

    public Integer getAzucarPorLitro() {
        return azucarPorLitro;
    }
    public void setAzucarPorLitro(Integer azucarPorLitro) {
        this.azucarPorLitro = azucarPorLitro;
    }

    public boolean isVentaRestringida() {
        return ventaRestringida;
    }
    public void setVentaRestringida(boolean ventaRestringida) {
        this.ventaRestringida = ventaRestringida;
    }
}
