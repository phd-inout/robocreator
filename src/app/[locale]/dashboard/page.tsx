
import { UserButton } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Plus, FolderOpen } from "lucide-react";

export default function DashboardPage() {
    const t = useTranslations("EditorPage"); // Reuse or create new namespace

    return (
        <div className="min-h-screen bg-muted/20">
            {/* Top Bar */}
            <header className="bg-background border-b px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold">Robo-Creator</span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Beta</span>
                </div>
                <UserButton />
            </header>

            <main className="container mx-auto py-12 px-4">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">My Projects</h1>
                    <Link href="/editor">
                        <Button className="gap-2">
                            <Plus size={16} />
                            New Project
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Empty State Placeholder */}
                    <Card className="border-dashed flex flex-col items-center justify-center p-12 text-center h-64 bg-transparent hover:bg-muted/50 transition-colors cursor-pointer group">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                            <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
                        </div>
                        <h3 className="font-semibold text-lg">Create new design</h3>
                        <p className="text-muted-foreground text-sm mt-1">Start from scratch</p>
                    </Card>

                    {/* Example Project Card */}
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <div className="aspect-video bg-slate-100 relative overflow-hidden group">
                            {/* Placeholder for project thumbnail */}
                            <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-400">
                                <FolderOpen size={48} />
                            </div>
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button variant="secondary" size="sm">Open Editor</Button>
                            </div>
                        </div>
                        <CardHeader>
                            <CardTitle>Mars Rover V2</CardTitle>
                            <CardDescription>Last edited 2 days ago</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2">
                                <span className="text-xs bg-slate-100 px-2 py-1 rounded">Chassis: Generic</span>
                                <span className="text-xs bg-slate-100 px-2 py-1 rounded">Parts: 5</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
