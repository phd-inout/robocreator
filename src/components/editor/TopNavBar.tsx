"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { UserButton } from "@clerk/nextjs";
import { Box, Globe, Download, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function TopNavBar() {
    const t = useTranslations("EditorPage");
    const tHome = useTranslations("HomePage");
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const toggleLanguage = () => {
        const nextLocale = locale === "en" ? "zh" : "en";
        router.replace(pathname, { locale: nextLocale });
    };

    return (
        <header className="h-16 border-b bg-background flex items-center justify-between px-4 shadow-sm z-30 relative">
            {/* Left: Logo & Breadcrumb */}
            <div className="flex items-center gap-6">
                <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-primary hover:opacity-80 transition-opacity">
                    <div className="bg-primary text-primary-foreground p-1 rounded">
                        <Box size={20} />
                    </div>
                    <span>Robo-Creator</span>
                </Link>

                <div className="h-6 w-px bg-border" />

                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard">Projects</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard">Mars Rover V2</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="font-semibold">Main Assembly</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-3">
                <Badge variant="secondary" className="gap-1.5 py-1.5 px-3 bg-green-50 text-green-700 hover:bg-green-100 border-green-200">
                    <CheckCircle2 size={14} />
                    {t("auto_saved")}
                </Badge>

                <div className="h-6 w-px bg-border mx-1" />

                <Button variant="ghost" size="sm" onClick={toggleLanguage} className="gap-2">
                    <Globe size={16} />
                    {locale === "en" ? "English" : "中文"}
                </Button>

                <Button variant="default" size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700">
                    <Download size={16} />
                    {t("export")}
                </Button>

                <div className="ml-2">
                    <UserButton afterSignOutUrl="/" />
                </div>
            </div>
        </header>
    );
}
