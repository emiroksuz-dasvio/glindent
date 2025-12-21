import { observer } from "mobx-react-lite";
import { useState, useEffect, CSSProperties } from "react";
import { RegisterForm, useStore } from "@ikas/storefront";
import Link from "next/link";
import { useRouter } from "next/router";
import HeaderSecondary from "src/components/header-secondary";

// ========================
// IKAS PROPS INTERFACE
// ========================
interface AuthRegisterProps {
  title?: string;
  subtitle?: string;
  firstNameLabel?: string;
  lastNameLabel?: string;
  emailLabel?: string;
  passwordLabel?: string;
  phoneLabel?: string;
  marketingLabel?: string;
  submitButtonText?: string;
  loginLinkText?: string;
  loginLinkUrl?: string;
  successMessage?: string;
  // Error messages
  requiredMessage?: string;
  emailErrorMessage?: string;
  minLengthMessage?: string;
  phoneErrorMessage?: string;
}

// ========================
// SVG ICONS
// ========================
const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const LoaderIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const GlindentLogo = () => (
  <svg viewBox="0 0 280 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: '48px', width: 'auto' }}>
    <text x="5" y="52" fill="white" fontFamily="'Poppins', 'Arial Black', sans-serif" fontSize="52" fontWeight="900" fontStyle="italic" letterSpacing="-2px">
      glindent
    </text>
    <g transform="translate(168, 28)">
      <line x1="0" y1="-12" x2="0" y2="12" stroke="white" strokeWidth="2" />
      <line x1="-12" y1="0" x2="12" y2="0" stroke="white" strokeWidth="2" />
      <circle cx="0" cy="0" r="2" fill="white" />
    </g>
    <text x="138" y="72" fill="rgba(255,255,255,0.8)" fontFamily="'Poppins', Arial, sans-serif" fontSize="11" fontWeight="400" letterSpacing="3px">
      WAY TO DENTISTRY
    </text>
  </svg>
);

// ========================
// STYLES
// ========================
const styles: { [key: string]: CSSProperties } = {
  pageWrapper: {
    minHeight: "100vh",
    background: "linear-gradient(165deg, #0d9488 0%, #0891b2 50%, #06b6d4 100%)",
    position: "relative" as const,
    zIndex: 1,
  },
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "100px 20px 40px 20px", // Top padding for header
    boxSizing: "border-box" as const,
  },
  container: {
    width: "100%",
    maxWidth: "480px",
    position: "relative" as const,
    zIndex: 10, // Below header (z-index 50)
  },
  logoContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "32px",
  },
  card: {
    background: "white",
    borderRadius: "24px",
    padding: "32px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  },
  header: {
    textAlign: "center" as const,
    marginBottom: "32px",
  },
  title: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#111827",
    margin: "0 0 8px 0",
  },
  subtitle: {
    fontSize: "15px",
    color: "#6b7280",
    margin: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "20px",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#374151",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  },
  inputWrapper: {
    position: "relative" as const,
    display: "flex",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute" as const,
    left: "14px",
    color: "#9ca3af",
    pointerEvents: "none" as const,
  },
  input: {
    width: "100%",
    padding: "14px 14px 14px 44px",
    fontSize: "15px",
    border: "2px solid #e5e7eb",
    borderRadius: "12px",
    outline: "none",
    transition: "all 0.2s ease",
    background: "#f9fafb",
  },
  inputError: {
    borderColor: "#ef4444",
    background: "#fef2f2",
  },
  inputFocus: {
    borderColor: "#0d9488",
    background: "white",
    boxShadow: "0 0 0 3px rgba(13, 148, 136, 0.1)",
  },
  passwordToggle: {
    position: "absolute" as const,
    right: "14px",
    background: "none",
    border: "none",
    color: "#9ca3af",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: "12px",
    color: "#ef4444",
    marginTop: "4px",
  },
  checkboxGroup: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
  },
  checkbox: {
    width: "20px",
    height: "20px",
    borderRadius: "6px",
    border: "2px solid #e5e7eb",
    background: "white",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: "2px",
    transition: "all 0.2s ease",
  },
  checkboxChecked: {
    background: "#0d9488",
    borderColor: "#0d9488",
  },
  checkboxLabel: {
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: 1.5,
    cursor: "pointer",
  },
  submitButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    width: "100%",
    padding: "16px",
    fontSize: "16px",
    fontWeight: 600,
    color: "white",
    background: "linear-gradient(135deg, #0d9488 0%, #0891b2 50%, #06b6d4 100%)",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginTop: "8px",
  },
  submitButtonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  submitButtonHover: {
    transform: "translateY(-2px)",
    boxShadow: "0 10px 20px rgba(13, 148, 136, 0.3)",
  },
  footer: {
    textAlign: "center" as const,
    marginTop: "24px",
    paddingTop: "24px",
    borderTop: "1px solid #e5e7eb",
  },
  footerText: {
    fontSize: "14px",
    color: "#6b7280",
    margin: 0,
  },
  footerLink: {
    color: "#0d9488",
    fontWeight: 600,
    textDecoration: "none",
  },
  successMessage: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    padding: "16px",
    background: "#d1fae5",
    borderRadius: "12px",
    color: "#065f46",
    fontSize: "14px",
    fontWeight: 500,
  },
  errorMessage: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    padding: "16px",
    background: "#fef2f2",
    borderRadius: "12px",
    color: "#991b1b",
    fontSize: "14px",
    fontWeight: 500,
  },
};

