package com.los.pb.resume.util;

import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.concurrent.TimeUnit;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.nimbusds.jose.EncryptionMethod;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWEAlgorithm;
import com.nimbusds.jose.JWEHeader;
import com.nimbusds.jose.JWEObject;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSSigner;
import com.nimbusds.jose.KeyLengthException;
import com.nimbusds.jose.Payload;
import com.nimbusds.jose.crypto.DirectEncrypter;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class ApplicationTokenProvider {
	private static final String ARN = "arn";
	private static final String IP = "ip";
	private static SecretKey signerSecretKey;
	private static KeyGenerator signerKeyGen;
	private static KeyGenerator encryptionKeyGen;
	private static JWSSigner hmacVerifier;

	@Autowired
	private ApplicationSecurityConfig applicationSecurityConfig;

	public String generateToken(String arn, String requestIp) {

		log.info("Invoking generateToken method in ApplicationTokenProvider");

		initializeSecurityParams(applicationSecurityConfig);

		Date now = new Date();
		final long tokenExpireTime = TimeUnit.MINUTES.toMillis(applicationSecurityConfig.getTokenExpirationTime());
		Date expiryDate = new Date(now.getTime() + tokenExpireTime);
		final JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder().subject(arn).claim(ARN, arn).claim(IP, requestIp)
				.issueTime(new Date()).expirationTime(expiryDate).build();

		SignedJWT signedJWT = new SignedJWT(new JWSHeader(JWSAlgorithm.HS256), jwtClaimsSet);
        // Apply the HMAC
		try {
			signedJWT.sign(hmacVerifier);
			log.info("HMAC applied !!!");
		} catch (JOSEException e) {
			log.error("Exception occured while Signing JWT token", e);
		}

		// Create JWE object with signed JWT as payload
		// "JWT" as a content type is being passed which is required
		// to signal the nested JWT

		 JWEObject jweObject = new JWEObject(
	                new JWEHeader.Builder(JWEAlgorithm.DIR, EncryptionMethod.A128CBC_HS256).contentType("JWT").build(),
	                new Payload(signedJWT));

		 // Perform encryption on the jweObject
		String secret = applicationSecurityConfig.getEncryptionSecretKey();
		byte[] secretKey = secret.getBytes();
		DirectEncrypter encrypter = null;
		try {
			encrypter = new DirectEncrypter(secretKey);
			log.info("Encryptor Creation done!!!");
		} catch (KeyLengthException e1) {
			log.error("Key lenth is not valid. Exception occured while encrypting signed token. "
					+ "This exception should never occured." + e1);
		}

		try {
			jweObject.encrypt(encrypter);
			log.info("Encryption done!!!");
		} catch (JOSEException e) {
			log.error("Exception occured while encrpting signed token. This exception should never occured. " + e);

		}
		// Serialize to JWE compact form
		String token = jweObject.serialize();

		log.debug("Token generated for arn : {} is {}", arn, token);
		log.info("Exiting generateToken method in ApplicationTokenProvider");
		return token;
	}

	/**
	 * This method will be used to initialize the security parameter in memory
	 * HMAC and Encryption keys
	 *
	 * @param applicationSecurityConfig
	 */
	public static void initializeSecurityParams(ApplicationSecurityConfig applicationSecurityConfig) {
		log.info("Invoking initializeSecurityParams method in ApplicationTokenProvider");
		try {
			ApplicationTokenProvider.signerKeyGen = KeyGenerator
					.getInstance(applicationSecurityConfig.getKeyGenrationAlgo());

			// Generate 256-bit AES key for HMAC
			ApplicationTokenProvider.signerKeyGen.init(applicationSecurityConfig.getHmacKeySize());
			log.info("Generated 256-bit AES key for HMAC...");
			ApplicationTokenProvider.signerSecretKey = signerKeyGen.generateKey();

			// Create HMAC signer
			ApplicationTokenProvider.hmacVerifier = new MACSigner(signerSecretKey.getEncoded());
			log.info("Created HMAC signer...");
			new MACVerifier(signerSecretKey.getEncoded());
			log.info("Created HMAC verifier...");

			// Generate 128-bit AES key for encryption
			ApplicationTokenProvider.encryptionKeyGen = KeyGenerator
					.getInstance(applicationSecurityConfig.getKeyGenrationAlgo());
			ApplicationTokenProvider.encryptionKeyGen.init(applicationSecurityConfig.getEncrptionKeySize());
			encryptionKeyGen.generateKey();

			log.info("Generated 128-bit AES key for encryption...");
		} catch (NoSuchAlgorithmException | JOSEException e) {
			log.error("Exception occured while creating HMAC and Encrption keys " + e);
		}
		log.info("Exiting initializeSecurityParams method in ApplicationTokenProvider");
	}
}
