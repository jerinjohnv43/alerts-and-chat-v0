
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple authentication check
    if (username === 'admin' && password === 'password') {
      setTimeout(() => {
        onLogin();
        toast({
          title: "Login Successful",
          description: "Welcome to BI Admin Portal",
        });
        setIsLoading(false);
      }, 1000);
    } else {
      setTimeout(() => {
        toast({
          title: "Login Failed",
          description: "Invalid username or password. Default is admin/password",
          variant: "destructive",
        });
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleMicrosoftLogin = () => {
    setIsLoading(true);
    // Simulate Microsoft OAuth login
    setTimeout(() => {
      onLogin();
      toast({
        title: "Microsoft Login Successful",
        description: "Welcome to BI Admin Portal",
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
              BI
            </div>
          </div>
          <CardTitle className="text-2xl">BI Admin Portal</CardTitle>
          <CardDescription>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username (default: admin)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password (default: password)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleMicrosoftLogin}
            disabled={isLoading}
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path fill="#f25022" d="M11.4 11.4H0V0h11.4v11.4z"/>
              <path fill="#00a4ef" d="M24 11.4H12.6V0H24v11.4z"/>
              <path fill="#7fba00" d="M11.4 24H0V12.6h11.4V24z"/>
              <path fill="#ffb900" d="M24 24H12.6V12.6H24V24z"/>
            </svg>
            Continue with Microsoft
          </Button>
          
          <p className="text-sm text-center text-muted-foreground">
            Default credentials: admin / password
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
