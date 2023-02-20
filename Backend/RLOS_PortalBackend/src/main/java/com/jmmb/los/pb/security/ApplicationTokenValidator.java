package com.jmmb.los.pb.security;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.text.ParseException;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.jmmb.los.pb.api.exception.InvalidRequestException;
import com.jmmb.los.pb.api.exception.InvalidRequestException.Code;
import com.google.gson.Gson;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWEObject;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.DirectDecrypter;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class ApplicationTokenValidator {
	@Autowired
	private ApplicationSecurityConfig applicationSecurityConfig;

	@Autowired
	private ApplicationTokenProvider tokenProvider;

	private static final String ARN = "arn";
	private static final String IP = "ip";
	private static SecretKey signerSecretKey;
	private static SecretKey encryptionSecretKey;
	private static KeyGenerator signerKeyGen;
	private static KeyGenerator encryptionKeyGen;
	private static JWSVerifier hmacVerifier;
	private static final String INVALID_TOKEN = "Invalid Token";
	private boolean tokenValid = true;

	public boolean validateToken(String token, HttpServletRequest request, HttpServletResponse response, boolean generateToken)
			throws IOException {
		tokenValid = true;
		log.info("Invoking validateToken method in ApplicationTokenValidator");
		if (token == null) {
			log.debug("Invalid token as token is null");
			setTokenError(response, 401, INVALID_TOKEN, Code.TOKEN_FOUND_INVALID);
			return false;
		}

		initializeSecurityParams(applicationSecurityConfig);

		final JWTClaimsSet jwtClaimsSet = getClaimsFromToken(token, response);
		if (jwtClaimsSet == null) {
			return false;
		}

		checkTokenExpiration(response, jwtClaimsSet);

		final String tokenArn = (String) jwtClaimsSet.getClaim(ARN);
		log.debug("Token ARN-> {}", tokenArn);
		final String tokenIp = (String) jwtClaimsSet.getClaim(IP);
		log.debug("Token IP -> {}", tokenIp);

		String requestURI = request.getRequestURI();
		Pattern p = Pattern.compile("api/applications/.*$");
		Matcher m = p.matcher(requestURI);
		String reqArn = extractArnFromRequest(request, m);
		log.debug("Request ARN-> {}", reqArn);
		String requestIp = request.getRemoteAddr();
		log.debug("Request IP -> {}", requestIp);

		validateToken(response, reqArn, requestIp, tokenArn, tokenIp);

		// If this is a token refresh call and previous token is validated then
		// generate new one
		if (tokenValid) {
			// token successFully validated
			log.debug("token successFully validated");

			// if(requestURI.contains("rlos/api/application/TOKENREFRESH")) {
			// if (requestURI.contains("api/applications/refreshToken")) {
			// TokenCreationParameters tc = new TokenCreationParameters(reqArn,
			// requestIp);
			// //response.setHeader("authorization",
			// tokenProvider.generateToken(tc));
			// response.setHeader("authentication",
			// tokenProvider.generateToken(tc));
			// response.setHeader("Access-Control-Expose-Headers",
			// "authentication");
			// }
			if(generateToken) {
			TokenCreationParameters tc = new TokenCreationParameters(reqArn, requestIp);
			// response.setHeader("authorization",
			// tokenProvider.generateToken(tc));
			response.setHeader("authentication", tokenProvider.generateToken(tc));
			response.setHeader("Access-Control-Expose-Headers", "authentication");
		}
		}

		log.info("Exiting validateToken method in ApplicationTokenValidator");
		return tokenValid;
	}

	private String extractArnFromRequest(HttpServletRequest request, Matcher m) {
		log.info("Invoking extractArnFromRequest method in ApplicationTokenValidator");
		String arnFromRequest = StringUtils.EMPTY;
		if (m.find()) {
			String[] splitRequest = request.getRequestURI().split("/");
			if(request.getRequestURI().contains("api/applications/getApplication")){
				arnFromRequest = splitRequest[5];
						
			}else{
				arnFromRequest = splitRequest[4];	
			}
			// arnFromRequest = splitRequest[5];
			
		}
		log.info("Exiting extractArnFromRequest method in ApplicationTokenValidator");
		return arnFromRequest;
	}

	private void validateToken(HttpServletResponse response, String reqArn, String requestIp, final String tokenArn,
			String tokenIp) throws IOException {

		log.info("Invoking validateToken method in ApplicationTokenValidator");
		log.debug("With ARN->" + tokenArn);

		// user initiated same application with different device
		isTokenfromDiffDevice(response, requestIp, tokenIp);

		// user initiated different application with same device
		idTokenfromDiffApplication(response, reqArn, tokenArn);

	}

	private void idTokenfromDiffApplication(HttpServletResponse response, String requestArn, String tokenArn)
			throws IOException {
		log.info("Invoking idTokenfromDiffApplication method in ApplicationTokenValidator");
		if (!requestArn.equalsIgnoreCase(tokenArn)) {
			tokenValid = false;
			log.info("Invalid Token found in request. Token being used for another application.");
			setTokenError(response, 401, "Token being used for another application.", Code.TOKEN_FROM_DIFF_APPLICATION);
		}
		log.info("Exiting idTokenfromDiffApplication method in ApplicationTokenValidator");

	}

	private void isTokenfromDiffDevice(HttpServletResponse response, String requestIp, String tokenIp)
			throws IOException {
		log.info("Invoking isTokenfromDiffDevice method in ApplicationTokenValidator");
		if (!requestIp.equalsIgnoreCase(tokenIp)) {
			tokenValid = false;
			log.info("Invalid Token found in request. Token being used from a different device.");
			setTokenError(response, 401, "Token being used from a different device.", Code.TOKEN_FROM_DIFF_DEVICE);
		}
		log.info("Exiting isTokenfromDiffDevice method in ApplicationTokenValidator");
	}

	private void checkTokenExpiration(HttpServletResponse response, final JWTClaimsSet jwtClaimsSet)
			throws IOException {
		log.info("Invoking checkTokenExpiration method in ApplicationTokenValidator");
		if (isTokenExpired(jwtClaimsSet)) {
			tokenValid = false;
			log.info("Session has expired");
			setTokenError(response, 401, "Session has expired", Code.TOKEN_SESSION_TIMEOUT);
		}
		log.info("Exiting checkTokenExpiration method in ApplicationTokenValidator");
	}

	private boolean isTokenExpired(JWTClaimsSet claims) {
		return claims.getExpirationTime().getTime() < System.currentTimeMillis();
	}

	private JWTClaimsSet getClaimsFromToken(String token, HttpServletResponse response) throws IOException {
		log.info("Getting Claims from Token...");
		// Parse the JWE string
		JWEObject jweObject;

		try {
			jweObject = JWEObject.parse(token);

			if (!Objects.isNull(encryptionSecretKey)) {
				String secret = applicationSecurityConfig.getEncryptionSecretKey();
				byte[] secretKey = secret.getBytes();
				jweObject.decrypt(new DirectDecrypter(secretKey));
			} else {
				setTokenError(response, 401, INVALID_TOKEN, Code.TOKEN_FOUND_INVALID);
				return null;
			}

			// Extract payload
			SignedJWT signedJWT = jweObject.getPayload().toSignedJWT();
			if (!signedJWT.verify(hmacVerifier)) {
				log.debug("Unable to perform sign verification");
			}
			return signedJWT.getJWTClaimsSet();
		} catch (ParseException e) {
			log.error("Unable to parse token", e);
			setTokenError(response, 401, INVALID_TOKEN, Code.TOKEN_FOUND_INVALID);
			return null;
		} catch (JOSEException e) {
			log.error("Token Overridden.", e);
			setTokenError(response, 401, "Token Overridden.", Code.TOKEN_OVERRIDDEN);
			return null;
		}
	}

	/**
	 * This method will be used to initialize the security params In memory HMAC
	 * and Encryption keys
	 *
	 * @param applicationSecurityConfig
	 */
	public static void initializeSecurityParams(ApplicationSecurityConfig applicationSecurityConfig) {
		log.info("Initializing Securinty Params...");
		try {
			ApplicationTokenValidator.signerKeyGen = KeyGenerator
					.getInstance(applicationSecurityConfig.getKeyGenrationAlgo());
			// Generate 256-bit AES key for HMAC
			ApplicationTokenValidator.signerKeyGen.init(applicationSecurityConfig.getHmacKeySize());
			ApplicationTokenValidator.signerSecretKey = signerKeyGen.generateKey();

			// Create HMAC verifier
			ApplicationTokenValidator.hmacVerifier = new MACVerifier(signerSecretKey.getEncoded());
			// Generate 128-bit AES key for encryption
			ApplicationTokenValidator.encryptionKeyGen = KeyGenerator
					.getInstance(applicationSecurityConfig.getKeyGenrationAlgo());
			ApplicationTokenValidator.encryptionKeyGen.init(applicationSecurityConfig.getEncrptionKeySize());
			ApplicationTokenValidator.encryptionSecretKey = encryptionKeyGen.generateKey();
		} catch (NoSuchAlgorithmException | JOSEException e) {
			log.error("Exception occured while creating HMAC and Encrption keys " + e);
		}

	}

	private void setTokenError(HttpServletResponse response, int status, String errorMsg, Code errorCode)
			throws IOException {
		String errorString = new Gson().toJson(new InvalidRequestException(errorMsg, errorCode));

		response.setStatus(status);
		response.sendError(401, errorString);
	}
}
