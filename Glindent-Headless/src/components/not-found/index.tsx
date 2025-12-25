import { observer } from "mobx-react-lite";
import { useState, useEffect, CSSProperties } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import HeaderSecondary from "src/components/header-secondary";

// ========================
// SVG ICONS
// ========================
const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);

const PackageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m7.5 4.27 9 5.15" />
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
);

// Animated Tooth Icon for 404
const ToothIcon = () => (
  <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M50 10C35 10 25 20 25 35C25 50 30 60 35 75C38 85 42 90 50 90C58 90 62 85 65 75C70 60 75 50 75 35C75 20 65 10 50 10Z"
      fill="url(#toothGradient)"
      stroke="#0d9488"
      strokeWidth="3"
    />
    <ellipse cx="38" cy="35" rx="5" ry="6" fill="#ffffff" opacity="0.5" />
    {/* Sad face */}
    <circle cx="40" cy="40" r="3" fill="#0d9488" />
    <circle cx="60" cy="40" r="3" fill="#0d9488" />
    <path d="M40 60 Q50 55 60 60" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" fill="none" />
    <defs>
      <linearGradient id="toothGradient" x1="25" y1="10" x2="75" y2="90" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffffff" />
        <stop offset="1" stopColor="#e5e7eb" />
      </linearGradient>
    </defs>
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
    padding: "120px 20px 60px 20px",
    boxSizing: "border-box" as const,
  },
  container: {
    width: "100%",
    maxWidth: "600px",
    minHeight: "auto",
    position: "relative" as const,
    zIndex: 10,
  },
  card: {
    background: "white",
    borderRadius: "24px",
    padding: "48px 32px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    textAlign: "center" as const,
  },
  iconWrapper: {
    marginBottom: "24px",
    animation: "float 3s ease-in-out infinite",
  },
  errorCode: {
    fontSize: "96px",
    fontWeight: 800,
    background: "linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    margin: "0 0 8px 0",
    lineHeight: 1,
  },
  title: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#111827",
    margin: "0 0 12px 0",
  },
  description: {
    fontSize: "16px",
    color: "#6b7280",
    margin: "0 0 32px 0",
    lineHeight: 1.6,
  },
  searchWrapper: {
    position: "relative" as const,
    marginBottom: "24px",
  },
  searchInput: {
    width: "100%",
    padding: "14px 48px 14px 16px",
    fontSize: "15px",
    border: "2px solid #e5e7eb",
    borderRadius: "12px",
    outline: "none",
    transition: "all 0.2s ease",
    background: "#f9fafb",
    boxSizing: "border-box" as const,
  },
  searchButton: {
    position: "absolute" as const,
    right: "8px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  buttonsRow: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    flexWrap: "wrap" as const,
  },
  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "14px 24px",
    background: "linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)",
    color: "white",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
    transition: "all 0.2s ease",
  },
  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "14px 24px",
    background: "#f3f4f6",
    color: "#374151",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
    transition: "all 0.2s ease",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    margin: "32px 0",
    color: "#9ca3af",
    fontSize: "14px",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: "#e5e7eb",
  },
  suggestions: {
    textAlign: "left" as const,
  },
  suggestionsTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#374151",
    margin: "0 0 16px 0",
  },
  suggestionsList: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
  },
  suggestionLink: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 16px",
    background: "#f9fafb",
    borderRadius: "10px",
    color: "#374151",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 500,
    transition: "all 0.2s ease",
  },
  suggestionIcon: {
    color: "#0d9488",
    flexShrink: 0,
  },
};

// ========================
// COMPONENT
// ========================
interface NotFoundProps {
  title?: string;
  description?: string;
  showSearch?: boolean;
  showSuggestions?: boolean;
  homeButtonText?: string;
  backButtonText?: string;
  searchPlaceholder?: string;
}

const NotFound: React.FC<NotFoundProps> = ({
  title = "Page Not Found",
  description = "Oops! The page you're looking for doesn't exist or has been moved. Don't worry, let's get you back on track.",
  showSearch = true,
  showSuggestions = true,
  homeButtonText = "Go Home",
  backButtonText = "Go Back",
  searchPlaceholder = "Search for products...",
}) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const suggestions = [
    { href: "/", label: "Home Page", icon: <HomeIcon /> },
    { href: "/#products", label: "Products", icon: <PackageIcon /> },
    { href: "/search", label: "Search", icon: <SearchIcon /> },
    { href: "/account", label: "My Account", icon: <HomeIcon /> },
  ];

  if (!mounted) return null;

  return (
    <div style={styles.pageWrapper}>
      <HeaderSecondary />
      <div style={styles.wrapper}>
        <div style={styles.container}>
          <div style={styles.card}>
            {/* Animated Tooth Icon */}
            <div style={styles.iconWrapper}>
              <ToothIcon />
            </div>

            {/* Error Code */}
            <h1 style={styles.errorCode}>404</h1>

            {/* Title */}
            <h2 style={styles.title}>{title}</h2>

            {/* Description */}
            <p style={styles.description}>{description}</p>

            {/* Search Bar */}
            {showSearch && (
              <form onSubmit={handleSearch} style={styles.searchWrapper}>
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={styles.searchInput}
                />
                <button type="submit" style={styles.searchButton}>
                  <SearchIcon />
                </button>
              </form>
            )}

            {/* Action Buttons */}
            <div style={styles.buttonsRow}>
              <Link href="/">
                <a style={styles.primaryButton}>
                  <HomeIcon />
                  {homeButtonText}
                </a>
              </Link>
              <button style={styles.secondaryButton} onClick={handleGoBack}>
                <ArrowLeftIcon />
                {backButtonText}
              </button>
            </div>

            {/* Suggestions */}
            {showSuggestions && (
              <>
                <div style={styles.divider}>
                  <span style={styles.dividerLine}></span>
                  <span>or try these</span>
                  <span style={styles.dividerLine}></span>
                </div>

                <div style={styles.suggestions}>
                  <h3 style={styles.suggestionsTitle}>Quick Links</h3>
                  <div style={styles.suggestionsList}>
                    {suggestions.map((item) => (
                      <Link key={item.href} href={item.href}>
                        <a style={styles.suggestionLink}>
                          <span style={styles.suggestionIcon}>{item.icon}</span>
                          {item.label}
                        </a>
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Keyframes for floating animation */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
};

export default observer(NotFound);
