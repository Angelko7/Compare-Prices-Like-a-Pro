import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md text-center border-none shadow-xl">
        <CardContent className="pt-6 space-y-4">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-16 w-16 text-rose-500 opacity-80" />
          </div>
          <h1 className="text-3xl font-bold font-display text-gray-900">404 Page Not Found</h1>
          <p className="text-gray-500 mt-2">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <div className="pt-6">
            <Link href="/">
              <Button className="w-full btn-primary">
                Return Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
