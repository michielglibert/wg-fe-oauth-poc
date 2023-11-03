export interface CompanyRegistration {
  type: "CBE" | "KVK" | "SIREN" | "SIRET";
  nr: string;
}

export interface Address {
  street: string;
  zipcode: string;
  housenr: string;
  country_code: string;
  boxnr?: number | null;
  city: string;
  lat?: number | null;
  lng?: number | null;
  region?: string;
}

export interface Logos {
  logo: string;
  logo_1024: string;
  logo_512: string;
  logo_256: string;
  logo_128: string;
  logo_fe: string;
  logo_fe_1024: string;
  logo_fe_512: string;
  logo_fe_256: string;
  logo_fe_128: string;
}

export interface Distribution {
  crm?: string | null;
  address: Address;
  admin_distribution: string | null;
  assistant_name: string;
  avatars: {
    assistant_avatar: string;
    assistant_avatar_128: string;
    assistant_avatar_256: string;
    assistant_avatar_512: string;
    assistant_avatar_1024: string;
  };
  cbe: string;
  company_registration: CompanyRegistration;
  claims_email: string;
  complaints_email: string;
  created_at: string;
  email: string;
  fsma: { key: string; statute: string | null };
  afm?: string;
  id: string;
  iban?: string;
  links: Record<string, string>[];
  logos: Logos;
  meeting_link: string;
  modified_at: string;
  name: string;
  phone: string;
  plan: string;
  privacy_page_url: string;
  short_name: string;
  theme: { name: string; primary_color: string; secondary_color: string };
  website: string;
  // Company scan data
  goal: string;
  offer: string;
  intro: string;
}

export interface Module {
  status: string;
  member_of: string;
}

export interface Modules {
  advisory_conversation: Module;
  advisory_reports: Module;
  campaigns: Module;
  contacts: Module;
  contracts: Module;
  claims: Module;
  conversation_history: Module;
  digital_sales_conversation: Module;
  digital_signatures: Module;
  leads: Module;
  offers: Module;
  proflow: Module;
  toolkit: Module;
  risk_analysis: Module;
}

export interface User {
  is_admin: boolean;
  plan: string;
  type: string;
  name: string;
  phone?: string;
  assistant_name: string;
  theme: string;
  crm: string;
  created_at: Date;
  modified_at: Date;
  id: string;
  user_id: string;
  distribution_name: string;
  distribution_id: string;
  email: string;
  links: {
    rel: string;
    href: string;
  }[];
  language: string;
  country_code: string;
  modules: Modules;
  modules_v2: Modules;
}

export interface UserInfo {
  activated: boolean;
  aud: string[];
  auth_time: number;
  bid: string;
  did: string;
  email: string;
  iat: number;
  iss: string;
  language: string;
  last_login: string;
  locale: string;
  name: string | null;
  rat: number;
  role: string;
  sub: string;
  uid: string;
  username: string;
  broker_plan: string;
  modules: Modules;
  origin: string;
  expiration_date: string;
}

export interface UserHMAC {
  hmac: string;
}

export enum CustomerSegmentGoal {
  COMMERCIAL_LINES = "commercial-lines",
  PERSONAL_LINES = "personal-lines",
}

export interface GoalItem {
  titleKey: string;
  illustration: JSX.Element;
  value: CustomerSegmentGoal;
}

export interface UserData {
  activated: boolean;
  amount_of_pending_password_resets: number;
  country: string;
  created_at: Date;
  description: string;
  disabled: boolean;
  email: string;
  expiration_date?: string;
  id: string;
  language: string;
  last_login: Date;
  metadata?: {
    goals?: string[];
    customer_segment?: CustomerSegmentGoal;
    hasVisited?: string[];
  };
  modified_at: Date;
  origin?: string;
  role: string;
  token?: string;
  username: string;
}
export interface Campaign {
  id: string;
  created_at: string;
  type: TYPE | null;
  audience_type: AUDIENCE_TYPE;
  active: boolean;
  insurances: Insurance[];
  name: string;
  display_name?: string;
  extend: EXTEND;
  language: LANGUAGE;
  end_date?: string;
  start_date: string;
  theme: Theme;
  logo?: string | null;
  url: string;
  short_id: string;
  assigned_to: string | null;
  assigned_to_name: string | null;
  created_by: string;
  distribution_id: string;
  google_analytics_tracking_id?: string | null;
  flow_version: FLOW_VERSION;
  specifications: Specifications;
  assistant_name: string;
  assistant_avatar: string | null;
  send_reminders: boolean;
  status: STATUS;
  targets: Target[];
  notifications: string[];
  risk_analysis_subjects?: Subject[];
  code?: number;
  template_id: string; // THIS KEY TEMPORARY
  flow_id: string;
  shared?: boolean;
  template?: Template;
  dns_prefix?: string;
  show_offers?: boolean;
}

