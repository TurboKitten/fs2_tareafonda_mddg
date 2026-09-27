package cl.dsy1104.fonda.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;


@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    //Fallo de las anotaciones de Bean Validation activadas con @Valid.
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> manejarValidacion(MethodArgumentNotValidException ex) {
        Map<String, String> campos = new LinkedHashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            campos.put(error.getField(), error.getDefaultMessage());
        }
        return Map.of("error", "VALIDACION", "campos", campos);
    }

    //JSON malformado o con tipos incorrectos (p. ej. un enum invalido)
    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> manejarJsonInvalido() {
        return Map.of("error", "VALIDACION", "mensaje", "El cuerpo de la peticion no es un JSON valido.");
    }

    @ExceptionHandler(NotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> manejarNoEncontrado(NotFoundException ex) {
        return Map.of("error", "NO_ENCONTRADO", "mensaje", ex.getMessage());
    }

    //Una venta no supero las verificaciones
    @ExceptionHandler(VentaRechazadaException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public Map<String, String> manejarVentaRechazada(VentaRechazadaException ex) {
        return Map.of("error", ex.getError(), "mensaje", ex.getMessage());
    }

    @ExceptionHandler(ConflictoException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public Map<String, String> manejarConflicto(ConflictoException ex) {
        return Map.of("error", "CONFLICTO", "mensaje", ex.getMessage());
    }

    ///Cualquier error no previsto con registro
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Map<String, String> manejarErrorGeneral(Exception ex) {
        log.error("Error no controlado", ex);
        return Map.of("error", "ERROR_INTERNO", "mensaje", "Ocurrio un error inesperado.");
    }
}