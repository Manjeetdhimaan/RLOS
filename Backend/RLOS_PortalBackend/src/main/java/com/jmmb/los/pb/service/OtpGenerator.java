package com.jmmb.los.pb.service;

import java.security.InvalidKeyException;
import java.security.Key;
import java.security.NoSuchAlgorithmException;
import java.util.Date;

import javax.crypto.KeyGenerator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OtpGenerator {

    @Autowired
    private TimeBasedOneTimePasswordGenerator timeBasedOneTimePasswordGenerator;

    public String generateOTP() throws NoSuchAlgorithmException, InvalidKeyException {
        Date dateTimeNow = new Date();
        final Key otpGenerated;
        final KeyGenerator keyGenerator = KeyGenerator.getInstance(timeBasedOneTimePasswordGenerator.getAlgorithm());
        // SHA-1 and SHA-256 prefer 64-byte (512-bit) keys; SHA512 prefers
        // 128-byte keys
        keyGenerator.init(512);
        otpGenerated = keyGenerator.generateKey();
        return String.format("%06d",
                timeBasedOneTimePasswordGenerator.generateOneTimePassword(otpGenerated, dateTimeNow));
    }

}
