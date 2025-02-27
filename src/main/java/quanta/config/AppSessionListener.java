package quanta.config;

import java.util.concurrent.locks.ReentrantLock;
import jakarta.servlet.http.HttpSession;
import jakarta.servlet.http.HttpSessionEvent;
import jakarta.servlet.http.HttpSessionListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import quanta.service.AppFilter;

/**
 * For keeping track of sessions.
 */
@Component 
public class AppSessionListener implements HttpSessionListener {
    private static Logger log = LoggerFactory.getLogger(AppSessionListener.class);
    private static final boolean debug = false;

    @Autowired
    private AppProp appProp;

    public static int sessionCounter = 0;

    @Override
    public void sessionCreated(HttpSessionEvent se) {
        HttpSession session = se.getSession();

        // multiply by 60 to convert minutes to seconds.
        session.setMaxInactiveInterval(appProp.getSessionTimeoutMinutes() * 60);

        /*
         * I'm not sure if certain parts of 'Spring API' are gonna see this LockEx and just synchronize on
         * it using synchronize keyword and treating it just as a plain Object would be used for a lock, but
         * for our own API use of this lock we call lockEx() and unlockEx() on this object to use its built
         * in ability to detect and forcably break deadlocks when they happen!
         */
        session.setAttribute(AppFilter.SESSION_LOCK_NAME, new ReentrantLock());
        sessionCounter++;

        if (debug) {
            log.debug("Session Created: " + session.getId() + " count=" + sessionCounter);
        }
    }

    @Override
    public void sessionDestroyed(HttpSessionEvent se) {
        HttpSession session = se.getSession();
        session.removeAttribute(AppFilter.SESSION_LOCK_NAME);
        sessionCounter--;

        if (debug) {
            log.debug("Session Destroyed: " + session.getId() + " count=" + sessionCounter);
        }
    }

    public static int getSessionCounter() {
        return sessionCounter;
    }
}
