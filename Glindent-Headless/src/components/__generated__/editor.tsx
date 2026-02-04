import dynamic from "next/dynamic";
import { IkasEditorComponentLoader } from "@ikas/storefront";


const Component0 = dynamic(() => import("../start"), { loading: () => <IkasEditorComponentLoader /> });
const Component1 = dynamic(() => import("../hero-banner"), { loading: () => <IkasEditorComponentLoader /> });
const Component2 = dynamic(() => import("../header"), { loading: () => <IkasEditorComponentLoader /> });
const Component3 = dynamic(() => import("../about-section"), { loading: () => <IkasEditorComponentLoader /> });
const Component4 = dynamic(() => import("../contact-section"), { loading: () => <IkasEditorComponentLoader /> });
const Component5 = dynamic(() => import("../faq-section"), { loading: () => <IkasEditorComponentLoader /> });
const Component6 = dynamic(() => import("../products-section"), { loading: () => <IkasEditorComponentLoader /> });
const Component7 = dynamic(() => import("../cart-items"), { loading: () => <IkasEditorComponentLoader /> });
const Component8 = dynamic(() => import("../cart-summary"), { loading: () => <IkasEditorComponentLoader /> });
const Component9 = dynamic(() => import("../auth-register"), { loading: () => <IkasEditorComponentLoader /> });
const Component10 = dynamic(() => import("../auth-login"), { loading: () => <IkasEditorComponentLoader /> });
const Component11 = dynamic(() => import("../auth-account"), { loading: () => <IkasEditorComponentLoader /> });
const Component12 = dynamic(() => import("../auth-orders"), { loading: () => <IkasEditorComponentLoader /> });
const Component13 = dynamic(() => import("../auth-order-detail"), { loading: () => <IkasEditorComponentLoader /> });
const Component14 = dynamic(() => import("../auth-addresses"), { loading: () => <IkasEditorComponentLoader /> });
const Component15 = dynamic(() => import("../not-found"), { loading: () => <IkasEditorComponentLoader /> });
const Component16 = dynamic(() => import("../welcome-modal"), { loading: () => <IkasEditorComponentLoader /> });


const Components = {
  "28626d46-97f8-45e7-9c25-dcb16d618676": Component0,"b35a386d-ae92-4608-a0bb-d29748376ad2": Component1,"ce31f1cc-8f36-4169-865b-ffe3b9cd0fed": Component2,"07d15590-9fce-45bc-86d8-c39e1b09bd31": Component3,"eac50981-e3ef-4272-b9dd-69aad05bc054": Component4,"60f10bf8-fbe7-4d90-912c-60bccd3a5114": Component5,"b58c2009-a8a0-4762-bff7-af019055108f": Component6,"e46909d9-52ad-47ec-ab8d-5397c2b7896c": Component7,"a67b00a5-0b32-408a-983d-02862e86a70d": Component8,"b1d594c3-017a-43d0-8028-e52dd3ce08fe": Component9,"c5785904-1d84-4e3d-9ede-450db81b0fbf": Component10,"7937d186-4506-4713-8880-b9ff77bc7b69": Component11,"fb0e1994-d3b9-4e15-a6de-769ce9c43110": Component12,"51be4c16-bbda-47c3-808d-663c4550cb59": Component13,"5f3700a9-2416-467e-a725-1ce58d5d52dc": Component14,"60941be8-8976-4456-bae9-3d262e436c85": Component15,"9c66d634-e046-4fb1-a66e-86681f026f6e": Component16
};

export default Components;