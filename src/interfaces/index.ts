export interface Route {
  name: string;
  path: string;
}

export interface FooterProps {
  brandName?: string;
  brandLink?: string;
  routes?: Array<{
    name: string;
    path: string;
  }>;
}

export interface RouteConfig {
  layout: string;
  pages: Array<{
    path: string;
    element: React.ReactNode;
  }>;
}

export interface DecodedToken {
  id: number;
  uemail: string;
  role: number;
  iat: number;
  exp: number;
  package: string | number;
  firstname: string;
  is_email_verified: number;
  imageurl: string;
}
