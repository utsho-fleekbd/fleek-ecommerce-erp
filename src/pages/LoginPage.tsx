import { z } from "zod";
import { useState } from "react";
import { Eye, EyeClosed, Shield } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

const inputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long."),
});

export default function LoginPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<z.infer<typeof inputSchema>>({
    resolver: zodResolver(inputSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof inputSchema>) => {
    await new Promise((r) => setTimeout(r, 1200));
    await login();
    toast({ title: "Welcome back!", description: "Successfully signed in." });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Super Admin Login
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Sign in to manage your platform
          </p>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form id="login-form" onSubmit={form.handleSubmit(handleSubmit)}>
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="example@email.com"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Password</FieldLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        area-invalid={fieldState.invalid}
                        placeholder="********"
                      />
                      <Button
                        type="button"
                        className="absolute right-0 top-1/2 -translate-y-1/2 rounded-none rounded-r z-10"
                        onClick={() => setShowPassword((it) => !it)}
                      >
                        {showPassword ? <EyeClosed /> : <Eye />}
                      </Button>
                    </div>
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm font-normal">
                Remember me
              </Label>
            </div>
            <button
              type="button"
              className="text-sm text-primary hover:underline"
              onClick={() =>
                toast({
                  title: "Password Reset",
                  description: "Reset link sent to your email.",
                })
              }
            >
              Forgot password?
            </button>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            form="login-form"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
