package com.eduafrica.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {
    
    @Bean
    public OpenAPI eduAfricaOpenAPI() {
        Server devServer = new Server();
        devServer.setUrl("http://localhost:8080");
        devServer.setDescription("Serveur de développement");
        
        Server prodServer = new Server();
        prodServer.setUrl("https://api.eduafrica.com");
        prodServer.setDescription("Serveur de production");
        
        Contact contact = new Contact();
        contact.setEmail("support@eduafrica.com");
        contact.setName("Support EduAfrica");
        contact.setUrl("https://eduafrica.com");
        
        License license = new License()
                .name("MIT License")
                .url("https://opensource.org/licenses/MIT");
        
        Info info = new Info()
                .title("EduAfrica API")
                .version("1.0.0")
                .contact(contact)
                .description("API REST pour la plateforme e-learning EduAfrica. " +
                        "Cette API permet de gérer les formations, inscriptions, paiements, " +
                        "certificats, mentorat et bien plus encore.")
                .license(license);
        
        return new OpenAPI()
                .info(info)
                .servers(List.of(devServer, prodServer));
    }
}

