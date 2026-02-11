"use client";

import { useTranslations, useLocale } from "next-intl";
import { FileText, Globe, Upload } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function TopNavBar() {
    const t = useTranslations("EditorPage");
    const locale = useLocale();

    return (
        <header className="h-14 bg-background border-b flex items-center justify-between px-6 shadow-sm">
            {/* Left - Logo & Breadcrumb */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-sm">R</span>
                    </div>
                    <span className="font-bold text-foreground">Robo-Creator</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Button variant="link" className="p-0 h-auto font-normal text-muted-foreground hover:text-primary" asChild>
                        <Link href={`/${locale}`}>
                            {t("projects")}
                        </Link>
                    </Button>
                    <span>/</span>
                    <span className="text-muted-foreground/50">{t("current_project")}</span>
                    <span>/</span>
                    <span className="font-medium text-foreground">{t("main_assembly")}</span>
                </div>
            </div>

            {/* Center - Auto-save Status */}
            <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-muted-foreground">{t("auto_saved")}</span>
            </div>

            {/* Right - Actions */}
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" className="gap-2">
                    <Globe size={16} />
                    <span>{locale === "zh" ? "中文" : "English"}</span>
                </Button>

                <Button size="sm" className="gap-2">
                    <Upload size={16} />
                    {t("export")}
                </Button>

                <Separator orientation="vertical" className="h-6" />

                <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity">
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
            </div>
        </header>
    );
}
