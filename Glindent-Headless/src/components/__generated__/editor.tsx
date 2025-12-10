import dynamic from "next/dynamic";
import { IkasEditorComponentLoader } from "@ikas/storefront";


const Component0 = dynamic(() => import("../start"), { loading: () => <IkasEditorComponentLoader /> });
const Component1 = dynamic(() => import("../hero-banner"), { loading: () => <IkasEditorComponentLoader /> });
const Component2 = dynamic(() => import("../header"), { loading: () => <IkasEditorComponentLoader /> });
const Component3 = dynamic(() => import("../about-section"), { loading: () => <IkasEditorComponentLoader /> });
const Component4 = dynamic(() => import("../contact-section"), { loading: () => <IkasEditorComponentLoader /> });
const Component5 = dynamic(() => import("../faq-section"), { loading: () => <IkasEditorComponentLoader /> });
const Component6 = dynamic(() => import("../products-section"), { loading: () => <IkasEditorComponentLoader /> });
const Component7 = dynamic(() => import("../footer"), { loading: () => <IkasEditorComponentLoader /> });


const Components = {
  "28626d46-97f8-45e7-9c25-dcb16d618676": Component0,"b35a386d-ae92-4608-a0bb-d29748376ad2": Component1,"ce31f1cc-8f36-4169-865b-ffe3b9cd0fed": Component2,"07d15590-9fce-45bc-86d8-c39e1b09bd31": Component3,"eac50981-e3ef-4272-b9dd-69aad05bc054": Component4,"60f10bf8-fbe7-4d90-912c-60bccd3a5114": Component5,"b58c2009-a8a0-4762-bff7-af019055108f": Component6,"75916526-d981-4d8c-ac33-b9dc8f9ef047": Component7
};

export default Components;