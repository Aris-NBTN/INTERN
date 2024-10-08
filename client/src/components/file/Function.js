import { toastError } from '~/components/toast';

export const handleDownload = async (name, downloadUrl) => {
    if (!downloadUrl) return;
    try {
        const image = await fetch(downloadUrl);
        if (!image.ok) {
            toastError("Tải xuống bị lỗi", "File không tồn tại hoặc đã bị xóa khỏi hệ thống");
            return;
        }
        const imageBlob = await image.blob();
        const imageURL = URL.createObjectURL(imageBlob);

        const anchor = document.createElement("a");
        anchor.href = imageURL;
        anchor.download = name || "newFile.jpeg";

        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(imageURL);

    } catch (error) {
        toastError("Tải xuống bị lỗi", "File không tồn tại hoặc đã bị xóa khỏi hệ thống");
    }
};
