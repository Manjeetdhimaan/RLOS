package com.jmmb.los.pb.security;

import java.io.IOException;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import lombok.extern.slf4j.Slf4j;

@Component
@Order(1)
@Slf4j
public class UserAuthenticationFilter extends OncePerRequestFilter {
	@Value("${integration-checks.token-integration-enable}")
	private boolean isTokenEnabled;
	private static final String OPTIONS = "Options";

	private final ApplicationTokenValidator applicationTokenValidator;
	private final ApplicationSecurityConfig applicationSecurityConfig;

	@Autowired
	public UserAuthenticationFilter(final ApplicationTokenValidator applicationTokenValidator,
			final ApplicationSecurityConfig applicationSecurityConfig) {
		this.applicationTokenValidator = applicationTokenValidator;
		this.applicationSecurityConfig = applicationSecurityConfig;
	}

	@Override
	protected void doFilterInternal(final HttpServletRequest request, final HttpServletResponse response,
			final FilterChain filterChain) throws ServletException, IOException {
		boolean validToken = true;
		log.info("Invoking doFilterInternal in UserAuthenticationFilter...");
		if (isTokenEnabled) {
			if (!request.getMethod().equalsIgnoreCase(OPTIONS)) {// HTTP method
																	// type
				final String token = getTokenFromHeader(request);
				List<String> whiteList = applicationSecurityConfig.getWhiteList();
				if (!isWhiteListed(request.getRequestURI(), whiteList)) {
					log.info("Validating token");
					validToken = applicationTokenValidator.validateToken(token, request, response, true);
				}
			}
		} else {
			log.info("Token Service Disabled");
		}
		if (validToken) {
			filterChain.doFilter(request, response);
		}
		log.info("Exiting doFilterInternal in UserAuthenticationFilter...");
	}

	private boolean isWhiteListed(String requestURI, List<String> whiteList) {
		log.info("Checking isWhiteListed");
		for (String regexPattern : whiteList) {
			Pattern p = Pattern.compile(regexPattern);
			Matcher m = p.matcher(requestURI);
			if (m.find()) {
				log.info("URI {} is whitelisted", requestURI);
				return true;
			}
		}
		return false;
	}

	private String getTokenFromHeader(HttpServletRequest request) {
		log.info("Getting token from Header");
		String parameterValue = request.getHeader("authentication");
		log.info("token -> {}", parameterValue);
		return parameterValue;
	}
}
