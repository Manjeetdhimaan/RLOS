package com.jmmb.los.pb.util;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Objects;
import java.util.Map.Entry;
import java.util.concurrent.ConcurrentHashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.jmmb.los.pb.security.ApplicationTokenValidator;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class InvalidTokenUtil {
	@Autowired
	private ApplicationTokenValidator tokenValidate;

	private ConcurrentHashMap<String, LocalDateTime> invalidTokenMap = new ConcurrentHashMap<>();
	
	public Map<String, LocalDateTime> getInvalidTokenMap() {
        return invalidTokenMap;
    }

    public boolean tokenValidator(String token, HttpServletRequest requestHttp, HttpServletResponse responseHttp)
			throws IOException {
        boolean isValidToken = false;
		int count = 0;

		try {
			if (invalidTokenMap.isEmpty()) {
			    isValidToken = updateMap(token, requestHttp, responseHttp);

			} else {
				for (Entry<String, LocalDateTime> e : invalidTokenMap.entrySet()) {
					if (e.getKey().equalsIgnoreCase(token)) {
						count++;
					}
				}
				if (count > 0) {
				    isValidToken = updateMap(null, requestHttp, responseHttp);
				} else {
				    isValidToken = updateMap(token, requestHttp, responseHttp);
				}
			}

		} catch (Exception e) {
			log.info("Exception from token method" + e);
		}
		return isValidToken;
	}
    
    private boolean updateMap(String token, HttpServletRequest requestHttp, HttpServletResponse responseHttp) throws IOException {
        boolean isValidToken = false;
        isValidToken = tokenValidate.validateToken(token, requestHttp, responseHttp, false);
        if (isValidToken) {
            invalidTokenMap.put(token, LocalDateTime.now());
        }
        return isValidToken;
    }
    @Scheduled(cron = "0 0/30 * * * ?")
	public void removeOlderEntries() {
		for (Map.Entry<String, LocalDateTime> map : invalidTokenMap.entrySet()) {
			int min = LocalDateTime.now().getMinute() - map.getValue().getMinute();
			if (min >= 30) {
				invalidTokenMap.remove(map.getKey(), map.getValue());
				log.info("entry deleted with time " + map.getValue());
			}
		}
	}
}
