import { observer } from "mobx-react-lite";
import { useState, useEffect, CSSProperties } from "react";
import { useStore } from "@ikas/storefront";
import Link from "next/link";
import { useRouter } from "next/router";
import HeaderSecondary from "src/components/header-secondary";

// ========================
// SVG ICONS
// ========================
const ChevronLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
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

const MapPinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const CreditCardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" x2="22" y1="10" y2="10" />
  </svg>
);

const LoaderIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
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
    flexWrap: "wrap" as const,
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
    textDecoration: "none",
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#111827",
    margin: 0,
  },
  orderDate: {
    fontSize: "14px",
    color: "#6b7280",
    margin: "4px 0 0 0",
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "14px",
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
  section: {
    marginBottom: "24px",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#111827",
    margin: "0 0 16px 0",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  sectionIcon: {
    color: "#0d9488",
  },
  itemsList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
  },
  item: {
    display: "flex",
    gap: "16px",
    padding: "16px",
    background: "#f9fafb",
    borderRadius: "12px",
  },
  itemImage: {
    width: "80px",
    height: "80px",
    borderRadius: "8px",
    objectFit: "cover" as const,
    background: "#e5e7eb",
  },
  itemInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
  },
  itemName: {
    fontSize: "15px",
    fontWeight: 600,
    color: "#111827",
    margin: "0 0 4px 0",
  },
  itemVariant: {
    fontSize: "13px",
    color: "#6b7280",
    margin: "0 0 4px 0",
  },
  itemQty: {
    fontSize: "13px",
    color: "#6b7280",
    margin: 0,
  },
  itemPrice: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  price: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#111827",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "16px",
  },
  infoCard: {
    padding: "16px",
    background: "#f9fafb",
    borderRadius: "12px",
  },
  infoLabel: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#6b7280",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    margin: "0 0 8px 0",
  },
  infoText: {
    fontSize: "14px",
    color: "#374151",
    margin: "0 0 4px 0",
    lineHeight: 1.5,
  },
  summary: {
    borderTop: "2px solid #f3f4f6",
    paddingTop: "24px",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  summaryLabel: {
    fontSize: "14px",
    color: "#6b7280",
  },
  summaryValue: {
    fontSize: "14px",
    color: "#374151",
    fontWeight: 500,
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "16px",
    paddingTop: "16px",
    borderTop: "2px solid #f3f4f6",
  },
  totalLabel: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#111827",
  },
  totalValue: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#0d9488",
  },
  notFound: {
    textAlign: "center" as const,
    padding: "48px 24px",
    color: "#6b7280",
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
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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
interface AuthOrderDetailProps {
  order?: any;
}

const AuthOrderDetail: React.FC<AuthOrderDetailProps> = (props) => {
  const { order: orderProp } = props;
  const store = useStore();
  const router = useRouter();
  const { id } = router.query;
  const customer = store.customerStore.customer;

  const [order, setOrder] = useState<any>(orderProp || null);
  const [isLoading, setIsLoading] = useState(!orderProp);

  // Redirect if not logged in
  useEffect(() => {
    if (!customer?.id) {
      router.push("/account/login");
      return;
    }

    // If order not passed as prop, loading is complete
    if (!order && id) {
      setIsLoading(false);
    }
  }, [customer, router, id, order]);

  // Show loading
  if (isLoading || !customer?.id) {
    return (
      <div style={styles.pageWrapper}>
        <HeaderSecondary />
        <div style={styles.wrapper}>
          <div style={{ textAlign: "center", color: "white" }}>
            <LoaderIcon />
            <p>Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Order not found
  if (!order) {
    return (
      <div style={styles.pageWrapper}>
        <HeaderSecondary />
        <div style={styles.wrapper}>
          <div style={styles.container}>
            <div style={styles.card}>
              <div style={styles.header}>
                <Link href="/account/orders">
                  <a style={styles.backButton}>
                    <ChevronLeftIcon />
                  </a>
                </Link>
                <h1 style={styles.title}>Order Not Found</h1>
              </div>
              <div style={styles.notFound}>
                <p>The order you're looking for doesn't exist or you don't have access to it.</p>
                <Link href="/account/orders">
                  <a style={{ color: "#0d9488", fontWeight: 500 }}>Back to Orders</a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status || order.orderStatus);
  const lineItems = order.lineItems || order.items || [];
  const shippingAddress = order.shippingAddress || order.address || {};
  const billingAddress = order.billingAddress || shippingAddress;

  return (
    <div style={styles.pageWrapper}>
      <HeaderSecondary />
      <div style={styles.wrapper}>
        <div style={styles.container}>
          <div style={styles.card}>
            {/* Header */}
            <div style={styles.header}>
              <Link href="/account/orders">
                <a style={styles.backButton}>
                  <ChevronLeftIcon />
                </a>
              </Link>
              <div style={styles.headerInfo}>
                <h1 style={styles.title}>
                  Order #{order.orderNumber || order.id?.slice(-8)}
                </h1>
                <p style={styles.orderDate}>
                  Placed on {formatDate(order.createdAt || order.date)}
                </p>
              </div>
              <span style={{ ...styles.statusBadge, ...statusInfo.style }}>
                {statusInfo.icon}
                {statusInfo.label}
              </span>
            </div>

            {/* Order Items */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Order Items</h2>
              <div style={styles.itemsList}>
                {lineItems.map((item: any, index: number) => (
                  <div key={item.id || index} style={styles.item}>
                    <img
                      src={item.image?.url || item.imageUrl || "/placeholder.png"}
                      alt={item.name || item.title}
                      style={styles.itemImage}
                      onError={(e: any) => {
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%23e5e7eb' width='80' height='80'/%3E%3C/svg%3E";
                      }}
                    />
                    <div style={styles.itemInfo}>
                      <p style={styles.itemName}>{item.name || item.title}</p>
                      {item.variant && (
                        <p style={styles.itemVariant}>{item.variant}</p>
                      )}
                      <p style={styles.itemQty}>Qty: {item.quantity || 1}</p>
                    </div>
                    <div style={styles.itemPrice}>
                      <span style={styles.price}>
                        {formatPrice(
                          item.price?.finalPrice || item.price || 0,
                          order.currency || "GBP"
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping & Billing Info */}
            <div style={styles.section}>
              <div style={styles.infoGrid}>
                {/* Shipping Address */}
                <div style={styles.infoCard}>
                  <p style={styles.infoLabel}>
                    <span style={styles.sectionIcon}>
                      <MapPinIcon />
                    </span>{" "}
                    Shipping Address
                  </p>
                  <p style={styles.infoText}>
                    {shippingAddress.firstName} {shippingAddress.lastName}
                  </p>
                  <p style={styles.infoText}>{shippingAddress.addressLine1}</p>
                  {shippingAddress.addressLine2 && (
                    <p style={styles.infoText}>{shippingAddress.addressLine2}</p>
                  )}
                  <p style={styles.infoText}>
                    {shippingAddress.city}, {shippingAddress.postalCode}
                  </p>
                  <p style={styles.infoText}>{shippingAddress.country}</p>
                </div>

                {/* Payment Info */}
                <div style={styles.infoCard}>
                  <p style={styles.infoLabel}>
                    <span style={styles.sectionIcon}>
                      <CreditCardIcon />
                    </span>{" "}
                    Payment Method
                  </p>
                  <p style={styles.infoText}>
                    {order.paymentMethod || "Credit Card"}
                  </p>
                  {order.paymentStatus && (
                    <p style={styles.infoText}>Status: {order.paymentStatus}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div style={styles.summary}>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Subtotal</span>
                <span style={styles.summaryValue}>
                  {formatPrice(
                    order.subtotal || order.totalPrice?.basePrice || 0,
                    order.currency || "GBP"
                  )}
                </span>
              </div>
              {order.shippingPrice > 0 && (
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Shipping</span>
                  <span style={styles.summaryValue}>
                    {formatPrice(order.shippingPrice, order.currency || "GBP")}
                  </span>
                </div>
              )}
              {order.discount > 0 && (
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Discount</span>
                  <span style={{ ...styles.summaryValue, color: "#059669" }}>
                    -{formatPrice(order.discount, order.currency || "GBP")}
                  </span>
                </div>
              )}
              <div style={styles.totalRow}>
                <span style={styles.totalLabel}>Total</span>
                <span style={styles.totalValue}>
                  {formatPrice(
                    order.totalPrice?.finalPrice || order.total || 0,
                    order.currency || "GBP"
                  )}
                </span>
              </div>
            </div>
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

export default observer(AuthOrderDetail);
