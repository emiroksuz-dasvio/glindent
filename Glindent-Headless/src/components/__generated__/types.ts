import {
	IkasImage,
	IkasNavigationLink,
	IkasProductList,
} from "@ikas/storefront"

export type HeroBannerProps = {
	slide1Badge?: string;
	slide1Title?: string;
	slide1Description?: string;
	slide1Image?: IkasImage;
	slide2Badge?: string;
	slide2Title?: string;
	slide2Description?: string;
	slide2Image?: IkasImage;
	slide3Badge?: string;
	slide3Title?: string;
	slide3Description?: string;
	slide3Image?: IkasImage;
};

export type HeaderProps = {
	logo?: IkasImage;
	navigationLinks?: IkasNavigationLink[];
};

export type AboutSectionProps = {
	sectionTitle?: string;
	aboutImage?: IkasImage;
	description1?: string;
	description2?: string;
	stat1Number?: string;
	stat1Label?: string;
	stat1Sublabel?: string;
	stat2Number?: string;
	stat2Label?: string;
	stat2Sublabel?: string;
	stat3Number?: string;
	stat3Label?: string;
	stat3Sublabel?: string;
	primaryButtonText?: string;
	secondaryButtonText?: string;
};

export type ContactSectionProps = {
	sectionTitle?: string;
	sectionSubtitle?: string;
	email?: string;
	phone1?: string;
	phone2?: string;
	addressLine1?: string;
	addressLine2?: string;
	contactCardTitle?: string;
	formCardTitle?: string;
	submitButtonText?: string;
	twitterUrl?: string;
	instagramUrl?: string;
	linkedinUrl?: string;
	dribbbleUrl?: string;
};

export type FaqSectionProps = {
	sectionTitle?: string;
	faq1Question?: string;
	faq1Answer?: string;
	faq2Question?: string;
	faq2Answer?: string;
	faq3Question?: string;
	faq3Answer?: string;
	faq4Question?: string;
	faq4Answer?: string;
};

export type ProductsSectionProps = {
	productList?: IkasProductList;
};

export type NotFoundProps = {
	title?: string;
	description?: string;
	showSearch?: boolean;
	showSuggestions?: boolean;
	homeButtonText?: string;
	backButtonText?: string;
	searchPlaceholder?: string;
};

export type WelcomeModalProps = {
	videoUrl: string;
	videoMp4Url?: string;
	videoWebmUrl?: string;
	videoOgvUrl?: string;
	title?: string;
	subtitle?: string;
	enableAutoplay?: boolean;
	showOnlyFirstVisit?: boolean;
};

