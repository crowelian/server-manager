package com.harriahola.ServerManager;

import com.harriahola.ServerManager.enumeration.Status;
import com.harriahola.ServerManager.model.Server;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.harriahola.ServerManager.repository.ServerRepository;

@SpringBootApplication
public class ServerManagerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServerManagerApplication.class, args);
	}

	@Bean
	CommandLineRunner run(ServerRepository serverRepository) {
		return args -> {
			serverRepository.save(
				new Server(null, "192.168.0.0", "Fake server", "8 GB",
				"FakeType", "http://localhost:8080/server/images/server1.png", Status.SERVER_UP)
			);
		};
	}

}
