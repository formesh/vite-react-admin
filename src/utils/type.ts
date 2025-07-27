import type { ComponentType } from "react";
import type { RouteObject } from "react-router";

export type AppRouteObject = RouteObject & {
  meta?: {
    title?: string;
    requiresAuth?: boolean;
    roles?: string[];
    icon?: ComponentType<any>;
    hideInMenu?: boolean;
  };
  children?: AppRouteObject[];
}