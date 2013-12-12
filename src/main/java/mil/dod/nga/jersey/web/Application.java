package mil.dod.nga.jersey.web;

import org.glassfish.jersey.server.ResourceConfig;

public class Application extends ResourceConfig {
    public Application() {
        packages("mil.dod.nga.jersey.web");
    }
}
