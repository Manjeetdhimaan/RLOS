package com.jmmb.los.pb.util;

import java.io.StringWriter;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;

import lombok.NonNull;

public class JaxBUtil {

    private JaxBUtil() {
    }

    public static String unMarhsal() {
        //TODO : Implementation pending
        return null;
    }

    public static <T> String marshal(@NonNull final Class<T> responseType, T t, boolean fragment, boolean format)
            throws JAXBException {
        StringWriter sw = new StringWriter();
        JAXBContext context = JAXBContext.newInstance(responseType);
        Marshaller marshaller = context.createMarshaller();
        marshaller.setProperty(Marshaller.JAXB_FRAGMENT, fragment);
        marshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, format);
        marshaller.marshal(t, sw);
        return sw.toString();
    }

}
