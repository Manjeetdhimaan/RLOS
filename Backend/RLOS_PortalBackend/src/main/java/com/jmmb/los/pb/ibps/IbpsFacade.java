package com.jmmb.los.pb.ibps;
/*package com.fcb.clos.ibps;

import java.io.IOException;

import javax.xml.bind.JAXBException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.oxm.XmlMappingException;
import org.springframework.stereotype.Component;

import com.fcb.clos.api.dto.ApplicationDTO;
import com.fcb.clos.ibps.config.IBPSConfig;
import com.fcb.clos.ibps.service.IbpsPushService;

import freemarker.template.TemplateException;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class IbpsFacade {

    private final IbpsPushService ibpsPushService;
    private final IBPSConfig iBPSConfig;

    @Autowired
    public IbpsFacade(@NonNull final IbpsPushService ibpsPushService, @NonNull final IBPSConfig ibpsConfig) {
        this.ibpsPushService = ibpsPushService;
        this.iBPSConfig = ibpsConfig;
    }

    public String createIbpsApplication(@NonNull final ApplicationDTO application) throws XmlMappingException,
            InstantiationException, IllegalAccessException, JAXBException, IOException, TemplateException {
        final String arn = null;
        log.info("Invoking createIbpsApplication method in IbpsFacade for ARN : {}", arn);
        String workItemNumber = null;
        String sessionId = null;
        try {
            sessionId = ibpsPushService.createSession(iBPSConfig.getIbpsPushUserName(),
                    iBPSConfig.getIbpsPushUserPassword());
        } catch (Exception e) {
            log.info("Error While Creating session with IBPS for ARN : {}", arn);
            throw e;
        }

        try {
            workItemNumber = ibpsPushService.createWorkItem(application, sessionId);
            application.setWorkItemNumber(workItemNumber);
            ibpsPushService.lockWorkItem(sessionId, workItemNumber);
            ibpsPushService.setAttributes(application, sessionId, "create");
            ibpsPushService.unlockWorkItem(workItemNumber, sessionId);

        } catch (Exception e) {
            log.info("Error While IBPS Push for ARN : {}", workItemNumber + e);

            throw e;
        } finally {
            ibpsPushService.disconnectSession(sessionId, iBPSConfig.getIbpsPushUserName());

        }
        return application.getWorkItemNumber();
    }

    public String updateIbpsApplication(@NonNull final ApplicationDTO application) throws XmlMappingException,
            InstantiationException, IllegalAccessException, JAXBException, IOException, TemplateException {
        final String arn = application.getWorkItemNumber();
        log.info("Invoking updateIbpsApplication method in IbpsFacade for ARN : {}", arn);
        String workItemNumber = null;
        String sessionId = null;

        try {
            sessionId = ibpsPushService.createSession(iBPSConfig.getIbpsPushUserName(),
                    iBPSConfig.getIbpsPushUserPassword());

        } catch (Exception e) {
            log.info("Error While Creating session with IBPS for ARN : {}", arn);
            throw e;
        }

        try {
            workItemNumber = application.getWorkItemNumber();
            ibpsPushService.lockWorkItem(sessionId, workItemNumber);
            ibpsPushService.setAttributes(application, sessionId, "update");
            ibpsPushService.unlockWorkItem(workItemNumber, sessionId);

        } catch (Exception e) {
            log.info("Error While IBPS Push for ARN : {}", arn, e);
            throw e;
        } finally {
            ibpsPushService.disconnectSession(sessionId, iBPSConfig.getIbpsPushUserName());

        }
        return application.getWorkItemNumber();
    }

    public String submitDocs(@NonNull final ApplicationDTO application) throws XmlMappingException,
            InstantiationException, IllegalAccessException, JAXBException, IOException, TemplateException {

        application.getApplicants().forEach(app -> {
            //app.setDocuments(docFacade.fetchDocs(app.getId()));
        });

        final String arn = application.getWorkItemNumber();
        log.info("Invoking updateIbpsApplication method in IbpsFacade for ARN : {}", arn);
        String workItemNumber = null;
        String sessionId = null;

        try {
            sessionId = ibpsPushService.createSession(iBPSConfig.getIbpsPushUserName(),
                    iBPSConfig.getIbpsPushUserPassword());

        } catch (Exception e) {
            log.info("Error While Creating session with IBPS for ARN : {}", arn);
            throw e;
        }

        try {
            workItemNumber = application.getWorkItemNumber();
            ibpsPushService.lockWorkItem(sessionId, workItemNumber);
            ibpsPushService.setAttributes(application, sessionId, "docSubmit");
            ibpsPushService.completeWorkItem(workItemNumber, sessionId);

        } catch (Exception e) {
            log.info("Error While IBPS Push for ARN : {}", arn, e);
            throw e;
        } finally {
            ibpsPushService.disconnectSession(sessionId, iBPSConfig.getIbpsPushUserName());

        }
        return application.getWorkItemNumber();

    }
}
*/