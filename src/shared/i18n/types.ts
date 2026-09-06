/**
 * @file types.ts
 * @description Type definitions for trilingual internationalization (English, German, French)
 * covering all static and dynamic components, navigation, forms, and pages.
 * @module shared/i18n
 */

export type SupportedLanguage = "en" | "de" | "fr";

export interface TranslationSchema {
  common: {
    languageName: string;
    close: string;
    loading: string;
    error: string;
    back: string;
  };
  nav: {
    brandTitle: string;
    brandSubtitle: string;
    festival: string;
    about: string;
    committee: string;
    gallery: string;
    membership: string;
    supporters: string;
    admin: string;
    registerFree: string;
    backToFestival: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    titleTo: string;
    titleEm: string;
    intro: string;
    reserveCta: string;
    freeNote: string;
    affiliatedTo: string;
    cricketSwitzerland: string;
  };
  eventStrip: {
    dateLabel: string;
    dateValue: string;
    startLabel: string;
    startValue: string;
    venueLabel: string;
    venueValue: string;
    entryLabel: string;
    entryValue: string;
  };
  festival: {
    dateKicker: string;
    title: string;
    subtitle: string;
    titleEm: string;
    lead: string;
    body: string;
    audiences: {
      children: string;
      adults: string;
      families: string;
      beginners: string;
    };
  };
  purpose: {
    kicker: string;
    title: string;
    body: string;
    values: {
      community: string;
      development: string;
      belonging: string;
    };
  };
  membership: {
    kicker: string;
    title: string;
    titleEm: string;
    intro: string;
    adult: string;
    adultPrice: string;
    family: string;
    familyPrice: string;
    junior: string;
    juniorPrice: string;
    perYear: string;
    benefitsHeading: string;
    benefit1: string;
    benefit2: string;
    benefit3: string;
    benefit4: string;
    contactNote: string;
    applyButton: string;
  };
  supporters: {
    kicker: string;
    title: string;
    titleEm: string;
    lead: string;
    body: string;
    foundingSponsors: string;
    communityDonors: string;
    becomeSponsor: string;
    becomeSponsorDesc: string;
    makeDonation: string;
    makeDonationDesc: string;
    contactNote: string;
  };
  registration: {
    kicker: string;
    title: string;
    titleEm: string;
    subtitle: string;
    eventDate: string;
    eventTimeVenue: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    typeLabel: string;
    typeSelect: string;
    typeIndividual: string;
    typeFamily: string;
    typeChild: string;
    typeGroup: string;
    partySizeLabel: string;
    notesLabel: string;
    optional: string;
    notesPlaceholder: string;
    submitBtn: string;
    submittingBtn: string;
    successTitle: string;
    successMsg: string;
    registerAnother: string;
    validationNameRequired: string;
    validationEmailRequired: string;
    validationEmailInvalid: string;
    validationPhoneRequired: string;
    validationPhoneInvalid: string;
    validationPartySize: string;
    toastSuccessTitle: string;
    toastSuccessDesc: string;
    toastErrorTitle: string;
    toastErrorDesc: string;
  };
  footer: {
    brandTagline: string;
    aboutUs: string;
    committee: string;
    membership: string;
    adminPortal: string;
    affiliated: string;
    copyright: string;
    legalNotice: string;
    allRightsReserved: string;
    privacyPolicy: string;
    termsConditions: string;
    cookiePolicy: string;
    cookieSettings: string;
    poweredBy: string;
  };
  cookieConsent: {
    title: string;
    description: string;
    acceptAll: string;
    essentialOnly: string;
    learnMore: string;
  };
  legal: {
    privacyTitle: string;
    privacyKicker: string;
    privacySubtitle: string;
    termsTitle: string;
    termsKicker: string;
    termsSubtitle: string;
    cookiesTitle: string;
    cookiesKicker: string;
    cookiesSubtitle: string;
    lastUpdated: string;
    backToHome: string;
    tableOfContents: string;
  };
  aboutPage: {
    kicker: string;
    title: string;
    titleEm: string;
    intro: string;
    bornInGstaad: string;
    founderHeading: string;
    founderBio: string;
    visionHeading: string;
    visionText: string;
  };
  committeePage: {
    kicker: string;
    title: string;
    titleEm: string;
    intro: string;
  };
  galleryPage: {
    kicker: string;
    title: string;
    titleEm: string;
    intro: string;
  };
  contactPage: {
    kicker: string;
    title: string;
    titleEm: string;
    intro: string;
    sendBtn: string;
    sendingBtn: string;
    successMsg: string;
  };
  admin: {
    portalTitle: string;
    portalSubtitle: string;
    roleSelector: string;
    roleAdmin: string;
    roleAdminDesc: string;
    roleManager: string;
    roleManagerDesc: string;
    roleStaff: string;
    roleStaffDesc: string;
    quickDemoLogin: string;
    emailLabel: string;
    passwordLabel: string;
    loginBtn: string;
    signingInBtn: string;
    signOut: string;
    activeRole: string;
    dashboard: string;
    registrations: string;
    members: string;
    events: string;
    inquiries: string;
    auditLogs: string;
    settings: string;
    exportCsv: string;
    newMember: string;
  };
}
