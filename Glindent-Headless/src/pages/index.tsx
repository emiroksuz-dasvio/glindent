import { observer } from "mobx-react-lite";
import { HorizontalLayout } from "src/components/horizontal-layout";
import Header from "src/components/header";
import HeroBanner from "src/components/hero-banner";
import AboutSection from "src/components/about-section";
import ProductsSection from "src/components/products-section";
import FaqSection from "src/components/faq-section";
import ContactSection from "src/components/contact-section";

const HomePage: React.FC = () => {
  return (
    <HorizontalLayout header={<Header />}>
      <HeroBanner />
      <AboutSection />
      <ProductsSection />
      <FaqSection />
      <ContactSection />
    </HorizontalLayout>
  );
};

export default observer(HomePage);
