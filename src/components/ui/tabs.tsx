"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const TabsContext = React.createContext<{
    value: string;
    onValueChange: (value: string) => void;
} | null>(null);

function Tabs({
    defaultValue,
    value,
    onValueChange,
    children,
    className,
    ...props
}: {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    children: React.ReactNode;
    className?: string; // Add className prop
    [key: string]: any; // Allow other props
}) {
    const [internalValue, setInternalValue] = React.useState(defaultValue || "");

    const ctxValue = {
        value: value !== undefined ? value : internalValue,
        onValueChange: onValueChange || setInternalValue
    };

    return (
        <TabsContext.Provider value={ctxValue}>
            <div className={cn("", className)} {...props}>
                {children}
            </div>
        </TabsContext.Provider>
    );
}

const TabsList = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
            className
        )}
        {...props}
    />
))
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }
>(({ className, value, ...props }, ref) => {
    const ctx = React.useContext(TabsContext);
    const isSelected = ctx?.value === value;

    return (
        <button
            ref={ref}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => ctx?.onValueChange(value)}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                isSelected && "bg-background text-foreground shadow-sm",
                className
            )}
            {...props}
        />
    );
})
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, children, ...props }, ref) => {
    const ctx = React.useContext(TabsContext);
    if (ctx?.value !== value) return null;

    return (
        <div
            ref={ref}
            role="tabpanel"
            className={cn(
                "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
})
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