export type Subject =
  | "MOBILITY"
  | "HOME_AND_FAMILY"
  | "TRAVEL_AND_LEISURE"
  | "HOBBIES_AND_INTERESTS"
  | "LIFE_AND_FUTURE"
  | "HEALTH"
  | "LEGAL";

export interface Theme {
  name: string;
  primary_color: string;
  secondary_color: string;
}
export interface Insurance {
  insurance_type: string;
  insurance_company: string;
  vk_applied: number;
}

export type InsuranceTypes =
  | "CAR"
  | "RESIDENCE"
  | "FAMILY"
  | "LEGAL"
  | "FUNERAL";

export enum InsuranceTypesIconMeta {
  "CAR" = "GeneralRiskObjectsCar",
  "RESIDENCE" = "GeneralRiskObjectsHome",
  "FAMILY" = "GeneralNavigationFamily",
  "LEGAL" = "GeneralRiskObjectsLegal",
  "FUNERAL" = "GeneralRiskObjectsFuneral",
}
export interface Specifications {
  car_brand_filters: string[];
}

export interface Target {
  conversation_id: string;
  email: string;
  name: string;
  party_id: string;
  risk_object_revision_ids: string[];
  type: "CUSTOMER" | "COMPANY";
  url: string;
}

//
// ─── ENUMS ──────────────────────────────────────────────────────────────────────
//

export enum TYPE {
  EMAIL = "EMAIL",
  WEBSITE = "WEBSITE",
}
export enum AUDIENCE_TYPE {
  BROAD_AUDIENCE = "BROAD_AUDIENCE",
  KNOWN_TARGETS = "KNOWN_TARGETS",
}
export enum EXTEND {
  LEAD = "LEAD",
  INTERNAL_OFFER = "INTERNAL_OFFER",
  EXTERNAL_OFFER = "EXTERNAL_OFFER",
  ONLINE_INSURANCE = "ONLINE_INSURANCE",
  RISK_ANALYSIS = "RISK_ANALYSIS",
}

export enum LANGUAGE {
  FR = "FR",
  NL = "NL",
  EN = "EN",
  "NL-NL" = "NL-NL",
}
export enum FLOW_VERSION {
  V1 = "V1",
  V2 = "V2",
}
export enum FLOW_TYPE {
  lead = "lead",
  quote = "quote",
  offer = "offer",
  contract = "contract",
  risk_analysis = "risk_analysis",
}
export enum STATUS {
  INACTIVE = "INACTIVE",
  ACTIVE = "ACTIVE",
  EXPIRES = "EXPIRES",
  MAILS_SENT = "MAILS_SENT",
  HAS_ENDED = "HAS_ENDED",
}

export enum INSURANCE_TYPE {
  CAR = "CAR",
  FAMILY = "FAMILY",
  RESIDENCE = "RESIDENCE",
  TEACHER = "TEACHER",
  TWO_WHEELER = "TWO_WHEELER",
  LANDLORD = "LANDLORD",
  EBIKE = "EBIKE",
  LEGAL = "LEGAL",
  FUNERAL = "FUNERAL",
  PARTY_GROUP = "PARTY_GROUP",
}

export type Template = {
  id: string;
  name: string;
  description: string;
  flow_id: string;
  flow_type: string;
  flow_title: string;
  tooltip: string;
  extend: EXTEND;
  audience: AUDIENCE_TYPE;
  personalisation: boolean;
  price: number | null;
  href?: string;
  key?: string;
  category: "LEAD_GENERATION" | "CUSTOMER_FOLLOW_UP";
  sharing_option: string;
};
