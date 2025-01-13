import pool from "../../../../utils/db.js";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const { promoCodeId } = req.query;
    const {
      promoCode,
      minimumPurchase,
      discountType,
      discountValue,
      selectedCourses,
    } = req.body;

    if (!promoCodeId) {
      return res.status(400).json({ error: "PromoCode ID is required" });
    }

    try {
      // Fetch current promo code data
      const currentPromoCodeQuery = `
        SELECT code, min_price, discount_type, discount 
        FROM promo_codes 
        WHERE promo_code_id = $1
      `;
      const result = await pool.query(currentPromoCodeQuery, [promoCodeId]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "PromoCode not found." });
      }
      const currentData = result.rows[0];

      // Check for changes in promoCode fields
      const isPromoCodeChanged =
        promoCode.trim().toLowerCase() !==
        currentData.code.trim().toLowerCase();

      const isOtherFieldsChanged =
        parseFloat(minimumPurchase) !== parseFloat(currentData.min_price) ||
        discountType !== currentData.discount_type ||
        parseFloat(discountValue) !== parseFloat(currentData.discount);

      // Fetch current courses associated with promoCodeId
      const { rows: existingRows } = await pool.query(
        "SELECT course_id FROM course_promocode WHERE promo_code_id = $1",
        [promoCodeId]
      );
      const existingCourses = existingRows.map((row) => row.course_id);

      // Check for changes in selectedCourses
      const coursesToAdd = selectedCourses.filter(
        (id) => !existingCourses.includes(id)
      );
      const coursesToRemove = existingCourses.filter(
        (id) => !selectedCourses.includes(id)
      );
      const isCoursesChanged =
        coursesToAdd.length > 0 || coursesToRemove.length > 0;

      // If no changes detected, return early
      if (!isPromoCodeChanged && !isOtherFieldsChanged && !isCoursesChanged) {
        return res.status(200).json({
          message: "No changes detected. PromoCode not updated.",
        });
      }

      // Check for duplicate promoCode if promoCode has changed
      if (isPromoCodeChanged) {
        const duplicateCheckQuery = `
          SELECT promo_code_id FROM promo_codes 
          WHERE LOWER(TRIM(code)) = LOWER(TRIM($1)) 
            AND promo_code_id != $2
        `;
        const duplicateResult = await pool.query(duplicateCheckQuery, [
          promoCode.trim(),
          promoCodeId,
        ]);
        if (duplicateResult.rows.length > 0) {
          return res.status(400).json({
            error: "PromoCode already exists. Please use a unique code.",
          });
        }
      }

      // Update promo_codes if promoCode or other fields have changed
      if (isPromoCodeChanged || isOtherFieldsChanged) {
        const updateQuery = `
          UPDATE promo_codes
          SET 
            code = $1,
            min_price = $2,
            discount_type = $3,
            discount = $4
          WHERE promo_code_id = $5
        `;
        await pool.query(updateQuery, [
          promoCode.trim(),
          minimumPurchase,
          discountType,
          discountValue,
          promoCodeId,
        ]);
      }

      // Update course_promocode if selectedCourses have changed
      if (isCoursesChanged) {
        if (coursesToAdd.length > 0) {
          const values = coursesToAdd
            .map((id) => `(${promoCodeId}, ${id})`)
            .join(", ");
          await pool.query(`
            INSERT INTO course_promocode (promo_code_id, course_id)
            VALUES ${values}
          `);
        }

        if (coursesToRemove.length > 0) {
          await pool.query(
            `
            DELETE FROM course_promocode
            WHERE promo_code_id = $1 AND course_id = ANY($2::int[])
          `,
            [promoCodeId, coursesToRemove]
          );
        }
      }

      res.status(200).json({
        message: "PromoCode updated successfully.",
        updatedPromoCode: {
          promoCode,
          minimumPurchase,
          discountType,
          discountValue,
        },
        addedCourses: coursesToAdd,
        removedCourses: coursesToRemove,
      });
    } catch (error) {
      console.error("Error updating PromoCode:", error);
      res.status(500).json({
        error: "Failed to update PromoCode.",
        details: error.message,
      });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
