package com.los.pb.resume.util;

import java.nio.ByteBuffer;
import java.security.InvalidKeyException;
import java.security.Key;
import java.security.NoSuchAlgorithmException;

import javax.crypto.Mac;

public class HmacOneTimePasswordGenerator {
	
    private final String algorithm;
    private final int passwordLength;
    private final int modDivisor;

    public static final int DEFAULT_PASSWORD_LENGTH = 6;

    /**
     * The HMAC algorithm specified by the HOTP standard.
     * But Changed the default algorithm from HmacSHA1 to HmacSHA256 for requirement.
     */
    public static final String HOTP_HMAC_ALGORITHM = "HmacSHA256";


    public HmacOneTimePasswordGenerator() throws NoSuchAlgorithmException {
        this(DEFAULT_PASSWORD_LENGTH);
    }

    /**
     * Creates a new HMAC-based one-time password (HOTP) generator using the given password length.
     *
     * @param passwordLength the length, in decimal digits, of the one-time passwords to be generated; must be between
     * 6 and 8, inclusive
  
     */
    public HmacOneTimePasswordGenerator(final int passwordLength) throws NoSuchAlgorithmException {
        this(passwordLength, HOTP_HMAC_ALGORITHM);
    }

    protected HmacOneTimePasswordGenerator(final int passwordLength, final String algorithm) throws NoSuchAlgorithmException {
        switch (passwordLength) {
        	case 4: {
        		this.modDivisor = 10_000;
        		break;
        	}
        
            case 6: {
                this.modDivisor = 1_000_000;
                break;
            }

            case 7: {
                this.modDivisor = 10_000_000;
                break;
            }

            case 8: {
                this.modDivisor = 100_000_000;
                break;
            }

            default: {
                throw new IllegalArgumentException("Password length must be between 6 and 8 digits.");
            }
        }

        this.passwordLength = passwordLength;

        // Our purpose here is just to throw an exception immediately if the algorithm is spurious.
        Mac.getInstance(algorithm);
        this.algorithm = algorithm;
    }

    
    public int generateOneTimePassword(final Key key, final long counter) throws InvalidKeyException {
        final Mac mac;

        try {
            mac = Mac.getInstance(this.algorithm);
            mac.init(key);
        } catch (final NoSuchAlgorithmException e) {
            // This should never happen since we verify that the algorithm is legit in the constructor.
            throw new RuntimeException(e);
        }

        final ByteBuffer buffer = ByteBuffer.allocate(8);
        buffer.putLong(0, counter);

        final byte[] hmac = mac.doFinal(buffer.array());
        final int offset = hmac[hmac.length - 1] & 0x0f;

        for (int i = 0; i < 4; i++) {
            // Note that we're re-using the first four bytes of the buffer here; we just ignore the latter four from
            // here on out.
            buffer.put(i, hmac[i + offset]);
        }

        final int hotp = buffer.getInt(0) & 0x7fffffff;

        return hotp % this.modDivisor;
    }

    /**
     * Returns the length, in decimal digits, of passwords produced by this generator.
     *
     * @return the length, in decimal digits, of passwords produced by this generator
     */
    public int getPasswordLength() {
        return this.passwordLength;
    }

    /**
     * Returns the name of the HMAC algorithm used by this generator.
     *
     * @return the name of the HMAC algorithm used by this generator
     */
    public String getAlgorithm() {
        return this.algorithm;
    }
}
