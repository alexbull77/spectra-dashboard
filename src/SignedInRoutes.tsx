import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "./components/ui/breadcrumb";
import { UserButton } from "@clerk/clerk-react";
import { Route, Routes, useLocation } from "react-router-dom";
import { SessionDetail } from "./modules/sessions/pages/SessionDetail";
import { SessionIndex } from "./modules/sessions/pages/SessionIndex";
import { Toaster } from "sonner";
import { SettingsIndex } from "./modules/settings/SettingsIndex";
import { useUpsertUser } from "./useUpserUser";

const links = [
  {
    href: "/",
    label: "Sessions",
  },
  {
    href: "/settings",
    label: "Settings",
  },
];

export const SignedInRoutes = () => {
  const { pathname } = useLocation();
  useUpsertUser();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex items-center justify-end p-2 gap-x-4 w-screen top-0 h-10 border-b border-gray-200 shadow-gray-500 bg-gray-50">
        <Breadcrumb>
          <BreadcrumbList className="gap-x-4">
            {links.map(({ href, label }, index) => (
              <BreadcrumbItem key={index}>
                {pathname === href ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href} className="underline">
                    {label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <UserButton />
      </div>

      <Routes>
        <Route path="/" element={<SessionIndex />} />
        <Route path="/sessions/:sessionId" element={<SessionDetail />} />
        <Route path="/settings" element={<SettingsIndex />} />
      </Routes>
      <Toaster />
    </QueryClientProvider>
  );
};
