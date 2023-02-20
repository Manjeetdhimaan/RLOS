package com.jmmb.los.pb.ibps.integrationservice;

import java.io.StringReader;
import java.util.Objects;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.Unmarshaller;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;

import com.jmmb.los.pb.ibps.dto.IbpsResponse;

import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;

@Repository
@Slf4j
public class IbpsIntegrationService {

    public <T extends IbpsResponse> T executeIbpsRequest(@NonNull final String url,
            @NonNull final HttpMethod httpMethod, @NonNull final HttpEntity<String> requestEntity,
            @NonNull final Class<T> responseType) {
        log.info("Invoking executeIbpsRequest() method in IbpsIntegrationService");
        log.info("Params for executeIbpsRequest method is: url->" + url + ", responseType->" + responseType);
        RestTemplate rest = new RestTemplate();
        ResponseEntity<String> response = null;
        try {
            response = rest.exchange(url, httpMethod, requestEntity, String.class);
            log.info("Response from IBPS API: " + response.getBody());

            if (!Objects.isNull(response.getBody()) && response.getBody().contains("MainCode")) {
                JAXBContext jaxbContext = JAXBContext.newInstance(responseType);
                Unmarshaller unmarshaller = jaxbContext.createUnmarshaller();
                String resBody = response.getBody();
                resBody = resBody.replace("<?xml version=\"1.0\"?>", "");
                return responseType.cast(unmarshaller.unmarshal(new StringReader(resBody)));
            }
            final T ibpsResponse = responseType.newInstance();
            ibpsResponse.setExceptionMsg(response.getBody());
            log.debug("Error Occured with message: {}", response.getBody());
            log.info("Exiting executeIbpsRequest() method in IbpsIntegrationService");
            return ibpsResponse;
        } catch (Exception ex) {            
        	log.info("Exception occurred while connecting to iBPS: {}", ex);
        }
        return null;
    }

}
