import React, { useState, useEffect } from "react";
import Sidebar from "@/components/admin/AdminSidebar";
import AdminHeaderbarAddEdit from "@/components/admin/AdminHeaderbarAddEdit";
import axios from "axios";
import { XICon } from "@/assets/icons/admin_icon/adminIcon";

const AdminPanelAddPromoCode = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [discountType, setDiscountType] = useState("fixed");
  const [fixedAmount, setFixedAmount] = useState("");
  const [percent, setPercent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get("/api/admin/courses");
        setAllCourses(data);
      } catch (error) {
        setError("Failed to load courses.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleToggleCourse = (course) => {
    setSelectedCourses((prev) =>
      prev.some((c) => c.course_id === course.course_id)
        ? prev.filter((c) => c.course_id !== course.course_id)
        : [...prev, course]
    );
  };

  const handleRemoveCourse = (courseId) => {
    setSelectedCourses((prev) => prev.filter((c) => c.course_id !== courseId));
  };

  const formFields = [
    { label: "Set promo code*", placeholder: "Enter promo code", type: "text" },
    { label: "Minimum purchase amount (THB)*", placeholder: "Enter amount", type: "number" },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-100">
        <AdminHeaderbarAddEdit title="Add Promo Code" apiEndpoint="/admin/promo_code" />
        <div className="p-6">
          <form className="bg-white shadow-md rounded-md p-10 mx-20">
            <div className="grid grid-cols-2 gap-x-12 mb-8">
              {formFields.map((field, index) => (
                <div key={index} className="flex flex-col">
                  <label className="mb-2 font-medium text-gray-700">{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-x-12 items-center mb-8">
              {["fixed", "percent"].map((type) => (
                <div key={type} className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="discountType"
                      value={type}
                      checked={discountType === type}
                      onChange={() => setDiscountType(type)}
                      className="mr-2"
                    />
                    {type === "fixed" ? "Fixed amount (THB)" : "Percent (%)"}
                  </label>
                  <input
                    type="number"
                    placeholder={type === "fixed" ? "THB" : "Percent"}
                    value={type === "fixed" ? fixedAmount : percent}
                    onChange={(e) => (type === "fixed" ? setFixedAmount(e.target.value) : setPercent(e.target.value))}
                    disabled={discountType !== type}
                    className={`border rounded-md p-2 w-40 focus:ring-2 focus:ring-blue-500 focus:outline-none ${discountType !== type ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  />
                </div>
              ))}
            </div>

            <div className="relative w-full my-10">
              <label>Courses Included</label>
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="w-full flex justify-between items-center bg-white border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none mt-5"
              >
                <div className="flex gap-2 flex-wrap">
                  {selectedCourses.length === 0 ? (
                    <span className="text-gray-400">All courses</span>
                  ) : (
                    selectedCourses.map((course) => (
                      <div key={course.course_id} className="flex items-center bg-gray-200 px-2 py-1 rounded-md">
                        <span className="mr-2">{course.course_name}</span>
                        <span onClick={() => handleRemoveCourse(course.course_id)} className="cursor-pointer">
                          <XICon />
                        </span>
                      </div>
                    ))
                  )}
                </div>
                <span>{isDropdownOpen ? "▲" : "▼"}</span>
              </button>

              {isDropdownOpen && (
                <div className="absolute mt-2 bg-white border border-gray-300 rounded-md shadow-lg w-full z-10">
                  {isLoading ? (
                    <div className="p-4">Loading...</div>
                  ) : error ? (
                    <div className="p-4 text-red-500">{error}</div>
                  ) : (
                    <ul>
                      {allCourses.map((course) => (
                        <li key={course.course_id} className="flex items-center px-4 py-2 hover:bg-blue-100">
                          <input
                            type="checkbox"
                            checked={selectedCourses.some((c) => c.course_id === course.course_id)}
                            onChange={() => handleToggleCourse(course)}
                            className="mr-2"
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
