package com.mahesh.login_auth_api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        // Allowed Frontend URLs
        configuration.setAllowedOriginPatterns(List.of(
                "http://localhost:3000",
                "https://*.vercel.app"
        ));

        // Allowed HTTP Methods
        configuration.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "OPTIONS"
        ));

        // Allowed Headers
        configuration.setAllowedHeaders(List.of("*"));

        // Exposed Headers (Optional but good practice)
        configuration.setExposedHeaders(List.of("Authorization"));

        // Allow JWT Authorization Header
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}