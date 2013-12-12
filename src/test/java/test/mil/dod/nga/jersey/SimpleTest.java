package test.mil.dod.nga.jersey;

import static org.junit.Assert.assertEquals;

import javax.ws.rs.core.Application;

import mil.dod.nga.jersey.web.MyResource;

import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.test.JerseyTest;
import org.junit.Test;

public class SimpleTest extends JerseyTest {

    @Override
    protected Application configure() {
        return new ResourceConfig(MyResource.class);
    }

    @Test
    public void test() {
        final String hello = target("myresource").request().get(String.class);
        assertEquals("Hello World!", hello);
    }
}