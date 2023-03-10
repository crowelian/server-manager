package com.harriahola.ServerManager.resource;

import com.harriahola.ServerManager.Service.implementation.ServerServiceImpl;

import com.harriahola.ServerManager.enumeration.Status;
import com.harriahola.ServerManager.model.Response;
import com.harriahola.ServerManager.model.Server;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

import javax.validation.Valid;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Map;

import static java.time.LocalDateTime.now;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.MediaType.IMAGE_PNG_VALUE;

@RestController
@RequestMapping("/server")
@RequiredArgsConstructor
public class ServerResource { // Kind of like a controller!
    private final ServerServiceImpl serverService;
    
    @GetMapping("/list")
    public ResponseEntity<Response> getServers() {
        return ResponseEntity.ok(
            Response.builder()
            .timeStamp(now())
            .data(Map.of("servers", serverService.list(30))) // need to put language level to 9 to use Map.of
            .message("Servers retrieved")
            .status(OK)
            .statusCode(OK.value())
            .build()
        );
    }

    @GetMapping("/ping/{ipAddress}")
    public ResponseEntity<Response> pingServer(@PathVariable("ipAddress") String ipAddress) throws IOException {
        Server server = serverService.ping(ipAddress);
        return ResponseEntity.ok(
            Response.builder()
            .timeStamp(now())
            .data(Map.of("server", server)) // need to put language level to 9 to use Map.of
            .message(server.getStatus() == Status.SERVER_UP ? "Ping Success" : "Ping failed")
            .status(OK)
            .statusCode(OK.value())
            .build()
        );
    }


    @PostMapping("/save")
    public ResponseEntity<Response> saveServer(@RequestBody @Valid Server server) {
        return ResponseEntity.ok(
            Response.builder()
            .timeStamp(now())
            .data(Map.of("server", serverService.create(server))) // need to put language level to 9 to use Map.of
            .message("Server created")
            .status(CREATED)
            .statusCode(CREATED.value())
            .build()
        );
    }


    @GetMapping("/get/{id}")
    public ResponseEntity<Response> getServer(@PathVariable("id") Long id) {
        return ResponseEntity.ok(
            Response.builder()
            .timeStamp(now())
            .data(Map.of("server", serverService.get(id))) // need to put language level to 9 to use Map.of
            .message("Server retrieved")
            .status(OK)
            .statusCode(OK.value())
            .build()
        );
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Response> deleteServer(@PathVariable("id") Long id) {
        return ResponseEntity.ok(
            Response.builder()
            .timeStamp(now())
            .data(Map.of("deleted", serverService.delete(id))) // need to put language level to 9 to use Map.of
            .message("Server deleted")
            .status(OK)
            .statusCode(OK.value())
            .build()
        );
    }

    @GetMapping(path = "../images/{fileName}", produces = IMAGE_PNG_VALUE)
    public byte[] getServerImage(@PathVariable("fileName") String fileName) throws IOException {
        Resource resource = new ClassPathResource("static/images/"+fileName);
        String path = resource.getURL().getPath();
        return Files.readAllBytes(Paths.get(path));
    }

}
