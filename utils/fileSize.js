import { useState, useEffect } from "react";

const FileSizeDisplay = ({ fileUrl }) => {
  const [fileSize, setFileSize] = useState(null);
  const [loading, setLoading] = useState(false); // สถานะ loading

  useEffect(() => {
    const getFileSize = async () => {
      setLoading(true); // ตั้ง loading เป็น true ตอนที่เริ่มดึงข้อมูล
      try {
        const response = await fetch(fileUrl, { method: "HEAD" }); // ใช้ HEAD เพื่อดึง headers
        const size = response.headers.get("Content-Length"); // ดึงค่า Content-Length
        setFileSize(size);
      } catch (error) {
        console.error("Error fetching file size:", error);
      } finally {
        setLoading(false); // ตั้ง loading เป็น false เมื่อเสร็จหรือเกิดข้อผิดพลาด
      }
    };

    if (fileUrl) {
      getFileSize();
    }
  }, [fileUrl]);

  return (
    <div>
      {loading ? (
        <p>Loading file size...</p> // แสดงข้อความขณะกำลังโหลด
      ) : fileSize ? (
        <p>{(fileSize / (1024 * 1024)).toFixed(2)} MB</p> // แปลงขนาดจาก byte เป็น MB
      ) : (
        <p>No file size available.</p> // กรณีไม่มีขนาดไฟล์
      )}
    </div>
  );
};

export default FileSizeDisplay;
