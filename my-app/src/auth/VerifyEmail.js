import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../auth/supabaseClient";


//
// This page handles email verification after a user
// signs up and clicks the confirmation link in their email.
//

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");

  useEffect(() => {


  // status can be:
  // 'verifying' — checking if the token worked (initial state)
  // 'success'   — email confirmed, session is active
  // 'error'     — token expired or invalid
  
    // Supabase automatically handles the token in the URL
    // Just check if user is now logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setStatus("success");
        setTimeout(() => navigate("/"), 2500);
      } else {
        setStatus("error");
      }
    });
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
        background: "linear-gradient(155deg, #dce8ff 0%, #edf3ff 100%)",
      }}
    >

      
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: "40px 48px",
          boxShadow: "0 8px 32px rgba(0,53,128,0.12)",
          border: "1px solid #e0ebff",
          textAlign: "center",
          maxWidth: 400,
        }}
      >
        {status === "verifying" && (
          <>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                border: "3px solid #e0ebff",
                borderTopColor: "#003f8a",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto 20px",
              }}
            />
            <p style={{ color: "#003f8a", fontWeight: 600 }}>
              Verifying your email...
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h2 style={{ color: "#003f8a", margin: "0 0 8px" }}>
              Email Verified!
            </h2>
            <p style={{ color: "#6b84ad", fontSize: 14 }}>
              Your account is confirmed. Redirecting you now...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
            <h2 style={{ color: "#e53e3e", margin: "0 0 8px" }}>
              Verification Failed
            </h2>
            <p style={{ color: "#6b84ad", fontSize: 14, marginBottom: 20 }}>
              The link may have expired. Try signing up again.
            </p>
            <button
              onClick={() => navigate("/login")}
              style={{
                padding: "10px 24px",
                background: "#003f8a",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Back to Login
            </button>
          </>
        )}

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </div>
  );
}
