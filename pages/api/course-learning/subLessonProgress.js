import connectionPool from "@/utils/db";

// เอาไว้สร้างเก็บ Progress สำหรับ Sublesson ใน User แต่ละคน

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { lessons, user } = req.body;

  if (!Array.isArray(lessons) || lessons.length === 0) {
    return res.status(400).json({ error: "Invalid lessons data" });
  }

  try {
    const subLessons = lessons.flatMap((lesson) =>
      lesson.sub_lessons.map((subLesson) => subLesson.sub_lesson_id)
    );

    const values = subLessons
      .map((id) => `(${id}, 'not-started',${user.id})`)
      .join(", ");

    const query = `INSERT INTO sub_lesson_progress (sub_lesson_id, progress_status, user_id) VALUES ${values};`;

    await connectionPool.query(query);

    res
      .status(200)
      .json({ message: "Lessons and sub-lessons added successfully" });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
  