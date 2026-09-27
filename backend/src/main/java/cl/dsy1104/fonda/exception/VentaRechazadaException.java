package cl.dsy1104.fonda.exception;

public class VentaRechazadaException extends RuntimeException {
    private final String error;

    public VentaRechazadaException(String error, String mensaje) {
        super(mensaje);
        this.error = error;
    }
    public String getError() {
        return error;
    }
}