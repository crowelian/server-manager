package com.harriahola.ServerManager.repository;

import com.harriahola.ServerManager.model.Server;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServerRepository extends JpaRepository<Server, Long> {

    Server findByIpAddress(String ipAddress);
    
}
