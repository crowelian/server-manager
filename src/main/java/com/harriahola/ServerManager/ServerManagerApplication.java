package com.harriahola.ServerManager;

import com.harriahola.ServerManager.enumeration.Status;
import com.harriahola.ServerManager.model.Server;

import java.util.Arrays;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.harriahola.ServerManager.repository.ServerRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@SpringBootApplication
public class ServerManagerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServerManagerApplication.class, args);
	}

	// @Bean
	// CommandLineRunner run(ServerRepository serverRepository) {
	// 	return args -> {
	// 		serverRepository.save(
	// 				new Server(null, "192.168.4.182", "Windows 11", "16 GB",
	// 						"Local Machine", "http://localhost:8080/images/server1.png", Status.SERVER_UP));
	// 		serverRepository.save(
	// 				new Server(null, "54.37.72.5", "Outer fake server", "32 GB",
	// 						"TypeOfFake", "http://localhost:8080/images/server2.png", Status.SERVER_DOWN));
	// 	};
	// }

	// Simple way to fix cors errors for now
	@Bean
	public CorsFilter corsFilter() {
		final String angularUrlPort = "http://localhost:4200";
		final String someOtherUrlAndPort = "http://localhost:3000";
		final String htmlPort = "http://localhost:4230";

		CorsConfiguration corsConfiguration = new CorsConfiguration();
		corsConfiguration.setAllowCredentials(true);
		corsConfiguration.setAllowedOrigins(Arrays.asList(angularUrlPort, someOtherUrlAndPort, htmlPort));
		corsConfiguration.setAllowedHeaders(Arrays.asList("Origin", "Access-Control-Allow-Origin", "Content-Type",
				"Accept", "Jwt-Token", "Authorization", "Origin, Accept", "X-Requested-With",
				"Access-Control-Request-Method", "Access-Control-Request-Headers"));

		corsConfiguration.setExposedHeaders(Arrays.asList("Origin", "Content-Type", "Accept", "Jwt-Token",
				"Authorization", "Access-Control-Allow-Origin", "Access-Control-Allow-Origin",
				"Access-Control-Allow-Credentials",
				"Filename"));

		corsConfiguration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

		UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
		urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", corsConfiguration);
		CorsFilter corsFilter = new CorsFilter(urlBasedCorsConfigurationSource);
		return corsFilter;

	}

}
