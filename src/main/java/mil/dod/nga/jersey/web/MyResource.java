package mil.dod.nga.jersey.web;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import mil.dod.nga.jersey.derp.Derp;

import org.springframework.beans.factory.annotation.Autowired;

/**
 * Root resource (exposed at "myresource" path)
 */
@Path("myresource")
public class MyResource {

    @Autowired
    Derp derp;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getIt() {
        return "Got it!" + derp.herp;
    }
}
