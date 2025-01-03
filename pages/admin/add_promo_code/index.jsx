import React, { useState, useEffect } from "react";
import Sidebar from "@/components/admin/AdminSidebar";
import axios from "axios";
import { XICon, AlertIcon } from "@/assets/icons/admin_icon/adminIcon";
import useAdminAuth from "@/hooks/useAdminAuth";
import { useRouter } from "next/router";

const AdminPanelAddPromoCode = () => {
  const [allCourses, setAllCourses] = useState([
    { course_id: 0, course_name: "All courses" },
  ]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    promoCode: "",
    minimumPurchase: "",
    discountType: "fixed",
    fixedAmount: "",
    percent: "",
  });
  const [isFillForm, setIsFillForm] = useState({
    promoCode: "",
    minimumPurchase: "",
    discountType: "",
    fixedAmount: "",
    percent: "",
    selectedCourses: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAllCourseSelected, setIsAllCourseSelected] = useState(false);
  const { loading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get("/api/admin/fetch_all_courses");
        setAllCourses((prevCourses) => {
          const newCourses = data.data;
          return [
            ...prevCourses,
            ...newCourses.filter(
              (course) =>
                !prevCourses.some(
                  (prevCourse) => prevCourse.course_id === course.course_id
                )
            ),
          ];
        });
      } catch (error) {
        setError("Failed to load courses.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, [loading]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleToggleCourse = (course) => {
    if (course.course_name === "All courses") {
      setSelectedCourses(isAllCourseSelected ? [] : [course]);
      setIsAllCourseSelected(!isAllCourseSelected);
    } else {
      setSelectedCourses((prevSelectedCourses) => {
        if (prevSelectedCourses.some((c) => c.course_id === course.course_id)) {
          return prevSelectedCourses.filter(
            (c) => c.course_id !== course.course_id
          );
        } else {
          return [...prevSelectedCourses, course].filter(
            (c) => c.course_name !== "All courses"
          );
        }
      });
      setIsAllCourseSelected(false);
    }
  };

  const handleRemoveCourse = (courseId) => {
    setSelectedCourses((prev) => prev.filter((c) => c.course_id !== courseId));
  };

  const validateForm = () => {
    let isValid = true;
    const updatedIsFillForm = { ...isFillForm };

    if (formData.promoCode.trim() === "") {
      updatedIsFillForm.promoCode = false;
      isValid = false;
    } else {
      updatedIsFillForm.promoCode = true;
    }

    if (
      formData.minimumPurchase.trim() === "" ||
      parseFloat(formData.minimumPurchase) <= 0
    ) {
      updatedIsFillForm.minimumPurchase = false;
      isValid = false;
    } else {
      updatedIsFillForm.minimumPurchase = true;
    }

    if (
      formData.discountType !== "Fixed amount" &&
      formData.discountType !== "Percent"
    ) {
      updatedIsFillForm.discountType = false;
      isValid = false;
    } else {
      updatedIsFillForm.discountType = true;
    }

    if (formData.discountType === "Fixed amount") {
      if (
        parseFloat(formData.fixedAmount) <= 0 ||
        formData.fixedAmount === ""
      ) {
        updatedIsFillForm.fixedAmount = false;
        isValid = false;
      } else {
        updatedIsFillForm.fixedAmount = true;
      }
    } else if (formData.discountType === "Percent") {
      if (
        parseFloat(formData.percent) <= 0 ||
        parseFloat(formData.percent) > 100 ||
        formData.percent === ""
      ) {
        updatedIsFillForm.percent = false;
        isValid = false;
      } else {
        updatedIsFillForm.percent = true;
      }
    }

    if (selectedCourses.length === 0) {
      updatedIsFillForm.selectedCourses = false;
      isValid = false;
    } else {
      updatedIsFillForm.selectedCourses = true;
    }

    setIsFillForm(updatedIsFillForm);

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //setIsLoading(true);

    if (!validateForm()) {
      return;
    }

    const payload = {
      promoCode: formData.promoCode,
      minimumPurchase: formData.minimumPurchase,
      discountType: formData.discountType,
      discountValue:
        formData.discountType === "Fixed amount"
          ? formData.fixedAmount
          : formData.percent,
      selectedCourses:
        isAllCourseSelected === true
          ? allCourses
              .map((course) => course.course_id)
              .filter((courseId) => courseId !== 0)
          : selectedCourses.map((course) => course.course_id),
    };
    console.log(payload);

    try {
      const storedToken = localStorage.getItem(
        "sb-iyzmaaubmvzitbqdicbe-auth-token"
      );
      const parsedToken = JSON.parse(storedToken);
      const accessToken = parsedToken?.access_token;

      if (!accessToken) {
        setIsLoading(false);
        alert("Not authenticated");
        return;
      }
      const response = await axios.post(
        "/api/admin/create_promo_code",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        console.log(
          "Promo code created successfully:",
          response.data.promocode
        );
        router.push("/admin/promo_code");
      } else {
        console.error("Error creating promo code:", response.data.message);
        alert("Error: " + response.data.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/promo_code");
  };

  return (
    <div className="flex">
      {isLoading && (
        <div className="absolute inset-0 bg-[#FFFFFF] bg-opacity-20 flex items-center justify-center z-10">
          <div className="loader border-t-4 border-[#2F5FAC] w-12 h-12 rounded-full animate-spin"></div>
        </div>
      )}
      <Sidebar />
      <div className="flex-1 bg-[#F6F7FC]">
        <div className="flex bg-[#FFFFFF] justify-between items-center p-6 mb-6 border-b shadow-sm">
          <h1 className="text-2xl font-bold">Add Promo Code</h1>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-button w-[120px] h-[60px] px-8 py-[18px] text-[#F47E20] font-[700] border border-[#F47E20] rounded-[12px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-[#2F5FAC] hover:bg-white hover:text-[#2F5FAC] hover:border hover:border-[#2F5FAC] text-[#FFFFFF] create-button w-[120px] h-[60px] px-8 py-[18px] font-[700] rounded-[12px] flex justify-center items-center"
            >
              Create
            </button>
          </div>
        </div>
        <div className="pt-4">
          <form className="bg-[#FFFFFF] shadow-md rounded-xl py-10 px-32 mx-20">
            <div className="grid grid-cols-2 gap-x-12 mb-8">
              <div className="flex flex-col">
                <label className="mb-2 font-medium">Set promo code*</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    name="promoCode"
                    value={formData.promoCode}
                    onChange={handleInputChange}
                    className={`border-1 rounded-md p-2 w-full ${
                      isFillForm.promoCode === false
                        ? "border-[#9B2FAC] focus:border-[#9B2FAC] focus:outline-none"
                        : "border-[#D6D9E4] focus:border-[#F47E20] focus:outline-none"
                    }`}
                  />
                  {isFillForm.promoCode === false && (
                    <p className="absolute text-[#9B2FAC] text-sm mt-1">
                      Please fill out this field
                    </p>
                  )}
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9B2FAC]">
                    {isFillForm.promoCode === false && <AlertIcon />}
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <label className="mb-2 font-medium">
                  Minimum purchase amount (THB)*
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Enter amount"
                    name="minimumPurchase"
                    value={formData.minimumPurchase}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value < 0) {
                        setFormData((prev) => ({
                          ...prev,
                          minimumPurchase: "0",
                        }));
                      } else {
                        handleInputChange(e);
                      }
                    }}
                    className={`border-1 rounded-md p-2 w-full ${
                      isFillForm.promoCode === false
                        ? "border-[#9B2FAC] focus:border-[#9B2FAC] focus:outline-none"
                        : "border-[#D6D9E4] focus:border-[#F47E20] focus:outline-none"
                    }`}
                  />
                  {isFillForm.promoCode === false && (
                    <p className="absolute text-[#9B2FAC] text-sm mt-1">
                      Please fill out this field
                    </p>
                  )}
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9B2FAC]">
                    {isFillForm.promoCode === false && <AlertIcon />}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-12 mb-8">
              <div className="col-span-2">
                <label className="font-medium">Select discount type</label>
                <div className="flex items-center gap-x-[19.7rem] mt-4">
                  {["Fixed amount", "Percent"].map((type) => (
                    <div
                      key={type}
                      className="flex items-center gap-x-2 text-[#424C6B]"
                    >
                      <input
                        type="radio"
                        id={`discount-${type}`}
                        name="discountType"
                        checked={formData.discountType === type}
                        onChange={() => {
                          setFormData((prev) => ({
                            ...prev,
                            discountType: type,
                            fixedAmount:
                              type === "Fixed amount" ? prev.fixedAmount : "",
                            percent: type === "Percent" ? prev.percent : "",
                          }));
                        }}
                        className="h-4 w-4 cursor-pointer"
                      />
                      <label
                        htmlFor={`discount-${type}`}
                        className="text-sm font-medium"
                      >
                        {type === "Fixed amount"
                          ? "Fixed amount (THB)"
                          : "Percent (%)"}
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder={
                            type === "Fixed amount" ? "THB" : "Percent"
                          }
                          value={
                            formData[
                              type === "Fixed amount"
                                ? "fixedAmount"
                                : "percent"
                            ]
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            if (type === "Percent" && value > 100) {
                              setFormData((prev) => ({
                                ...prev,
                                percent: "100",
                              }));
                            }
                            if (type === "Percent" && value < 0) {
                              setFormData((prev) => ({
                                ...prev,
                                percent: "0",
                              }));
                            }
                            if (type === "Fixed amount" && value < 0) {
                              setFormData((prev) => ({
                                ...prev,
                                fixedAmount: "0",
                              }));
                            } else {
                              handleInputChange(e);
                            }
                          }}
                          name={
                            type === "Fixed amount" ? "fixedAmount" : "percent"
                          }
                          disabled={formData.discountType !== type}
                          className={`border-1 rounded px-2 py-1 w-40 ${
                            (type === "Fixed amount" &&
                              isFillForm.fixedAmount === false) ||
                            (type === "Percent" && isFillForm.percent === false)
                              ? "border-[#9B2FAC] focus:border-[#9B2FAC] focus:outline-none"
                              : "border-[#D6D9E4] focus:border-[#F47E20] focus:outline-none"
                          }`}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9B2FAC]">
                          {(type === "Fixed amount" &&
                            isFillForm.fixedAmount === false) ||
                          (type === "Percent" &&
                            isFillForm.percent === false) ? (
                            <AlertIcon />
                          ) : null}
                        </div>
                        {(type === "Fixed amount" &&
                          isFillForm.fixedAmount === false) ||
                        (type === "Percent" && isFillForm.percent === false) ? (
                          <p className="absolute text-[#9B2FAC] text-sm mt-1">
                            Please fill out this field
                          </p>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative w-full my-10">
              <label>Courses Included</label>
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className={`w-full mt-2 flex justify-between items-center bg-[#FFFFFF] border-1 ${
                  isDropdownOpen
                    ? "border-[#F47E20]"
                    : `${
                        isFillForm.selectedCourses === false
                          ? "border-[#9B2FAC] focus:border-[#9B2FAC] focus:outline-none"
                          : "border-[#D6D9E4] focus:border-[#F47E20] focus:outline-none"
                      }`
                } rounded-md px-4 py-2`}
              >
                <div className="flex gap-2 flex-wrap">
                  {selectedCourses.length === 0 ? (
                    <span className="text-[#9AA1B9]">All courses</span>
                  ) : (
                    selectedCourses.map((course) => (
                      <div
                        key={course.course_id}
                        className="flex items-center bg-[#D6D9E4] px-2 py-1 rounded-md"
                      >
                        <span className="mr-2">{course.course_name}</span>
                        <span
                          onClick={() => handleRemoveCourse(course.course_id)}
                          className="cursor-pointer"
                        >
                          <XICon />
                        </span>
                      </div>
                    ))
                  )}
                </div>
                <span>{isDropdownOpen ? "▲" : "▼"}</span>
              </button>
              {isFillForm.selectedCourses === false && (
                <p className="absolute text-[#9B2FAC] text-sm mt-1">
                  Please fill out this field
                </p>
              )}

              {isDropdownOpen && (
                <div className="absolute mt-2 py-2 bg-[#FFFFFF] border border-[#D6D9E4] rounded-md shadow-lg w-full z-10">
                  {isLoading ? (
                    <div className="p-4">Loading...</div>
                  ) : error ? (
                    <div className="p-4 text-[#ff2e2e]">{error}</div>
                  ) : (
                    <ul className="max-h-60 overflow-y-auto">
                      {allCourses.map((course) => (
                        <li
                          key={course.course_id}
                          className="flex items-center px-4 py-2 hover:bg-[#d9e8ff]"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCourses.some(
                              (c) => c.course_id === course.course_id
                            )}
                            onChange={() => handleToggleCourse(course)}
                            className="mr-2 w-5 h-5 accent-[#2F5FAC]"
                          />
                          {course.course_name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelAddPromoCode;
