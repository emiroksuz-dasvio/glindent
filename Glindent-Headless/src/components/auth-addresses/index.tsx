import { observer } from "mobx-react-lite";
import { useState, useEffect, CSSProperties } from "react";
import { useStore } from "@ikas/storefront";
import Link from "next/link";
import { useRouter } from "next/router";
import HeaderSecondary from "src/components/header-secondary";

// ========================
// SVG ICONS
// ========================
const MapPinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const LoaderIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const HomeIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
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
    maxWidth: "900px",
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
  title: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#111827",
    margin: 0,
    flex: 1,
  },
  addButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    background: "linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)",
    color: "white",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  addressGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px",
  },
  addressCard: {
    padding: "20px",
    background: "#f9fafb",
    borderRadius: "16px",
    border: "2px solid transparent",
    transition: "all 0.2s ease",
    position: "relative" as const,
  },
  addressCardHover: {
    borderColor: "#0d9488",
    background: "#f0fdfa",
  },
  addressCardDefault: {
    borderColor: "#0d9488",
    background: "#f0fdfa",
  },
  defaultBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    position: "absolute" as const,
    top: "12px",
    right: "12px",
    padding: "4px 10px",
    background: "#0d9488",
    color: "white",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: 600,
  },
  addressTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#111827",
    margin: "0 0 12px 0",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  addressText: {
    fontSize: "14px",
    color: "#6b7280",
    margin: "0 0 4px 0",
    lineHeight: 1.5,
  },
  addressActions: {
    display: "flex",
    gap: "8px",
    marginTop: "16px",
    paddingTop: "16px",
    borderTop: "1px solid #e5e7eb",
  },
  actionButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    padding: "8px 12px",
    fontSize: "13px",
    fontWeight: 500,
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  editButton: {
    background: "#e5e7eb",
    color: "#374151",
  },
  deleteButton: {
    background: "#fee2e2",
    color: "#dc2626",
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
  // Modal styles
  modalOverlay: {
    position: "fixed" as const,
    inset: 0,
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
    padding: "20px",
  },
  modal: {
    background: "white",
    borderRadius: "24px",
    padding: "32px",
    width: "100%",
    maxWidth: "500px",
    maxHeight: "90vh",
    overflow: "auto",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "24px",
  },
  modalTitle: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#111827",
    margin: 0,
  },
  modalClose: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "#f3f4f6",
    border: "none",
    cursor: "pointer",
    color: "#6b7280",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
  },
  formRow: {
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
  },
  input: {
    padding: "12px 14px",
    fontSize: "15px",
    border: "2px solid #e5e7eb",
    borderRadius: "10px",
    outline: "none",
    transition: "all 0.2s ease",
    background: "#f9fafb",
  },
  inputFocus: {
    borderColor: "#0d9488",
    background: "white",
  },
  checkbox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
  },
  submitButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "14px",
    background: "linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)",
    color: "white",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
    marginTop: "8px",
  },
  errorText: {
    fontSize: "12px",
    color: "#ef4444",
    marginTop: "4px",
  },
};

// ========================
// COMPONENT
// ========================
interface AuthAddressesProps {
  title?: string;
  addresses?: any[];
}

