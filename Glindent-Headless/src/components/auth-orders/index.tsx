import { observer } from "mobx-react-lite";
import { useState, useEffect, CSSProperties } from "react";
import { useStore } from "@ikas/storefront";
import Link from "next/link";
import { useRouter } from "next/router";
import HeaderSecondary from "src/components/header-secondary";

// ========================
// SVG ICONS
// ========================
const PackageIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m7.5 4.27 9 5.15" />
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const TruckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
    <path d="M15 18H9" />
    <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
    <circle cx="17" cy="18" r="2" />
    <circle cx="7" cy="18" r="2" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="m9 11 3 3L22 4" />
  </svg>
);

const ClockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const XCircleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="m15 9-6 6" />
    <path d="m9 9 6 6" />
  </svg>
);

const LoaderIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const ShoppingBagIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
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
    padding: "100px 20px 40px 20px",
    boxSizing: "border-box" as const,
  },
  container: {
    width: "100%",
    maxWidth: "900px",
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
  backButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    background: "#f3f4f6",
    border: "none",
    cursor: "pointer",
    color: "#374151",
    transition: "all 0.2s ease",
  },
  title: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#111827",
    margin: 0,
    flex: 1,
  },
  orderCount: {
    fontSize: "14px",
    color: "#6b7280",
    background: "#f3f4f6",
    padding: "6px 12px",
    borderRadius: "20px",
  },
  ordersList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
  },
  orderItem: {
    display: "flex",
    flexDirection: "column" as const,
    padding: "20px",
    background: "#f9fafb",
    borderRadius: "16px",
    border: "2px solid transparent",
    cursor: "pointer",
    transition: "all 0.2s ease",
    textDecoration: "none",
  },
  orderItemHover: {
    borderColor: "#0d9488",
    background: "#f0fdfa",
  },
  orderHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "12px",
  },
  orderNumber: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#111827",
    margin: 0,
  },
  orderDate: {
    fontSize: "13px",
    color: "#6b7280",
  },
  orderBody: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
  },
  orderInfo: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "4px",
  },
  orderTotal: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#0d9488",
  },
  orderItems: {
    fontSize: "13px",
    color: "#6b7280",
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: 500,
  },
  statusDelivered: {
    background: "#d1fae5",
    color: "#065f46",
  },
  statusShipping: {
    background: "#dbeafe",
    color: "#1e40af",
  },
  statusPending: {
    background: "#fef3c7",
    color: "#92400e",
  },
  statusCancelled: {
    background: "#fee2e2",
    color: "#991b1b",
  },
  emptyState: {
    textAlign: "center" as const,
    padding: "48px 24px",
  },
  emptyIcon: {
    color: "#9ca3af",
    marginBottom: "16px",
  },
  emptyTitle: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#374151",
    margin: "0 0 8px 0",
  },
  emptyText: {
    fontSize: "14px",
    color: "#6b7280",
    margin: "0 0 24px 0",
  },
  shopButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 24px",
    background: "linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)",
    color: "white",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: 600,
    textDecoration: "none",
    transition: "all 0.2s ease",
  },
  viewArrow: {
    color: "#9ca3af",
    transition: "transform 0.2s ease",
  },
};

// ========================
// HELPER FUNCTIONS
// ========================
const getStatusInfo = (status: string) => {
  const statusLower = status?.toLowerCase() || "";
  
  if (statusLower.includes("deliver") || statusLower.includes("complet")) {
    return {
      label: "Delivered",
      style: styles.statusDelivered,
      icon: <CheckCircleIcon />,
    };
  }
  if (statusLower.includes("ship") || statusLower.includes("transit")) {
    return {
      label: "Shipping",
      style: styles.statusShipping,
      icon: <TruckIcon />,
    };
  }
  if (statusLower.includes("cancel") || statusLower.includes("refund")) {
    return {
      label: "Cancelled",
      style: styles.statusCancelled,
      icon: <XCircleIcon />,
    };
  }
  return {
    label: "Processing",
    style: styles.statusPending,
    icon: <ClockIcon />,
  };
};

