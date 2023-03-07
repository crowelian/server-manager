package com.harriahola.ServerManager.Service;

import java.io.IOException;
import java.util.Collection;

import com.harriahola.ServerManager.model.Server;

public interface ServerService {
    Server create(Server server);
    Server ping(String ipAddress) throws IOException;
    Collection<Server> list(int limit); // limit the number of servers, gives the first x
    Server get(Long id);
    Server update(Server server);
    Boolean delete(Long id);
}