// ========================
// COMPONENT
// ========================
const AuthRegister: React.FC<AuthRegisterProps> = (props) => {
  const {
    title = "Create Account",
    subtitle = "Join Glindent and start shopping premium dental supplies",
    firstNameLabel = "First Name",
    lastNameLabel = "Last Name",
    emailLabel = "Email Address",
    passwordLabel = "Password",
    phoneLabel = "Phone Number (Optional)",
    marketingLabel = "I want to receive news and promotional emails",
    submitButtonText = "Create Account",
    loginLinkText = "Already have an account?",
    loginLinkUrl = "/account/login",
    successMessage = "Account created successfully! Redirecting...",
    requiredMessage = "This field is required",
    emailErrorMessage = "Please enter a valid email address",
    minLengthMessage = "Password must be at least 6 characters",
    phoneErrorMessage = "Please enter a valid phone number",
  } = props;

  const store = useStore();
  const router = useRouter();
  
  // Initialize RegisterForm with error messages
  const [registerForm] = useState(() => new RegisterForm({
    message: {
      requiredRule: requiredMessage,
      emailRule: emailErrorMessage,
      minRule: minLengthMessage,
      phoneRule: phoneErrorMessage,
    }
  }));

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [hoveredButton, setHoveredButton] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    if (store.customerStore.customer?.id) {
      router.push("/account");
    }
  }, [store.customerStore.customer, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setIsLoading(true);

    try {
      // Debug: Log form values
      console.log("Register form values:", {
        firstName: registerForm.firstName,
        lastName: registerForm.lastName,
        email: registerForm.email,
        phone: registerForm.phone,
        isMarketingAccepted: registerForm.isMarketingAccepted,
      });

      // Trigger validation
      await registerForm.validateAll();
      
      // Check for validation errors by looking at error messages
      const hasErrors = !!(
        registerForm.firstNameErrorMessage ||
        registerForm.lastNameErrorMessage ||
        registerForm.emailErrorMessage ||
        registerForm.passwordErrorMessage ||
        registerForm.phoneErrorMessage
      );
      
      console.log("Form validation errors:", {
        firstName: registerForm.firstNameErrorMessage,
        lastName: registerForm.lastNameErrorMessage,
        email: registerForm.emailErrorMessage,
        password: registerForm.passwordErrorMessage,
        phone: registerForm.phoneErrorMessage,
        hasErrors,
      });
      
      if (hasErrors) {
        setIsLoading(false);
        return;
      }

      console.log("Calling registerForm.register()...");
      const result = await registerForm.register();
      console.log("Register result:", result);
      
      if (result.isSuccess) {
        setIsSuccess(true);
        console.log("Registration successful! Customer:", store.customerStore.customer);
        // Redirect after successful registration
        setTimeout(() => {
          const redirect = registerForm.redirect;
          router.push(redirect || "/");
        }, 2000);
      } else {
        // Handle error - ikas returns error info in different formats
        console.log("Registration failed. Error codes:", result.errorCodes);
        if (result.errorCodes && result.errorCodes.length > 0) {
          const errorCode = String(result.errorCodes[0]);
          if (errorCode.includes("EMAIL") && errorCode.includes("EXIST")) {
            setApiError("An account with this email already exists. Please login or use a different email.");
          } else if (errorCode.includes("EMAIL") || errorCode.includes("INVALID")) {
            setApiError("Please enter a valid email address.");
          } else if (errorCode.includes("PASSWORD") || errorCode.includes("WEAK")) {
            setApiError("Password is too weak. Please use a stronger password.");
          } else {
            setApiError(`Registration failed: ${errorCode}`);
          }
        } else {
          setApiError("Registration failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      setApiError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getInputStyle = (fieldName: string, hasError: boolean): CSSProperties => {
    const baseStyle = { ...styles.input };
    
    if (hasError) {
      return { ...baseStyle, ...styles.inputError };
    }
    
    if (focusedField === fieldName) {
      return { ...baseStyle, ...styles.inputFocus };
    }
    
    return baseStyle;
  };

  return (
    <div style={styles.pageWrapper}>
      <HeaderSecondary />
      <div style={styles.wrapper}>
        <div style={styles.container}>
          {/* Card */}
          <div style={styles.card}>
            {/* Header */}
            <div style={styles.header}>
              <h1 style={styles.title}>{title}</h1>
              <p style={styles.subtitle}>{subtitle}</p>
            </div>

            {/* Success Message */}
            {isSuccess && (
              <div style={styles.successMessage}>
                <CheckIcon />
                {successMessage}
              </div>
            )}

            {/* Error Message */}
            {apiError && (
              <div style={styles.errorMessage}>
                {apiError}
              </div>
            )}

            {/* Form */}
            {!isSuccess && (
              <form onSubmit={handleSubmit} style={styles.form}>
                {/* Name Row */}
                <div style={styles.row}>
                  {/* First Name */}
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>{firstNameLabel}</label>
                    <div style={styles.inputWrapper}>
                      <span style={styles.inputIcon}><UserIcon /></span>
                      <input
                        type="text"
                      value={registerForm.firstName}
                      onChange={(e) => registerForm.onFirstNameChange(e.target.value)}
                      onFocus={() => setFocusedField("firstName")}
                      onBlur={() => setFocusedField(null)}
                      style={getInputStyle("firstName", !!registerForm.firstNameErrorMessage)}
                      placeholder="John"
                    />
                  </div>
                  {registerForm.firstNameErrorMessage && (
                    <span style={styles.errorText}>{registerForm.firstNameErrorMessage}</span>
                  )}
                </div>

                {/* Last Name */}
                <div style={styles.inputGroup}>
                  <label style={styles.label}>{lastNameLabel}</label>
                  <div style={styles.inputWrapper}>
                    <span style={styles.inputIcon}><UserIcon /></span>
                    <input
                      type="text"
                      value={registerForm.lastName}
                      onChange={(e) => registerForm.onLastNameChange(e.target.value)}
                      onFocus={() => setFocusedField("lastName")}
                      onBlur={() => setFocusedField(null)}
                      style={getInputStyle("lastName", !!registerForm.lastNameErrorMessage)}
                      placeholder="Doe"
                    />
                  </div>
                  {registerForm.lastNameErrorMessage && (
                    <span style={styles.errorText}>{registerForm.lastNameErrorMessage}</span>
                  )}
                </div>
              </div>

              {/* Email */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>{emailLabel}</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}><MailIcon /></span>
                  <input
                    type="email"
                    value={registerForm.email || ""}
                    onChange={(e) => registerForm.onEmailChange(e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    style={getInputStyle("email", !!registerForm.emailErrorMessage)}
                    placeholder="john@example.com"
                  />
                </div>
                {registerForm.emailErrorMessage && (
                  <span style={styles.errorText}>{registerForm.emailErrorMessage}</span>
                )}
              </div>

              {/* Password */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>{passwordLabel}</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}><LockIcon /></span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={registerForm.password || ""}
                    onChange={(e) => registerForm.onPasswordChange(e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      ...getInputStyle("password", !!registerForm.passwordErrorMessage),
                      paddingRight: "44px",
                    }}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.passwordToggle}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {registerForm.passwordErrorMessage && (
                  <span style={styles.errorText}>{registerForm.passwordErrorMessage}</span>
                )}
              </div>

              {/* Phone (Optional) */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>{phoneLabel}</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}><PhoneIcon /></span>
                  <input
                    type="tel"
                    value={registerForm.phone || ""}
                    onChange={(e) => registerForm.onPhoneChange(e.target.value)}
                    onFocus={() => setFocusedField("phone")}
                    onBlur={() => setFocusedField(null)}
                    style={getInputStyle("phone", !!registerForm.phoneErrorMessage)}
                    placeholder="+44 7xxx xxx xxx"
                  />
                </div>
                {registerForm.phoneErrorMessage && (
                  <span style={styles.errorText}>{registerForm.phoneErrorMessage}</span>
                )}
              </div>

              {/* Marketing Checkbox */}
              <div style={styles.checkboxGroup}>
                <div
                  onClick={() => registerForm.isMarketingAccepted = !registerForm.isMarketingAccepted}
                  style={{
                    ...styles.checkbox,
                    ...(registerForm.isMarketingAccepted ? styles.checkboxChecked : {}),
                  }}
                >
                  {registerForm.isMarketingAccepted && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span
                  style={styles.checkboxLabel}
                  onClick={() => registerForm.isMarketingAccepted = !registerForm.isMarketingAccepted}
                >
                  {marketingLabel}
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                onMouseEnter={() => setHoveredButton(true)}
                onMouseLeave={() => setHoveredButton(false)}
                style={{
                  ...styles.submitButton,
                  ...(isLoading ? styles.submitButtonDisabled : {}),
                  ...(hoveredButton && !isLoading ? styles.submitButtonHover : {}),
                }}
              >
                {isLoading ? (
                  <>
                    <LoaderIcon />
                    Creating Account...
                  </>
                ) : (
                  submitButtonText
                )}
              </button>
            </form>
          )}

          {/* Footer */}
          <div style={styles.footer}>
            <p style={styles.footerText}>
              {loginLinkText}{" "}
              <Link href={loginLinkUrl} style={styles.footerLink}>
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>

      {/* Keyframes for spinner animation */}
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default observer(AuthRegister);
