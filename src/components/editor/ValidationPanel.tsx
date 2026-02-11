import { useTranslations } from "next-intl";
import { CheckCircle2, AlertCircle, RotateCcw, FileText } from "lucide-react";
import { useDesignStore } from "@/store/useDesignStore";
import { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function ValidationPanel() {
    const t = useTranslations("EditorPage");
    const { parts } = useDesignStore();

    // Calculate total weight and cost
    const stats = useMemo(() => {
        const totalWeight = parts.reduce((sum, part) => sum + (part.specs.weight || 0), 0);
        const totalCost = parts.reduce((sum, part) => {
            return sum + (part.price || 0);
        }, 0);

        return {
            weight: totalWeight.toFixed(2),
            cost: totalCost,
            partCount: parts.length,
        };
    }, [parts]);

    // Mock validation status
    const isValid = true;

    return (
        <ScrollArea className="h-full">
            <div className="flex flex-col gap-4 p-4">
                {/* Validation Status */}
                <Card className={cn(
                    "border-l-4",
                    isValid ? "border-l-green-500" : "border-l-red-500"
                )}>
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-bold uppercase tracking-wide">
                                {t("validation_status")}
                            </CardTitle>
                            <Button variant="ghost" size="sm" className="h-8 gap-1 text-blue-600">
                                <RotateCcw size={14} />
                                {t("re_run")}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="flex items-start gap-4">
                            {isValid ? (
                                <CheckCircle2 className="text-green-600 mt-1" size={24} />
                            ) : (
                                <AlertCircle className="text-red-600 mt-1" size={24} />
                            )}
                            <div>
                                <h4 className={cn("font-medium", isValid ? "text-green-700" : "text-red-700")}>
                                    {isValid ? t("physics_check_passed") : t("physics_check_failed")}
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {isValid ? t("model_stable") : t("model_unstable")}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Performance Radar Chart Placeholder */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            {t("performance_metrics")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="aspect-square bg-muted/30 rounded-lg flex items-center justify-center p-4">
                            <div className="text-center text-muted-foreground w-full h-full flex items-center justify-center">
                                <svg className="w-full h-full max-w-[200px] max-h-[200px]" viewBox="0 0 200 200">
                                    {/* Pentagon radar chart */}
                                    <polygon
                                        points="100,20 180,70 150,160 50,160 20,70"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeOpacity="0.2"
                                        strokeWidth="1"
                                    />
                                    <polygon
                                        points="100,40 160,75 140,140 60,140 40,75"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeOpacity="0.2"
                                        strokeWidth="1"
                                    />

                                    {/* Data polygon */}
                                    <polygon
                                        points="100,30 170,72 145,150 55,150 30,72"
                                        fill="currentColor"
                                        fillOpacity="0.1"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="text-blue-500"
                                    />

                                    {/* Axis lines */}
                                    <line x1="100" y1="100" x2="100" y2="20" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
                                    <line x1="100" y1="100" x2="180" y2="70" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
                                    <line x1="100" y1="100" x2="150" y2="160" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
                                    <line x1="100" y1="100" x2="50" y2="160" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
                                    <line x1="100" y1="100" x2="20" y2="70" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />

                                    {/* Labels */}
                                    <text x="100" y="15" textAnchor="middle" className="text-[10px] fill-muted-foreground">Payload</text>
                                    <text x="185" y="75" textAnchor="start" className="text-[10px] fill-muted-foreground">Range</text>
                                    <text x="155" y="175" textAnchor="middle" className="text-[10px] fill-muted-foreground">Cost</text>
                                    <text x="45" y="175" textAnchor="middle" className="text-[10px] fill-muted-foreground">AI</text>
                                    <text x="10" y="75" textAnchor="end" className="text-[10px] fill-muted-foreground">Durability</text>
                                </svg>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Design Summary */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            {t("design_summary")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-muted-foreground">{t("total_weight")}</span>
                                <span className="font-medium">{stats.weight} kg</span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary rounded-full transition-all"
                                    style={{ width: `${Math.min((parseFloat(stats.weight) / 100) * 100, 100)}%` }}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-muted-foreground">{t("estimated_cost")}</span>
                                <span className="font-medium">¥{stats.cost.toLocaleString()}</span>
                            </div>
                            <Separator className="mt-2" />
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{t("part_count")}</span>
                            <Badge variant="secondary">{stats.partCount}</Badge>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" className="w-full gap-2">
                            <FileText size={16} />
                            {t("view_datasheet")}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </ScrollArea>
    );
}