const formatDate = (dateString: string | number | Date) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatPrice = (price: number, currency: string = "GBP") => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency,
  }).format(price);
};

// ========================
// COMPONENT
// ========================
interface AuthOrdersProps {
  title?: string;
  orders?: any[];
}

const AuthOrders: React.FC<AuthOrdersProps> = (props) => {
  const { orders: propsOrders } = props;
  const store = useStore();
  const router = useRouter();
  const customer = store.customerStore.customer;

  const [orders, setOrders] = useState<any[]>(propsOrders || []);
  const [isLoading, setIsLoading] = useState(!propsOrders);
  const [hoveredOrder, setHoveredOrder] = useState<string | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!customer?.id) {
      router.push("/account/login");
      return;
    }

    // If orders not passed as prop, set empty (ikas provides via props)
    if (!propsOrders) {
      setOrders([]);
      setIsLoading(false);
    }
  }, [customer, router, propsOrders]);

  // Show loading
  if (isLoading || !customer?.id) {
    return (
      <div style={styles.pageWrapper}>
        <HeaderSecondary />
        <div style={styles.wrapper}>
          <div style={{ textAlign: "center", color: "white" }}>
            <LoaderIcon />
            <p>Loading orders...</p>
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
          <div style={styles.card}>
            {/* Header */}
            <div style={styles.header}>
              <Link href="/account">
                <a style={styles.backButton}>
                  <ChevronLeftIcon />
                </a>
              </Link>
              <h1 style={styles.title}>My Orders</h1>
              {orders.length > 0 && (
                <span style={styles.orderCount}>
                  {orders.length} order{orders.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {/* Orders List */}
            {orders.length > 0 ? (
              <div style={styles.ordersList}>
                {orders.map((order: any) => {
                  const statusInfo = getStatusInfo(order.status || order.orderStatus);
                  const isHovered = hoveredOrder === order.id;

                  return (
                    <Link key={order.id} href={`/account/orders/${order.id}`}>
                      <a
                        style={{
                          ...styles.orderItem,
                          ...(isHovered ? styles.orderItemHover : {}),
                        }}
                        onMouseEnter={() => setHoveredOrder(order.id)}
                        onMouseLeave={() => setHoveredOrder(null)}
                      >
                        <div style={styles.orderHeader}>
                          <p style={styles.orderNumber}>
                            Order #{order.orderNumber || order.id?.slice(-8)}
                          </p>
                          <span style={styles.orderDate}>
                            {formatDate(order.createdAt || order.date)}
                          </span>
                        </div>
                        <div style={styles.orderBody}>
                          <div style={styles.orderInfo}>
                            <span style={styles.orderTotal}>
                              {formatPrice(
                                order.totalPrice?.finalPrice || order.total || 0,
                                order.currency || "GBP"
                              )}
                            </span>
                            <span style={styles.orderItems}>
                              {order.lineItems?.length || order.items?.length || 0} item
                              {(order.lineItems?.length || order.items?.length || 0) !== 1
                                ? "s"
                                : ""}
                            </span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <span style={{ ...styles.statusBadge, ...statusInfo.style }}>
                              {statusInfo.icon}
                              {statusInfo.label}
                            </span>
                            <span
                              style={{
                                ...styles.viewArrow,
                                transform: isHovered ? "translateX(4px)" : "none",
                              }}
                            >
                              <ChevronRightIcon />
                            </span>
                          </div>
                        </div>
                      </a>
                    </Link>
                  );
                })}
              </div>
            ) : (
              /* Empty State */
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>
                  <ShoppingBagIcon />
                </div>
                <h3 style={styles.emptyTitle}>No orders yet</h3>
                <p style={styles.emptyText}>
                  When you place an order, it will appear here.
                </p>
                <Link href="/#products">
                  <a style={styles.shopButton}>Start Shopping</a>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Keyframes for spinner animation */}
      <style jsx global>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default observer(AuthOrders);
