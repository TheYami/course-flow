import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import supabase from "@/lib/supabase";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import visa from "@/assets/images/visa.svg";
import mastercard from "@/assets/images/card-mastercard.svg";
import Loading from "@/components/Loding";

import { useRouter } from "next/router";

import { loadStripe } from "@stripe/stripe-js";
import e from "cors";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function PaymentPage() {
  const router = useRouter();

  const { slug } = router.query;

  const [isProcessing, setIsProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [courseData, setCourseData] = useState([]);
  const [methodPayment, setMethodPayment] = useState("credit-card");

  const [promotionCode, setPromotionCode] = useState("");
  const [promotionData, setPromotionData] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);

  const [nameOnCard, setNameOnCard] = useState("");

  const [cardNumberError, setCardNumberError] = useState(false);
  const [cardExpiryError, setCardExpiryError] = useState(false);
  const [cardCvcError, setCardCvcError] = useState(false);
  const [nameOnCardError, setNameOnCardError] = useState(false);

  const [cardNumberMsg, setCardNumberMsg] = useState("");
  const [cardExpiryMsg, setCardExpiryMsg] = useState("");
  const [cardCvcMsg, setCardCvcMsg] = useState("");
  const [nameOnCardMsg, setNameOnCardMsg] = useState("");

  const [isClient, setIsClient] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  const [referenceNumber, setReferenceNumber] = useState("");

  const [promotionError, setPromotionError] = useState(false);
  const [promotionErrorMsg, setPromontionErrorMsg] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchCheckoutUrl = async () => {
    setLoading(true);
    try {
      let courseId = courseData.course_id;
      const response = await axios.post("/api/payment/checkSubscription", {
        courseId,
        userId: userData.id,
      });

      if (response.data.subscription) {
        router.push(`/my-course/${slug}`);
      } else {
        if (response.data.url) {
          setCheckoutUrl(response.data.url);
          setReferenceNumber(response.data.referenceNumber);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData && courseData && userData.id && courseData.course_id) {
      fetchCheckoutUrl();
    }
  }, [userData, courseData]);

  const handlePaymentMethodChange = (event) => {
    setMethodPayment(event.target.value);
  };

  const handleNameOnCardChange = (e) => {
    let value = e.target.value;
    setNameOnCard(value.toUpperCase());
  };

  const handlePromotionSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setPromotionError(false);
    setPromontionErrorMsg("");
    setDiscount(0);
    setTotal(courseData.price);

    try {
      const { data, error } = await supabase
        .from("promo_codes")
        .select("*")
        .eq("code", promotionCode)
        .single();

      if (error) {
        setPromotionError(true);
        setPromontionErrorMsg("Promotion code invalid");
        setLoading(false);
        return;
      } else {
        setPromotionData(data);
        setPromotionError(false);
        setPromontionErrorMsg("");

        const promoCodeId = data.promo_code_id;

        const response = await axios.get(
          `/api/promotion-codes?promocodeId=${promoCodeId}`
        );

        if (response.status === 200) {
          const promoData = response.data.data;

          const filteredData = promoData.filter(
            (item) => item.course_id === courseData.course_id
          );

          console.log("Filtered data: ", filteredData[0]);

          if (filteredData.length === 0) {
            setPromotionError(true);
            setPromontionErrorMsg("This code cannot be used with this course");
            setLoading(false);
            return;
          } else {
            setPromotionError(false);
            setPromontionErrorMsg("");

            const promo = filteredData[0];

            if (courseData.price < promo.min_price) {
              setPromotionError(true);
              setPromontionErrorMsg("The course price is below the minimum price for this promotion code.");
              setLoading(false);
              return;
            }

            setDiscount(promo.discount);
            setLoading(false);

            let total = 0;

            if (promo.discount_type === "Fixed amount") {
              total = courseData.price - promo.discount;
              total = total <= 0 ? 0 : total;
            } else if (promo.discount_type === "Percent") {
              const discountAmount = courseData.price * (promo.discount / 100);
              total = Math.floor(courseData.price - discountAmount);
              total = total <= 0 ? 0 : total;
            }

            setTotal(total);
          }
        }
      }
    } catch (error) {
      console.log("Error:", error);
      setLoading(false);
    }
  };


  const getCourseById = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/courseById?slug=${slug}`);
      setCourseData(response.data.data);
      setTotal(response.data.data.price);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching course:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    const getData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setUser(null);
        setLoading(false);
        router.push("/login");
        return;
      }
      setUser(session.user);

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("email", session.user.email)
        .single();

      if (userError) {
        console.error("Error fetching user data:", userError);
      } else {
        setUserData(userData);
        setLoading(false);
      }

      if (slug) {
        getCourseById();
      }
    };
    getData();
  }, [slug]);

  const formatPrice = (price) => {
    if (discount !== 0 && promotionData.discount_type === "Fixed amount") {
      price -= discount;

      if (price < 0) {
        return new Intl.NumberFormat("en-US").format(0);
      }

      return new Intl.NumberFormat("en-US").format(price);
    } else if (discount !== 0 && promotionData.discount_type === "Percent") {
      let discountAmount = price * (discount / 100);
      let total = Math.floor(price - discountAmount);

      if (total <= 0) {
        return new Intl.NumberFormat("en-US").format(0);
      }
      return new Intl.NumberFormat("en-US").format(total);
    } else {
      return new Intl.NumberFormat("en-US").format(price);
    }
  };

  const formatSubtotal = (price) => {
    return new Intl.NumberFormat("en-US").format(price);
  };

  const handlePaymentSubmit = async (event) => {
    event.preventDefault();

    if (methodPayment === "qrcode") {
      router.push(`/payment/qr-payment?amount=${total}&courseId=${slug}`);
      return;
    }

    setLoading(true);
    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    if (nameOnCard === "") {
      setNameOnCardError(true);
      setNameOnCardMsg("Please fill out this field");
      setLoading(false);
    } else {
      setNameOnCardError(false);
      setNameOnCardMsg("");
    }

    setIsProcessing(true);

    const cardNumber = elements.getElement(CardNumberElement);
    const cardExpiry = elements.getElement(CardExpiryElement);
    const cardCvc = elements.getElement(CardCvcElement);

    if (!cardNumber || cardNumber._empty) {
      setCardNumberError(true);
      setCardNumberMsg("Please fill out this field");
      setLoading(false);
    } else {
      setCardNumberError(false);
      setCardNumberMsg("");
    }

    if (!cardExpiry || cardExpiry._empty) {
      setCardExpiryError(true);
      setCardExpiryMsg("Please fill out this field");
      setLoading(false);
    } else {
      setCardExpiryError(false);
    }

    if (!cardCvc || cardCvc._empty) {
      setCardCvcError(true);
      setCardCvcMsg("Please fill out this field");
      setLoading(false);
    } else {
      setCardCvcError(false);
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardNumber,
    });

    if (error) {
      if (cardNumber._empty || cardCvc._empty || cardExpiry._empty) {
        setIsProcessing(false);
        setLoading(false);
        return;
      } else {
        router.push(`/course/${slug}/payment-failed`);
        return;
      }
    }

    const res = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentMethodId: paymentMethod.id,
        amount: total * 100,
      }),
    });

    const paymentData = await res.json();

    if (paymentData.success) {
      const subscriptionData = {
        user_id: userData.id,
        course_id: courseData.course_id,
        purchase_date: new Date().toISOString(),
        payment_type: "credit card",
      };

      const subscriptionRes = await fetch("/api/save-subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscriptionData),
      });

      const subscriptionResult = await subscriptionRes.json();

      if (subscriptionResult.message === "Subscription saved successfully") {
        setLoading(false);
        router.push(`/course/${slug}/payment-success`);
      } else {
        setLoading(false);
        router.push(`/course/${slug}/payment-failed`);
      }
    } else {
      setLoading(false);
      router.push(`/course/${slug}/payment-failed`);
    }
    setLoading(false);
    setIsProcessing(false);
  };

  return (
    <div>
      <Navbar />
      <div className="px-4 lg:px-0">
        <div className="pt-4 lg:pt-8 pb-10 lg:pb-60 xl:px-48 flex flex-col sm:px-4">
          <Link
            href={`/course/${slug}`}
            className="flex gap-2 no-underline text-[#2F5FAC] font-bold hover:text-blue-500 w-20 px-2 py-1 items-center"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.7915 11.0051H7.62148L12.5015 6.1251C12.8915 5.7351 12.8915 5.0951 12.5015 4.7051C12.1115 4.3151 11.4815 4.3151 11.0915 4.7051L4.50148 11.2951C4.11148 11.6851 4.11148 12.3151 4.50148 12.7051L11.0915 19.2951C11.4815 19.6851 12.1115 19.6851 12.5015 19.2951C12.8915 18.9051 12.8915 18.2751 12.5015 17.8851L7.62148 13.0051H18.7915C19.3415 13.0051 19.7915 12.5551 19.7915 12.0051C19.7915 11.4551 19.3415 11.0051 18.7915 11.0051Z"
                fill="#2F5FAC"
              />
            </svg>
            Back
          </Link>

          <h2 className="text-2xl lg:text-4xl font-medium pt-4">
            Enter payment info to start <br /> your subscription
          </h2>

          <p className="text-[#646D89] pt-10 lg:pt-12">Select payment method</p>

          {isClient && (
            <form
              onSubmit={handlePaymentSubmit}
              className="pt-4 flex flex-col lg:flex-row gap-4"
            >
              <div className="flex flex-col gap-3">
                <div
                  className={`flex flex-col gap-2 pb-4 lg:pb-10 rounded-lg ${
                    methodPayment === "credit-card"
                      ? "bg-[#F1F2F6]"
                      : "bg-[#fff]"
                  }`}
                >
                  <label className="flex gap-4 py-4 px-6">
                    <input
                      type="radio"
                      name="payment-method"
                      value="credit-card"
                      checked={methodPayment === "credit-card"}
                      onChange={handlePaymentMethodChange}
                    />
                    Credit card / Debit card
                  </label>

                  <div className="flex flex-col gap-6 px-6 md:px-16">
                    <div className="flex flex-col gap-1">
                      <label htmlFor="card-number">Card Number</label>

                      <div className="flex flex-col md:flex-row gap-2">
                        <div
                          className={`py-3 px-4 bg-white rounded-lg w-[285px] md:w-[453px] border-[1px] ${
                            cardNumberError
                              ? "border-[#9B2FAC]"
                              : "border-[#D6D9E4]"
                          }`}
                        >
                          <CardNumberElement
                            id="card-number"
                            options={{
                              style: {
                                base: {
                                  fontSize: "16px",
                                  color: "#424770",
                                  letterSpacing: "0.025em",
                                  padding: "10px",
                                  backgroundColor: "#fff",
                                  borderRadius: "4px",
                                  padding: "12px 16px",
                                  "::placeholder": {
                                    color: "#aab7c4",
                                  },
                                },
                              },
                              placeholder: "Card Number",
                            }}
                          />
                        </div>
                        {cardNumberError && (
                          <p
                            className={` block lg:hidden text-sm text-[#9B2FAC] px-3 m-0 `}
                          >
                            {cardNumberMsg}
                          </p>
                        )}

                        <div className="flex gap-2">
                          <Image
                            src={visa}
                            alt="VISA Image"
                            width={48}
                            height={48}
                          />
                          <Image
                            src={mastercard}
                            alt="Mastercard Image"
                            width={48}
                            height={48}
                          />
                        </div>
                      </div>
                      {nameOnCardError && (
                        <p
                          className={`hidden lg:block text-sm text-[#9B2FAC] px-3 m-0 `}
                        >
                          {cardNumberMsg}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label>Name on card</label>
                      <input
                        type="text"
                        value={nameOnCard}
                        onChange={handleNameOnCardChange}
                        placeholder="Name on card"
                        className={`py-3 px-4 outline-none border-[1px] ${
                          nameOnCardError
                            ? "border-[#9B2FAC]"
                            : "border-[#D6D9E4]"
                        } rounded-lg w-[285px] md:w-[453px]`}
                      />
                      {nameOnCardError && (
                        <p className={`text-sm text-[#9B2FAC] px-3 m-0 `}>
                          {nameOnCardMsg}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2 lg:gap-4">
                      <div className="flex flex-col gap-1">
                        <label htmlFor="card-expiry">Expiration Date</label>

                        <div
                          className={`px-4 py-3 bg-white rounded-lg w-[139.5px] md:w-[218.5px] border-[1px]  ${
                            cardExpiryError
                              ? "border-[#9B2FAC]"
                              : "border-[#D6D9E4]"
                          }`}
                        >
                          <CardExpiryElement
                            id="card-expiry"
                            options={{
                              style: {
                                base: {
                                  fontSize: "16px",
                                  color: "#424770",
                                  letterSpacing: "0.025em",
                                  padding: "10px",
                                  backgroundColor: "#fff",
                                  padding: "12px 16px",
                                  borderRadius: "4px",
                                  "::placeholder": {
                                    color: "#aab7c4",
                                  },
                                },
                              },
                              placeholder: "MM/YY",
                            }}
                          />
                        </div>
                        {cardExpiryError && (
                          <p className={`text-sm text-[#9B2FAC] px-3 m-0 `}>
                            {cardExpiryMsg}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-1">
                        <label htmlFor="card-cvc">CVC</label>

                        <div
                          className={`px-4 py-3 bg-white border-[1px] ${
                            cardCvcError
                              ? "border-[#9B2FAC]"
                              : "border-[#D6D9E4]"
                          } rounded-lg w-[139.5px] md:w-[218.5px]`}
                        >
                          <CardCvcElement
                            id="card-cvc"
                            options={{
                              style: {
                                base: {
                                  fontSize: "16px",
                                  color: "#424770",
                                  letterSpacing: "0.025em",
                                  padding: "10px",
                                  backgroundColor: "#fff",
                                  borderRadius: "4px",
                                  "::placeholder": {
                                    color: "#aab7c4",
                                  },
                                },
                              },
                            }}
                          />
                        </div>
                        {cardCvcError && (
                          <p className={`text-sm text-[#9B2FAC] px-3 m-0 `}>
                            {cardCvcMsg}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`'rounded-lg ${
                    methodPayment === "qrcode" ? "bg-[#F1F2F6]" : "bg-[#fff]"
                  }`}
                >
                  <label className="flex gap-6 px-6 py-4">
                    <input
                      type="radio"
                      name="payment-method"
                      value="qrcode"
                      checked={methodPayment === "qrcode"}
                      onChange={handlePaymentMethodChange}
                    />
                    QR Code
                  </label>
                </div>
              </div>

              <div className="py-8 px-2 lg:px-6 flex flex-col rounded-lg shadow-sm gap-6">
                <p className="text-sm text-[#F47E20]">Summary</p>

                <div className="flex flex-col">
                  <h4 className="text-[#646D89] text-base font-normal leading-6">
                    Subscription
                  </h4>
                  <h2 className="text-2xl font-medium lg:font-bold leading-7">
                    Service Design Essentials <br /> Course
                  </h2>
                </div>

                <div className="flex flex-col gap-2.5">
                  <form className="flex gap-2 lg:gap-4 pb-1 md:justify-between">
                    <input
                      type="text"
                      value={promotionCode}
                      onChange={(e) => setPromotionCode(e.target.value)}
                      placeholder="Promo code"
                      className={`py-3 px-4 w-[191px] md:w-[500px] lg:w-[205px]
                      outline-none rounded-lg border-[1px] ${
                        promotionError ? "border-[#9B2FAC]" : "border-[#D6D9E4]"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handlePromotionSubmit}
                      className={`py-[18px] px-8 rounded-xl ${
                        promotionCode === ""
                          ? "bg-[#D6D9E4] text-[#9AA1B9]"
                          : "bg-[#2F5FAC] text-[#FFFFFF]"
                      }`}
                    >
                      Apply
                    </button>
                  </form>
                  {promotionError && (
                    <p className="text-[#9B2FAC]">{promotionErrorMsg}</p>
                  )}

                  <div className="flex justify-between">
                    <h3 className="text-base font-normal">Subtotal</h3>
                    <h3 className="text-base font-normal text-[#646D89]">
                      {formatSubtotal(courseData.price)}
                    </h3>
                  </div>

                  {discount !== 0 && (
                    <div className="flex justify-between">
                      <h3 className="text-base font-normal">Discount</h3>
                      <h3 className="text-base font-normal text-[#9B2FAC]">
                        -
                        {`${discount} ${
                          promotionData.discount_type === "Percent" ? "%" : ""
                        }`}
                      </h3>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <h3 className="text-base font-normal">Payment method</h3>
                    <h3 className="text-base font-normal text-[#646D89] text-right">
                      {methodPayment === "credit-card" ? (
                        <>
                          Credit card / Debit{" "}
                          <span className="block">card</span>
                        </>
                      ) : (
                        "QR Payment"
                      )}
                    </h3>
                  </div>

                  <div className="flex justify-between">
                    <h3 className="text-base font-normal">Total</h3>
                    <h3 className="text-2xl font-medium text-[#646D89]">
                      THB {formatPrice(courseData.price)}
                    </h3>
                  </div>
                </div>

                <button
                  type="submit"
                  className="py-[18px] px-8 bg-[#2F5FAC] text-center rounded-xl font-bold text-white hover:bg-blue-500"
                >
                  Place order
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center w-screen h-screen">
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Loading />
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
