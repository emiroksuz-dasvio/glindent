import { CartPage as CartPageNext } from "@ikas/storefront-next";
import CartPageComponent from "src/components/cart-page";

const Page = (props: any) => {
  return <CartPageComponent {...props} />;
};

export default Page;
export const getStaticProps = CartPageNext.getStaticProps;
