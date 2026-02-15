import { observer } from "mobx-react-lite";
import { useState, useEffect, CSSProperties } from "react";
import { useStore } from "@ikas/storefront";
import Link from "next/link";
import { useRouter } from "next/router";
import HeaderSecondary from "src/components/header-secondary";

// ========================
// SVG ICONS
// ========================
const DentalInsuranceIcon = () => (
  <img 
    src="/dental-insurance.png" 
    alt="Dental Insurance" 
    width="24" 
    height="24"
    style={{ filter: 'brightness(0) invert(1)' }}
  />
);

const UserIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
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

const MapPinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const HeartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const LogOutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const LoaderIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
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
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "120px 20px 60px 20px",
    boxSizing: "border-box" as const,
  },
  container: {
    width: "100%",
    maxWidth: "800px",
    minHeight: "calc(100vh - 180px)",
    position: "relative" as const,
    zIndex: 10,
  },
  card: {
    background: "white",
    borderRadius: "24px",
    padding: "32px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    marginBottom: "24px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px",
  },
  avatar: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#111827",
    margin: 0,
  },
  userEmail: {
    fontSize: "14px",
    color: "#6b7280",
    margin: "4px 0 0 0",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  menuGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px",
    background: "#f9fafb",
    borderRadius: "12px",
    border: "2px solid transparent",
    cursor: "pointer",
    transition: "all 0.2s ease",
    textDecoration: "none",
    color: "#374151",
  },
  menuItemHover: {
    borderColor: "#0d9488",
    background: "#f0fdfa",
  },
  menuIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    flexShrink: 0,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: "15px",
    fontWeight: 600,
    color: "#111827",
    margin: 0,
  },
  menuDescription: {
    fontSize: "13px",
    color: "#6b7280",
    margin: "2px 0 0 0",
  },
  menuArrow: {
    color: "#9ca3af",
  },
  logoutButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    width: "100%",
    padding: "16px",
    fontSize: "16px",
    fontWeight: 600,
    color: "#dc2626",
    background: "#fef2f2",
    border: "2px solid #fecaca",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  logoutButtonHover: {
    background: "#fee2e2",
    borderColor: "#f87171",
  },
  logoutButtonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  infoCard: {
    background: "#f0fdfa",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "16px",
    border: "1px solid #99f6e4",
  },
  infoTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#0d9488",
    margin: "0 0 8px 0",
  },
  infoItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#374151",
    marginBottom: "4px",
  },
};

// ========================
// MENU ITEMS
// ========================
const menuItems = [
  {
    href: "/account/orders",
    icon: <PackageIcon />,
    title: "My Orders",
    description: "View your order history",
  },
  {
    href: "/account/addresses",
    icon: <MapPinIcon />,
    title: "Addresses",
    description: "Manage delivery addresses",
  },
];

// ========================
// COMPONENT
// ========================
interface AuthAccountProps {
  title?: string;
}

const AuthAccount: React.FC<AuthAccountProps> = (props) => {
  const store = useStore();
  const router = useRouter();
  const customer = store.customerStore.customer;

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [hoveredLogout, setHoveredLogout] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!customer?.id) {
      router.push("/account/login");
    }
  }, [customer, router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await store.customerStore.logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Show loading if not authenticated yet
  if (!customer?.id) {
    return (
      <div style={styles.pageWrapper}>
        <HeaderSecondary />
        <div style={styles.wrapper}>
          <div style={{ textAlign: "center", color: "white" }}>
            <LoaderIcon />
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageWrapper}>
      <HeaderSecondary />
      <div style={styles.wrapper}>
        <div style={styles.container}>
          {/* User Profile Card */}
          <div style={styles.card}>
            <div style={styles.header}>
              <div style={styles.avatar}>
                <DentalInsuranceIcon />
              </div>
              <div style={styles.userInfo}>
                <h1 style={styles.userName}>
                  {customer.firstName} {customer.lastName}
                </h1>
                <p style={styles.userEmail}>
                  <MailIcon />
                  {customer.email}
                </p>
                {customer.phone && (
                  <p style={{ ...styles.userEmail, marginTop: "2px" }}>
                    <PhoneIcon />
                    {customer.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Info */}
            <div style={styles.infoCard}>
              <h3 style={styles.infoTitle}>Account Information</h3>
              <div style={styles.infoItem}>
                <MailIcon />
                <span>{customer.email}</span>
              </div>
              {customer.phone && (
                <div style={styles.infoItem}>
                  <PhoneIcon />
                  <span>{customer.phone}</span>
                </div>
              )}
            </div>

            {/* Menu Grid */}
            <div style={styles.menuGrid}>
              {menuItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a
                    style={{
                      ...styles.menuItem,
                      ...(hoveredItem === item.href ? styles.menuItemHover : {}),
                    }}
                    onMouseEnter={() => setHoveredItem(item.href)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div style={styles.menuIcon}>{item.icon}</div>
                    <div style={styles.menuText}>
                      <p style={styles.menuTitle}>{item.title}</p>
                      <p style={styles.menuDescription}>{item.description}</p>
                    </div>
                    <span style={styles.menuArrow}>
                      <ChevronRightIcon />
                    </span>
                  </a>
                </Link>
              ))}
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              onMouseEnter={() => setHoveredLogout(true)}
              onMouseLeave={() => setHoveredLogout(false)}
              style={{
                ...styles.logoutButton,
                ...(hoveredLogout && !isLoggingOut ? styles.logoutButtonHover : {}),
                ...(isLoggingOut ? styles.logoutButtonDisabled : {}),
              }}
            >
              {isLoggingOut ? (
                <>
                  <LoaderIcon />
                  Logging out...
                </>
              ) : (
                <>
                  <LogOutIcon />
                  Logout
                </>
              )}
            </button>
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

export default observer(AuthAccount);
