package quanta.service.exports;

import java.io.FileOutputStream;
import java.io.InputStream;
import org.apache.commons.compress.archivers.tar.TarArchiveEntry;
import org.apache.commons.compress.archivers.tar.TarArchiveOutputStream;
import org.apache.commons.compress.compressors.gzip.GzipCompressorOutputStream;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import quanta.exception.base.RuntimeEx;

@Component
@Scope("prototype")
public class ExportTarService extends ExportArchiveBase {
    private static Logger log = LoggerFactory.getLogger(ExportTarService.class);
    private TarArchiveOutputStream out = null;
    private boolean gzip = false;

    @Override
    public void openOutputStream(String fileName) {
        log.debug("Opening Export File: " + fileName);
        try {
            out = gzip ? new TarArchiveOutputStream(new GzipCompressorOutputStream(new FileOutputStream(fileName)))
                    : new TarArchiveOutputStream(new FileOutputStream(fileName));
            // TAR has an 8 gig file limit by default, this gets around that
            out.setBigNumberMode(TarArchiveOutputStream.BIGNUMBER_STAR);
            // TAR originally didn't support long file names, so enable the support for it
            out.setLongFileMode(TarArchiveOutputStream.LONGFILE_GNU);
            out.setAddPaxHeadersForNonAsciiNames(true);
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
            TarArchiveEntry tarArchiveEntry = new TarArchiveEntry(fileName);
            tarArchiveEntry.setSize(bytes.length);
            out.putArchiveEntry(tarArchiveEntry);
            out.write(bytes);
        } catch (Exception ex) {
            throw new RuntimeEx(ex);
        } finally {
            try {
                out.closeArchiveEntry();
            } catch (Exception e) {
                throw new RuntimeEx(e);
            }
        }
    }

    @Override
    public void addEntry(String fileName, InputStream stream, long length) {
        while (fileName.startsWith("/")) {
            fileName = fileName.substring(1);
        }
        try {
            TarArchiveEntry entry = new TarArchiveEntry(fileName);
            // entry.setMode ( mode );
            // entry.setUserName ( "root" );
            // entry.setGroupName ( "root" );
            // entry.setSize ( content.getSize () );
            // entry.setModTime ( this.getTimestampProvider ().getModTime () );
            entry.setSize(length);
            out.putArchiveEntry(entry);
            IOUtils.copyLarge(stream, out, 0, length);
        } catch (Exception ex) {
            throw new RuntimeEx(ex);
        } finally {
            try {
                out.closeArchiveEntry();
            } catch (Exception e) {
                throw new RuntimeEx(e);
            }
        }
    }

    @Override
    public String getFileExtension() {
        return gzip ? "tar.gz" : "tar";
    }

    public void setUseGZip(boolean gzip) {
        this.gzip = gzip;
    }
}
