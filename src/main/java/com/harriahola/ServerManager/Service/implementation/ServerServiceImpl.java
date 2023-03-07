package com.harriahola.ServerManager.Service.implementation;

import java.io.IOException;
import java.net.InetAddress;
import java.util.Collection;

import javax.transaction.Transactional;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.harriahola.ServerManager.Service.ServerService;
import com.harriahola.ServerManager.model.Server;
import com.harriahola.ServerManager.repository.ServerRepository;
import com.harriahola.ServerManager.enumeration.Status;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor // Lombok takes care of the constructors with this
@Service
@Transactional
@Slf4j // logger
public class ServerServiceImpl implements ServerService {

    private final ServerRepository serverRepository;


    @Override
    public Server create(Server server) {
        log.info("Saving new server: {}", server.getName());
        server.setImageUrl(setServerImageUrl());
        return serverRepository.save(server);
    }

   

    @Override
    public Server ping(String ipAddress) throws IOException {
        log.info("Pinging server ip: {}", ipAddress);
        Server server = serverRepository.findByIpAddress(ipAddress);
        InetAddress address = InetAddress.getByName(ipAddress);
        server.setStatus(address.isReachable(10000) ? Status.SERVER_UP : Status.SERVER_DOWN);
        serverRepository.save(server);
        return server;
    }

    @Override
    public Collection<Server> list(int limit) {
        log.info("Fetching all servers:");
        return serverRepository.findAll(PageRequest.of(0, limit)).toList();
    }

    @Override
    public Server get(Long id) {
        log.info("Fething server by id: {}", id);
        return serverRepository.findById(id).get();
    }

    @Override
    public Server update(Server server) {
        log.info("Updating server: {}", server.getName());
        return serverRepository.save(server);
    }

    @Override
    public Boolean delete(Long id) {
        log.info("Deleting server by id: {}", id);
        serverRepository.deleteById(id);
        return Boolean.TRUE;
    }

   



    private String setServerImageUrl() {
        String[] imageNames = {"server1.png", "server2.png", "server3.png", 
        "server4.png", "server5.png", "server6.png"};
        return ServletUriComponentsBuilder.fromCurrentContextPath().path("/server/images/" + 
        imageNames[new java.util.Random().nextInt(6)]).toUriString();
    }
    
}
