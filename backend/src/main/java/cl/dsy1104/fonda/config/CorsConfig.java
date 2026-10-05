package cl.dsy1104.fonda.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${fonda.cors.origen}")
    private String origen;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/*")
                .allowedOrigins(origen)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("");
    }
}