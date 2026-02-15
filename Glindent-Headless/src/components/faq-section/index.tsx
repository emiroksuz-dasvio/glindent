import { observer } from "mobx-react-lite";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

// ========================
// IKAS PROPS INTERFACE
// ========================
interface FaqSectionProps {
  // Title
  sectionTitle?: string;
  // FAQ Items
  faq1Question?: string;
  faq1Answer?: string;
  faq2Question?: string;
  faq2Answer?: string;
  faq3Question?: string;
  faq3Answer?: string;
  faq4Question?: string;
  faq4Answer?: string;
}

// Default FAQ items
const defaultFaqs = [
  {
    number: "1",
    question: "How to place an order?",
    answer:
      "If you're wondering how to place an order, we've got you covered. Our user-friendly platform makes ordering dental supplies a breeze. Simply browse our catalog, select the items you need, and proceed to checkout.",
  },
  {
    number: "2",
    question: "Payment & Shipping",
    answer:
      "When it comes to payment and shipping, we aim to provide a seamless experience. We offer various secure payment options and reliable shipping services to ensure your orders are delivered safely and on time.",
  },
  {
    number: "3",
    question: "Secure Ordering & Payment Options",
    answer:
      "Rest assured, your security is our priority. We have implemented robust measures for secure ordering and offer multiple payment options, giving you the flexibility and peace of mind while making transactions.",
  },
  {
    number: "4",
    question: "Returns & Refunds",
    answer:
      "We understand that returns and refunds are part of the purchasing process. Our dedicated team is here to guide you through the process and ensure that you have a hassle-free experience in case you need to return or seek a refund for any products.",
  },
];

