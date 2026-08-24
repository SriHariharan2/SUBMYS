package backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    // ================= Upload File =================

    public String uploadFile(MultipartFile file) {

        try {

            String filename = file.getOriginalFilename();

            String extension = "";

            if (filename != null && filename.contains(".")) {

                extension = filename.substring(
                        filename.lastIndexOf(".") + 1
                ).toLowerCase();

            }

            Map<?, ?> uploadResult;

            // ================= PDF =================

            if (extension.equals("pdf")) {

                uploadResult = cloudinary.uploader().upload(

                        file.getBytes(),

                        ObjectUtils.asMap(
                                "resource_type", "raw"
                        )

                );

            }

            // ================= PPT / PPTX =================

            else if (extension.equals("ppt") ||
                    extension.equals("pptx")) {

                uploadResult = cloudinary.uploader().upload(

                        file.getBytes(),

                        ObjectUtils.asMap(
                                "resource_type", "raw"
                        )

                );

            }

            // ================= Images / Videos =================

            else {

                uploadResult = cloudinary.uploader().upload(

                        file.getBytes(),

                        ObjectUtils.emptyMap()

                );

            }

            return uploadResult.get("secure_url").toString();

        }

        catch (IOException e) {

            throw new RuntimeException("Cloudinary upload failed.", e);

        }

    }

}