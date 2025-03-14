package quanta.service.exports;

import java.io.FileOutputStream;
import java.io.InputStream;
import org.apache.commons.compress.archivers.zip.ZipArchiveEntry;
import org.apache.commons.compress.archivers.zip.ZipArchiveOutputStream;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import quanta.exception.base.RuntimeEx;

@Component
@Scope("prototype")
public class ExportZipService extends ExportArchiveBase {
    private static Logger log = LoggerFactory.getLogger(ExportZipService.class);
    private ZipArchiveOutputStream out = null;

    @Override
    public void openOutputStream(String fileName) {
        log.debug("Opening Export File: " + fileName);
        try {
            out = new ZipArchiveOutputStream(new FileOutputStream(fileName));
        } catch (Exception ex) {
            throw new RuntimeEx(ex);
        }
    }

    @Override
    public void closeOutputStream() {
        try {
            if (out != null) {
                out.finish();
                out.close();
            }
        } catch (Exception ex) {
            throw new RuntimeEx(ex);
        }
    }

    @Override
    public void addEntry(String fileName, byte[] bytes) {
        while (fileName.startsWith("/")) {
            fileName = fileName.substring(1);
        }
        try {
            ZipArchiveEntry entry = new ZipArchiveEntry(fileName);
            // I saw this in an example but haven't tried using it.
            // CRC32 crc32 = new CRC32();
            // crc32.update(tail);
            // zipEntry.setCrc(crc32.getValue());
            entry.setSize(bytes.length);
            out.putArchiveEntry(entry);
            out.write(bytes);
            out.closeArchiveEntry();
        } catch (Exception ex) {
            throw new RuntimeEx(ex);
        }
    }

    @Override
    public void addEntry(String fileName, InputStream stream, long length) {
        while (fileName.startsWith("/")) {
            fileName = fileName.substring(1);
        }
        try {
            ZipArchiveEntry entry = new ZipArchiveEntry(fileName);
            entry.setSize(length);
            out.putArchiveEntry(entry);
            IOUtils.copyLarge(stream, out, 0, length);
            out.closeArchiveEntry();
        } catch (Exception ex) {
            throw new RuntimeEx(ex);
        }
    }

    @Override
    public String getFileExtension() {
        return "zip";
    }
}
