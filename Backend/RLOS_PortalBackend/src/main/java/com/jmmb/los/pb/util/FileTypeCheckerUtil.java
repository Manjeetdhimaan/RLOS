package com.jmmb.los.pb.util;



import com.jmmb.los.pb.api.exception.InvalidRequestException;
import com.jmmb.los.pb.api.exception.InvalidRequestException.Code;

import eu.medsea.mimeutil.MimeType;
import eu.medsea.mimeutil.MimeUtil;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class FileTypeCheckerUtil {
	  private static final String MIME_DETECTOR = "eu.medsea.mimeutil.detector.MagicMimeMimeDetector";

	    private FileTypeCheckerUtil() {
	    }

	    public static void validateFileType(byte[] data, String docName) {

	        MimeUtil.registerMimeDetector(MIME_DETECTOR);
	        MimeType m = MimeUtil.getMostSpecificMimeType(MimeUtil.getMimeTypes(data));
	        MimeUtil.unregisterMimeDetector(MIME_DETECTOR);

	        if (isCorrectFileType(m)) {
	            log.info("The file Type is correct : " + m.toString());
	        } else {
	            log.error("The file Type is incorrect : " + m.toString() + "   InvalidFileTypeException.");
	            throw new InvalidRequestException("File Type is incorrect.", Code.DOCUMENT_UPLOAD_ERROR);
	        }

	       /* if (isCorrectFilenameExtension(docName, m)) {
	            log.info("The file Type " + m.getSubType() + " and file extension " + getFileExtension(docName)
	                    + " are same.");
	        } else {
	            log.info("The file Type " + m.getSubType() + " and file extension " + getFileExtension(docName)
	                    + " are different.  FileTypeAndFileExtensionDifferException");
	            throw new InvalidRequestException("File Type and File name extension are different.",
	                    Code.DOCUMENT_UPLOAD_ERROR);
	        }*/
	    }

	    private static String getFileExtension(String name) {
	        String[] nameArray = name.split("\\.");
	        return nameArray[nameArray.length - 1];
	    }

	    private static boolean isCorrectFilenameExtension(String name, MimeType mimeType) {
	        String extension = getFileExtension(name);

	        return (extension.equalsIgnoreCase(mimeType.getSubType()))
	                || ("jpg".equalsIgnoreCase(extension) && "jpeg".equalsIgnoreCase(mimeType.getSubType()));

	    }

	    private static boolean isCorrectFileType(MimeType mimeType) {

	        return (("image".equalsIgnoreCase(mimeType.getMediaType()))
	                && (("png".equalsIgnoreCase(mimeType.getSubType()))
	                        || ("jpeg".equalsIgnoreCase(mimeType.getSubType()))
	                        || ("jpg".equalsIgnoreCase(mimeType.getSubType()))))
	                || ("application".equalsIgnoreCase(mimeType.getMediaType())
	                		&& (("pdf".equalsIgnoreCase(mimeType.getSubType()))
	    	                        || ("msword".equalsIgnoreCase(mimeType.getSubType()))
	    	                        || ("octet-stream".equalsIgnoreCase(mimeType.getSubType()))
	    	                        || ("vnd.ms-excel".equalsIgnoreCase(mimeType.getSubType()))
	    	                        || ("x-hwp".equalsIgnoreCase(mimeType.getSubType())) 
	    	                        || ("vnd.openxmlformats-officedocument.spreadsheetml.sheet".equalsIgnoreCase(mimeType.getSubType()))
	    	                        || ("vnd.openxmlformats-officedocument.wordprocessingml.document".equalsIgnoreCase(mimeType.getSubType()))))
	                ||("text".equalsIgnoreCase(mimeType.getMediaType())&& (("plain".equalsIgnoreCase(mimeType.getSubType()))
	                		||("octet-stream".equalsIgnoreCase(mimeType.getSubType()))));
	                		}

	    public static boolean isImageFileType(byte[] data) {
	        MimeUtil.registerMimeDetector(MIME_DETECTOR);
	        MimeType mimeType = MimeUtil.getMostSpecificMimeType(MimeUtil.getMimeTypes(data));
	        MimeUtil.unregisterMimeDetector(MIME_DETECTOR);

	        return ("image".equalsIgnoreCase(mimeType.getMediaType())) && (("tiff".equalsIgnoreCase(mimeType.getSubType()))
	                || ("png".equalsIgnoreCase(mimeType.getSubType())) || ("jpeg".equalsIgnoreCase(mimeType.getSubType()))
	                || ("gif".equalsIgnoreCase(mimeType.getSubType())));
	    }

	    public static boolean isPdfFileType(byte[] data) {
	        MimeUtil.registerMimeDetector(MIME_DETECTOR);
	        MimeType mimeType = MimeUtil.getMostSpecificMimeType(MimeUtil.getMimeTypes(data));
	        MimeUtil.unregisterMimeDetector(MIME_DETECTOR);

	        return ("application".equalsIgnoreCase(mimeType.getMediaType())) && (("pdf".equalsIgnoreCase(mimeType.getSubType()))
                    || ("msword".equalsIgnoreCase(mimeType.getSubType()))
                    || ("vnd.ms-excel".equalsIgnoreCase(mimeType.getSubType()))
                    || ("vnd.openxmlformats-officedocument.spreadsheetml.sheet".equalsIgnoreCase(mimeType.getSubType()))
                    || ("vnd.openxmlformats-officedocument.wordprocessingml.document".equalsIgnoreCase(mimeType.getSubType())));
    		
	    }

	}