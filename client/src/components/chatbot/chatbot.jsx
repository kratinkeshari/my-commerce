"use client";
import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, ChevronLeft, Loader2, AlertCircle } from "lucide-react";
// import emailjs from '@emailjs/browser';
export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    query: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [typing, setTyping] = useState(true);
  const [validationError, setValidationError] = useState("");
  const chatEndRef = useRef(null);

  const questions = [
    {
      key: "Welcome message",
      label: "Hi Welcome to AlphaCart!!. Let me introduce myself I'm your chat assistant. How may I help you today?",
    },
    {
      key: "name",
      label: "Lets begin with some basic info. What's your name?",
      type: "text"
    },
    {
      key: "email",
      label: "Nice to meet you! Could I get your email address?",
      type: "email"
    },
    {
      key: "phone",
      label: "Thanks! And your phone number so we can reach you?",
      type: "phone"
    },
    {
      key: "query",
      label: "Great! How can I help you today?",
      type: "text"
    },
  ];

  useEffect(() => {
    if (open) {
      setTyping(true);
      const timer = setTimeout(() => {
        setTyping(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [step, open]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [step, typing]);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    // Remove all non-digit characters for validation
    const cleanPhone = phone.replace(/\D/g, '');
    // Check if it's between 10-15 digits (international format)
    return cleanPhone.length >= 10 && cleanPhone.length <= 15;
  };

  const validateName = (name) => {
    // Name should only contain letters, spaces, hyphens, and apostrophes
    const nameRegex = /^[a-zA-Z\s\-']+$/;
    return name.trim().length >= 2 && nameRegex.test(name.trim());
  };

  const validateInput = (key, value) => {
    switch (key) {
      case "name":
        if (!validateName(value)) {
          return "Please enter a valid name (letters only, minimum 2 characters)";
        }
        break;
      case "email":
        if (!validateEmail(value)) {
          return "Please enter a valid email address (e.g., user@example.com)";
        }
        break;
      case "phone":
        if (!validatePhone(value)) {
          return "Please enter a valid phone number (10-15 digits)";
        }
        break;
      case "query":
        if (value.trim().length < 5) {
          return "Please provide more details (minimum 5 characters)";
        }
        break;
      default:
        return "";
    }
    return "";
  };

  // Function to send email using EmailJS
  const sendEmailNotification = async (data) => {
    try {
      emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY);

      const templateParams = {
        to_email: process.env.NEXT_PUBLIC_NOTIFICATION_EMAIL,
        from_name: data.name,
        from_email: data.email,
        phone_number: data.phone,
        user_query: data.query,
        submission_time: new Date().toLocaleString(),
      };
      console.log("templateParams", templateParams);
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        templateParams
      );

      console.log('Email notification sent successfully');
    } catch (error) {
      console.error('Failed to send email notification:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      setTyping(true);

      // Save to database
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Send email notification (client-side)
      await sendEmailNotification(formData);

      setTimeout(() => {
        setTyping(false);
        if (res.ok) {
          setSubmitted(true);
        }
      }, 1500);
    } catch (err) {
      console.error("Failed to submit chatbot query", err);
      setTyping(false);
    }
  };

  const handleNext = (e) => {
    e.preventDefault();

    const currentValue = formData[questions[step].key];
    const error = validateInput(questions[step].key, currentValue);

    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError("");

    if (step < questions.length - 1) {
      setStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    const key = questions[step].key;

    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError("");
    }

    // Format phone number as user types
    let formattedValue = value;
    if (key === "phone") {
      // Remove all non-digit characters and limit to 15 digits
      const digits = value.replace(/\D/g, '').slice(0, 15);
      formattedValue = digits;
    }

    setFormData({
      ...formData,
      [key]: formattedValue,
    });
  };

  const getInputType = (questionType) => {
    switch (questionType) {
      case "email":
        return "email";
      case "phone":
        return "tel";
      default:
        return "text";
    }
  };

  const getPlaceholder = (question) => {
    switch (question.key) {
      case "name":
        return "Enter your full name...";
      case "email":
        return "Enter your email (e.g., user@example.com)...";
      case "phone":
        return "Enter your phone number...";
      case "query":
        return "Describe how we can help you...";
      default:
        return `Enter your ${question.key}...`;
    }
  };

  const resetChat = () => {
    setStep(0);
    setFormData({
      name: "",
      email: "",
      phone: "",
      query: "",
    });
    setSubmitted(false);
    setValidationError("");
  };

  return (
    <>
      <div
        onClick={() => setOpen(!open)}
        className="fixed bottom-8 right-8 text-white w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 cursor-pointer flex items-center justify-center z-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        {open ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </div>

      {open && (
        <div className="fixed bottom-24 right-8 w-80 max-w-full bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col transition-all duration-300 border border-gray-200 dark:border-gray-700">
          {/* Chat header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="font-semibold">AI Assistant</h3>
            </div>
            {submitted && (
              <button
                onClick={() => {
                  resetChat();
                  window.location.reload();
                }}
                className="text-white/80 hover:text-white flex items-center gap-1 text-sm"
              >
                <ChevronLeft className="w-4 h-4" /> New Chat
              </button>
            )}
          </div>

          {/* Chat messages */}
          <div className="flex-1 p-4 overflow-y-auto max-h-96 bg-gray-50 dark:bg-gray-800">
            <div className="space-y-4">
              {questions.slice(0, step + 1).map((q, idx) => (
                <div key={idx} className="space-y-3">
                  {/* Bot message */}
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-lg rounded-tl-none shadow-sm max-w-[85%]">
                      {idx === step && typing ? (
                        <div className="flex gap-1 items-center">
                          <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                        </div>
                      ) : (
                        <p className="text-gray-900 dark:text-gray-100">{q.label}</p>
                      )}
                    </div>
                  </div>

                  {/* User response */}
                  {idx < step && (
                    <div className="flex items-start justify-end gap-2">
                      <div className="bg-blue-500 text-white p-3 rounded-lg rounded-tr-none shadow-sm max-w-[85%]">
                        <p>{formData[q.key]}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                        <span className="text-sm font-medium">You</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {submitted && !typing && (
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div className="bg-white dark:bg-gray-700 p-3 rounded-lg rounded-tl-none shadow-sm max-w-[85%]">
                    <p className="font-medium text-gray-900 dark:text-gray-100">Thank you, {formData.name}!</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      We&apos;ve received your query, and our team will get back to you within 24 hours via <span className="font-medium">{formData.email}</span> or <span className="font-medium">{formData.phone}</span>.
                      <br className="mt-2" />
                      <span className="inline-block mt-2">
                        <strong>Please note:</strong> For calls after 6 PM, kindly use our alternate contact number: <span className="font-semibold">+91 95570 53066</span>.
                      </span>
                    </p>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          </div>

          {!submitted && !typing && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              {/* Validation Error */}
              {validationError && (
                <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600 dark:text-red-400">{validationError}</p>
                </div>
              )}

              <form onSubmit={handleNext}>
                <div className="relative">
                  <input
                    type={getInputType(questions[step].type)}
                    value={formData[questions[step].key]}
                    onChange={handleChange}
                    className={`w-full p-3 pr-12 border rounded-full focus:outline-none focus:ring-2 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 ${validationError
                      ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                      : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                      }`}
                    placeholder={getPlaceholder(questions[step])}
                    required
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {submitted && typing && (
            <div className="p-4 flex items-center justify-center border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                Processing your request...
              </span>
            </div>
          )}
        </div>
      )}
    </>
  );
}