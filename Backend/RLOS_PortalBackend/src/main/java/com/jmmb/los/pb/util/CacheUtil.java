package com.jmmb.los.pb.util;

import org.apache.commons.codec.digest.DigestUtils;

import lombok.extern.slf4j.Slf4j;

import java.util.Arrays;

@Slf4j
public final class CacheUtil {

    private CacheUtil() {
        throw new UnsupportedOperationException("Do NOT instantiate libraries.");
    }

    /**
     * generateKey - helper method for generating a key for a cache
     * creates cache key: targetName.methodName.argument0.argument1...
     * @param cacheName the name of the cache
     * @param methodName the method being cached
     * @param arguments the parameters of said method
     * @return hashed key
     */
    public static String generateKey(String cacheName, String methodName, Object[] arguments) {
    	log.info("Generate Key for Cache");
        StringBuilder sb = new StringBuilder();
        sb.append(cacheName).append('.').append(methodName);
        if (arguments != null && arguments.length != 0) {
            for (Object o : arguments) {
                if (o != null) {
                    if (o.getClass().isArray()) {
                        sb.append('.').append(Arrays.toString((Object[]) o));
                    } else {
                        sb.append('.');
                        try {
                            sb.append(o.hashCode());
                        } catch (NullPointerException e) {
                            sb.append(o.toString());
                        }
                    }
                }
            }
        }
        return DigestUtils.sha1Hex(sb.toString());
    }
}
