import React, { useState, useEffect } from "react";
import Sidebar from "@/components/admin/AdminSidebar";
import axios from "axios";
import { XICon } from "@/assets/icons/admin_icon/adminIcon";
import useAdminAuth from "@/hooks/useAdminAuth";
import { useRouter } from "next/router";

const AdminPanelAddPromoCode = () => {
  const [allCourses, setAllCourses] = useState([
    { course_id: 0, course_name: "All courses" },
  ]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [discountType, setDiscountType] = useState("fixed");
  const [fixedAmount, setFixedAmount] = useState("");
  const [percent, setPercent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { loading } = useAdminAuth();
  const [isAllCourseSelected, setIsAllCourseSelected] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    promoCode: "",
    minimumPurchase: "",
    discountType: "fixed",
    fixedAmount: "",
    percent: "",
  });
  

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get("/api/admin/fetch_all_courses");
        setAllCourses((prevCourses) => {
          const newCourses = data.data;
          const uniqueCourses = [
            ...prevCourses,
            ...newCourses.filter(
              (course) =>
                !prevCourses.some(
                  (prevCourse) => prevCourse.course_id === course.course_id
                )
            ),
          ];
          return uniqueCourses;
        });
        console.log("allCourses:", allCourses);
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
      if (isAllCourseSelected) {
        setSelectedCourses([]);
      } else {
        setSelectedCourses([
          {
            course_id: allCourses[0].course_id,
            course_name: allCourses[0].course_name,
          },
        ]);
      }
      setIsAllCourseSelected(!isAllCourseSelected);
    } else {
      setSelectedCourses((prevSelectedCourses) => {
        if (prevSelectedCourses.some((c) => c.course_id === course.course_id)) {
          return prevSelectedCourses.filter(
            (c) => c.course_id !== course.course_id
          );
        } else {
          const updatedCourses = [...prevSelectedCourses, course];
          return updatedCourses.filter((c) => c.course_name !== "All courses");
        }
      });
      if (isAllCourseSelected) {
        setIsAllCourseSelected(false);
      }
    }
  };

  const handleRemoveCourse = (courseId) => {
    setSelectedCourses((prev) => prev.filter((c) => c.course_id !== courseId));
  };

  const formFields = [
    { label: "Set promo code*", placeholder: "Enter promo code", type: "text",name: "promoCode" },
    {
      label: "Minimum purchase amount (THB)*",
      placeholder: "Enter amount",
      type: "number",
      name : "minimumPurchase"
    },
  ];

  const FormField = ({
    label,
    placeholder,
    type,
    value,
    onChange,
    disabled,
    name
  }) => (
    <div className="flex flex-col">
      <label className="mb-2 font-medium">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        name={name}
        className={`border border-[#D6D9E4] rounded-md p-2 w-full focus:ring-2 focus:ring-[#F47E20] focus:outline-none ${
          disabled ? "bg-[#F6F7FC] cursor-not-allowed" : ""
        }`}
      />
    </div>
  );

  const CourseDropdown = ({
    allCourses,
    selectedCourses,
    isDropdownOpen,
    toggleDropdown,
    handleToggleCourse,
    handleRemoveCourse,
    isLoading,
    error,
  }) => (
    <div className="relative w-full my-10">
      <label>Courses Included</label>
      <button
        type="button"
        onClick={toggleDropdown}
        className={`w-full mt-2 flex justify-between items-center bg-[#FFFFFF] border-1 ${
          isDropdownOpen ? "border-[#F47E20]" : "border-[#D6D9E4]"
        } rounded-md px-4 py-2`}
      >
        <div className="flex gap-2 flex-wrap">
          {selectedCourses.length === 0 ? (
            <span className="text-[#9AA1B9]">All courses</span>
          ) : (
            selectedCourses.map((course) =>
              isAllCourseSelected ? (
                <div>All courses</div>
              ) : (
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
              )
            )
          )}
        </div>
        <span>{isDropdownOpen ? "▲" : "▼"}</span>
      </button>

      {isDropdownOpen && (
        <div className="absolute mt-2 py-2 bg-[#FFFFFF] border border-[#D6D9E4] rounded-md shadow-lg w-full z-10">
          {isLoading ? (
            <div className="p-4">Loading...</div>
          ) : error ? (
            <div className="p-4 text-[#ff2e2e]">{error}</div>
          ) : (
            <ul className=" max-h-60 overflow-y-auto">
              {allCourses.map((course, index) => (
                <li
                  key={index}
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
            </>
          )}
        </div>
      )}
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      promoCode: formData.promoCode,
      minimumPurchase: formData.minimumPurchase,
      discountType: formData.discountType,
      discountValue:
        formData.discountType === "fixed"
          ? formData.fixedAmount
          : formData.percent,
      selectedCourses: selectedCourses.map((course) => course.course_id),
    };
  }

  const handleCancle = () => {
    router.push("/admin/promo_code");
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-[#F6F7FC]">
        <div className="flex bg-[#FFFFFF] justify-between items-center p-6 mb-6 border-b shadow-sm">
          <h1 className="text-2xl font-bold">Add Promo code</h1>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleCancle}
              className="cancel-button w-[120px] h-[60px] px-8 py-[18px] text-[#F47E20] font-[700] border border-[#F47E20] rounded-[12px]"
            >
              cancel
            </button>
            <button
              type="submit"
              className="bg-[#2F5FAC] hover:bg-white hover:text-[#2F5FAC] hover:border hover:border-[#2F5FAC] text-[#FFFFFF] create-button w-[120px] h-[60px] px-8 py-[18px] font-[700] rounded-[12px] flex justify-center items-center"
            >
              create
            </button>
          </div>
        </div>
        <div className="pt-4">
        <form onSubmit={handleSubmit} className="bg-[#FFFFFF] shadow-md rounded-xl py-10 px-32 mx-20">
  <div className="grid grid-cols-2 gap-x-12 mb-8">
    {formFields.map((field, index) => (
      <FormField
        key={index}
        label={field.label}
        placeholder={field.placeholder}
        type={field.type}
        value={formData[field.name]}
        onChange={handleInputChange}
        name={field.name}
      />
    ))}
  </div>

  <div className="flex flex-col gap-y-2 mb-8">
    <label className="font-medium">Select discount type</label>
    <div className="flex items-center gap-x-96">
      {["fixed", "percent"].map((type) => (
        <div key={type} className="flex items-center gap-x-2 text-[#424C6B]">
          <input
            type="radio"
            id={`discount-${type}`}
            name="discountType"
            checked={formData.discountType === type}
            onChange={() =>
              setFormData((prev) => ({ ...prev, discountType: type }))
            }
            className="h-4 w-4 cursor-pointer"
          />
          <label htmlFor={`discount-${type}`} className="text-sm font-medium">
            {type === "fixed" ? "Fixed amount (THB)" : "Percent (%)"}
          </label>
          <input
            type="number"
            placeholder={type === "fixed" ? "THB" : "Percent"}
            value={formData[type === "fixed" ? "fixedAmount" : "percent"]}
            onChange={handleInputChange}
            name={type === "fixed" ? "fixedAmount" : "percent"}
            disabled={formData.discountType !== type}
            className="border border-gray-300 rounded px-2 py-1 w-24 disabled:bg-gray-100"
          />
        </div>
      ))}
    </div>
  </div>

  <CourseDropdown
    allCourses={allCourses}
    selectedCourses={selectedCourses}
    isDropdownOpen={isDropdownOpen}
    toggleDropdown={() => setIsDropdownOpen((prev) => !prev)}
    handleToggleCourse={handleToggleCourse}
    handleRemoveCourse={handleRemoveCourse}
    isLoading={isLoading}
    error={error}
  />
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelAddPromoCode;
