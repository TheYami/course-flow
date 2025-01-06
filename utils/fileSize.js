import { useState, useEffect } from "react";

const FileSizeDisplay = ({ fileUrl }) => {
  const [fileSize, setFileSize] = useState(null);

  useEffect(() => {
    const getFileSize = async () => {
      try {
        const response = await fetch(fileUrl, { method: "HEAD" }); // ใช้ HEAD เพื่อดึง headers โดยไม่ต้องโหลดเนื้อหาทั้งหมด
        const size = response.headers.get("Content-Length"); // ดึงค่า Content-Length ซึ่งคือขนาดไฟล์
        setFileSize(size);
      } catch (error) {
        console.error("Error fetching file size:", error);
      }
    };

    if (fileUrl) {
      getFileSize();
    }
  }, [fileUrl]);

  return (
    <div>
      {fileSize ? (
        <p>{(fileSize / (1024 * 1024)).toFixed(2)} MB</p> // แปลงขนาดจาก byte เป็น MB
      ) : (
        <p>Loading file size...</p>
      )}
    </div>
  );
};

export default FileSizeDisplay;
