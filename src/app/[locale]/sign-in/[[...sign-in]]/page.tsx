
import { SignIn } from "@clerk/nextjs";
import { useTranslations } from "next-intl";

export default function SignInPage() {
    const t = useTranslations("HomePage"); // Fallback to HomePage namespace or create Auth if needed

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-muted/20 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 flex flex-col items-center">
                <div className="text-center">
                    <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
                        Robo-Creator
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {t("description")}
                    </p>
                </div>

                <SignIn
                    appearance={{
                        elements: {
                            formButtonPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90',
                            card: 'shadow-lg border bg-card'
                        }
                    }}
                />
            </div>
        </div>
    );
}