const FaqSection: React.FC<FaqSectionProps> = (props) => {
  const {
    sectionTitle = "FAQ",
    faq1Question,
    faq1Answer,
    faq2Question,
    faq2Answer,
    faq3Question,
    faq3Answer,
    faq4Question,
    faq4Answer,
  } = props;

  // Build FAQs from props or use defaults
  const faqs = [
    {
      number: "1",
      question: faq1Question || defaultFaqs[0].question,
      answer: faq1Answer || defaultFaqs[0].answer,
    },
    {
      number: "2",
      question: faq2Question || defaultFaqs[1].question,
      answer: faq2Answer || defaultFaqs[1].answer,
    },
    {
      number: "3",
      question: faq3Question || defaultFaqs[2].question,
      answer: faq3Answer || defaultFaqs[2].answer,
    },
    {
      number: "4",
      question: faq4Question || defaultFaqs[3].question,
      answer: faq4Answer || defaultFaqs[3].answer,
    },
  ];

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-30%" });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" ref={sectionRef} className="faq-section horizontal-section">
      <style jsx global>{`
        .faq-section {
          display: flex;
          min-height: 100vh;
          height: 100vh;
          min-width: 100vw;
          width: 100vw;
          flex-shrink: 0;
          flex-direction: column;
          padding: 4rem 1.5rem 1.5rem;
          overflow: hidden;
        }
        @media (min-width: 640px) {
          .faq-section {
            padding: 5rem 2rem 1.5rem;
            overflow-y: auto;
          }
        }
        @media (min-width: 768px) {
          .faq-section {
            padding: 6rem 4rem 2rem;
            overflow-y: auto;
          }
        }
        @media (min-width: 1024px) {
          .faq-section {
            padding: 8rem 5rem 2rem;
            overflow: hidden;
          }
        }

        .faq-title {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: clamp(1.875rem, 5vw, 3.75rem);
          font-weight: 300;
          line-height: 1;
          letter-spacing: -0.02em;
          color: white;
          margin: 0 0 1rem 0;
          white-space: nowrap;
        }
        @media (min-width: 640px) {
          .faq-title {
            margin-bottom: 1.5rem;
          }
        }
        @media (min-width: 768px) {
          .faq-title {
            margin-bottom: 2rem;
          }
        }

        .faq-list {
          flex: 1;
          overflow-y: auto;
          padding-right: 0.5rem;
          scrollbar-width: thin;
          max-height: calc(100vh - 10rem);
          width: 100%;
          min-height: 0;
        }
        @media (min-width: 640px) {
          .faq-list {
            max-height: calc(100vh - 8rem);
          }
        }
        @media (min-width: 1024px) {
          .faq-list {
            max-height: none;
          }
        }

        .faq-item {
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          transition: border-color 0.3s ease;
        }
        .faq-item:hover {
          border-color: rgba(255, 255, 255, 0.2);
        }

        .faq-button {
          display: flex;
          width: 100%;
          align-items: center;
          gap: 0.75rem;
          padding: 1.25rem 0;
          text-align: left;
          background: none;
          border: none;
          cursor: pointer;
          min-height: 60px;
        }
        @media (min-width: 640px) {
          .faq-button {
            gap: 1rem;
            padding: 1.5rem 0;
          }
        }
        @media (min-width: 768px) {
          .faq-button {
            gap: 1.5rem;
            padding: 2rem 0;
          }
        }

        .faq-number {
          display: flex;
          width: 2.5rem;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          font-family: "Inter", sans-serif;
          font-size: 1.875rem;
          font-weight: 300;
          color: rgba(255, 255, 255, 0.4);
          transition: color 0.3s ease;
        }
        .faq-item:hover .faq-number {
          color: rgba(255, 255, 255, 0.6);
        }
        @media (min-width: 640px) {
          .faq-number {
            width: 3rem;
            font-size: 2.25rem;
          }
        }
        @media (min-width: 768px) {
          .faq-number {
            width: 4rem;
            font-size: 3rem;
          }
        }

        .faq-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-width: 0;
        }

        .faq-question {
          font-family: "Inter", sans-serif;
          font-size: 1.125rem;
          font-weight: 500;
          color: white;
          margin: 0;
          transition: color 0.3s ease;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .faq-item:hover .faq-question {
          color: rgba(255, 255, 255, 0.8);
        }
        @media (min-width: 640px) {
          .faq-question {
            font-size: 1.25rem;
          }
        }
        @media (min-width: 768px) {
          .faq-question {
            font-size: 1.5rem;
          }
        }
        @media (min-width: 1024px) {
          .faq-question {
            font-size: 1.875rem;
          }
        }

        .faq-answer-wrapper {
          overflow: hidden;
          transition: all 0.5s ease;
        }
        .faq-answer-wrapper.closed {
          max-height: 0;
          opacity: 0;
        }
        .faq-answer-wrapper.open {
          max-height: 24rem;
          opacity: 1;
          margin-top: 0.5rem;
        }
        @media (min-width: 640px) {
          .faq-answer-wrapper.open {
            margin-top: 0.75rem;
          }
        }

        .faq-answer {
          font-family: "Inter", sans-serif;
          font-size: 0.875rem;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
        }
        @media (min-width: 640px) {
          .faq-answer {
            font-size: 1rem;
          }
        }
        @media (min-width: 768px) {
          .faq-answer {
            font-size: 1.125rem;
          }
        }

        .faq-icon {
          display: flex;
          flex-shrink: 0;
          align-items: center;
          justify-content: flex-end;
          transition: transform 0.3s ease;
        }

        .faq-icon svg {
          color: rgba(255, 255, 255, 0.4);
          transition: color 0.3s ease;
        }
        .faq-item:hover .faq-icon svg {
          color: rgba(255, 255, 255, 0.6);
        }
      `}</style>

      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Title */}
        <motion.h2
          className="faq-title"
          initial={{ opacity: 0, y: 8, filter: "blur(8px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {sectionTitle}
        </motion.h2>

        {/* FAQ List */}
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="faq-item"
              initial={{ opacity: 0, y: 8, filter: "blur(8px)" }}
              animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ duration: 0.7, ease: "easeOut", delay: index * 0.1 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="faq-button"
              >
                <div className="faq-number">{faq.number}</div>

                <div className="faq-content">
                  <h3 className="faq-question">{faq.question}</h3>

                  <div
                    className={`faq-answer-wrapper ${openIndex === index ? "open" : "closed"}`}
                  >
                    <p className="faq-answer">{faq.answer}</p>
                  </div>
                </div>

                <div
                  className="faq-icon"
                  style={{
                    transform: openIndex === index ? "rotate(45deg)" : "rotate(0deg)",
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 5V19M5 12H19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default observer(FaqSection);