const AuthAddresses: React.FC<AuthAddressesProps> = (props) => {
  const { addresses: propsAddresses } = props;
  const store = useStore();
  const router = useRouter();
  const customer = store.customerStore.customer;

  const [addresses, setAddresses] = useState<any[]>(propsAddresses || []);
  const [isLoading, setIsLoading] = useState(!propsAddresses);
  const [hoveredAddress, setHoveredAddress] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United Kingdom",
    isDefault: false,
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!customer?.id) {
      router.push("/account/login");
      return;
    }

    // If addresses not passed as prop, use customer addresses
    if (!propsAddresses && customer) {
      const customerAddresses = (customer as any).addresses || [];
      setAddresses(customerAddresses);
      setIsLoading(false);
    }
  }, [customer, router, propsAddresses]);

  const handleOpenModal = (address?: any) => {
    if (address) {
      setEditingAddress(address);
      setFormData({
        firstName: address.firstName || "",
        lastName: address.lastName || "",
        phone: address.phone || "",
        addressLine1: address.addressLine1 || address.address1 || "",
        addressLine2: address.addressLine2 || address.address2 || "",
        city: typeof address.city === 'object' ? address.city?.name : (address.city || ""),
        state: typeof address.state === 'object' ? address.state?.name : (address.state || address.province || ""),
        postalCode: address.postalCode || address.zip || "",
        country: typeof address.country === 'object' ? address.country?.name : (address.country || "United Kingdom"),
        isDefault: address.isDefault || false,
      });
    } else {
      setEditingAddress(null);
      setFormData({
        firstName: customer?.firstName || "",
        lastName: customer?.lastName || "",
        phone: customer?.phone || "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "United Kingdom",
        isDefault: addresses.length === 0,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAddress(null);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // For now, use local state management
      // ikas address management should be handled through their API
      const newAddress = {
        id: editingAddress?.id || `addr_${Date.now()}`,
        ...formData,
      };

      if (editingAddress) {
        // Update existing
        setAddresses(prev => prev.map(a => a.id === editingAddress.id ? newAddress : a));
      } else {
        // Add new
        setAddresses(prev => [...prev, newAddress]);
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error saving address:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (address: any) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      // Remove from local state
      setAddresses(prev => prev.filter((a) => a.id !== address.id));
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  // Show loading
  if (isLoading || !customer?.id) {
    return (
      <div style={styles.pageWrapper}>
        <HeaderSecondary />
        <div style={styles.wrapper}>
          <div style={{ textAlign: "center", color: "white" }}>
            <LoaderIcon />
            <p>Loading addresses...</p>
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
              <h1 style={styles.title}>My Addresses</h1>
              <button style={styles.addButton} onClick={() => handleOpenModal()}>
                <PlusIcon />
                Add Address
              </button>
            </div>

            {/* Addresses Grid */}
            {addresses.length > 0 ? (
              <div style={styles.addressGrid}>
                {addresses.map((address: any) => {
                  const isHovered = hoveredAddress === address.id;
                  const isDefault = address.isDefault;

                  return (
                    <div
                      key={address.id}
                      style={{
                        ...styles.addressCard,
                        ...(isDefault ? styles.addressCardDefault : {}),
                        ...(isHovered && !isDefault ? styles.addressCardHover : {}),
                      }}
                      onMouseEnter={() => setHoveredAddress(address.id)}
                      onMouseLeave={() => setHoveredAddress(null)}
                    >
                      {isDefault && (
                        <span style={styles.defaultBadge}>
                          <StarIcon />
                          Default
                        </span>
                      )}
                      <h3 style={styles.addressTitle}>
                        <MapPinIcon />
                        {address.firstName} {address.lastName}
                      </h3>
                      <p style={styles.addressText}>
                        {address.addressLine1 || address.address1}
                      </p>
                      {(address.addressLine2 || address.address2) && (
                        <p style={styles.addressText}>
                          {address.addressLine2 || address.address2}
                        </p>
                      )}
                      <p style={styles.addressText}>
                        {typeof address.city === 'object' ? address.city?.name : address.city}, {typeof address.state === 'object' ? address.state?.name : (address.state || address.province)}{" "}
                        {address.postalCode || address.zip}
                      </p>
                      <p style={styles.addressText}>
                        {typeof address.country === 'object' ? address.country?.name : address.country}
                      </p>
                      {address.phone && (
                        <p style={styles.addressText}>{address.phone}</p>
                      )}

                      <div style={styles.addressActions}>
                        <button
                          style={{ ...styles.actionButton, ...styles.editButton }}
                          onClick={() => handleOpenModal(address)}
                        >
                          <EditIcon />
                          Edit
                        </button>
                        {!isDefault && (
                          <button
                            style={{ ...styles.actionButton, ...styles.deleteButton }}
                            onClick={() => handleDelete(address)}
                          >
                            <TrashIcon />
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Empty State */
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>
                  <HomeIcon />
                </div>
                <h3 style={styles.emptyTitle}>No addresses saved</h3>
                <p style={styles.emptyText}>
                  Add your delivery address to make checkout faster.
                </p>
                <button style={styles.addButton} onClick={() => handleOpenModal()}>
                  <PlusIcon />
                  Add Address
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Address Modal */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={handleCloseModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {editingAddress ? "Edit Address" : "Add New Address"}
              </h2>
              <button style={styles.modalClose} onClick={handleCloseModal}>
                <XIcon />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formRow}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    onFocus={() => setFocusedField("firstName")}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      ...styles.input,
                      ...(focusedField === "firstName" ? styles.inputFocus : {}),
                    }}
                    required
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    onFocus={() => setFocusedField("lastName")}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      ...styles.input,
                      ...(focusedField === "lastName" ? styles.inputFocus : {}),
                    }}
                    required
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  onFocus={() => setFocusedField("phone")}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    ...styles.input,
                    ...(focusedField === "phone" ? styles.inputFocus : {}),
                  }}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Address Line 1</label>
                <input
                  type="text"
                  value={formData.addressLine1}
                  onChange={(e) => handleInputChange("addressLine1", e.target.value)}
                  onFocus={() => setFocusedField("addressLine1")}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    ...styles.input,
                    ...(focusedField === "addressLine1" ? styles.inputFocus : {}),
                  }}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Address Line 2 (Optional)</label>
                <input
                  type="text"
                  value={formData.addressLine2}
                  onChange={(e) => handleInputChange("addressLine2", e.target.value)}
                  onFocus={() => setFocusedField("addressLine2")}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    ...styles.input,
                    ...(focusedField === "addressLine2" ? styles.inputFocus : {}),
                  }}
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    onFocus={() => setFocusedField("city")}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      ...styles.input,
                      ...(focusedField === "city" ? styles.inputFocus : {}),
                    }}
                    required
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>County/State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    onFocus={() => setFocusedField("state")}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      ...styles.input,
                      ...(focusedField === "state" ? styles.inputFocus : {}),
                    }}
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Postal Code</label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange("postalCode", e.target.value)}
                    onFocus={() => setFocusedField("postalCode")}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      ...styles.input,
                      ...(focusedField === "postalCode" ? styles.inputFocus : {}),
                    }}
                    required
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                    onFocus={() => setFocusedField("country")}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      ...styles.input,
                      ...(focusedField === "country" ? styles.inputFocus : {}),
                    }}
                    required
                  />
                </div>
              </div>

              <label style={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => handleInputChange("isDefault", e.target.checked)}
                />
                <span style={{ fontSize: "14px", color: "#374151" }}>
                  Set as default address
                </span>
              </label>

              <button
                type="submit"
                style={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <LoaderIcon />
                    Saving...
                  </>
                ) : editingAddress ? (
                  "Update Address"
                ) : (
                  "Add Address"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

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

export default observer(AuthAddresses);
