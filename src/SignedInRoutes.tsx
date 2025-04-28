import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
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
      <div className="flex items-center justify-end p-2 gap-x-4 w-screen top-0 h-[50px] border-b border-gray-200 shadow-gray-500 bg-gray-50">
        <Breadcrumb>
          <div className="flex items-center gap-8 px-8">
            {links.map(({ href, label }, index) => (
              <BreadcrumbItem key={index} className="flex items-center">
                {pathname === href ? (
                  <BreadcrumbPage className="font-semibold text-gray-800">
                    {label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={href}
                    className="transition-colors hover:text-gray-600 underline-offset-4 hover:underline"
                  >
                    {label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            ))}
          </div>
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
