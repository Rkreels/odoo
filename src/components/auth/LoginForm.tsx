
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real app, this would connect to a backend
      setTimeout(() => {
        // Simulate login success
        localStorage.setItem('isAuthenticated', 'true');
        toast({
          title: "Login successful",
          description: "Welcome back to OdooEcho!",
        });
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Demo login credentials
  const handleDemoLogin = () => {
    setEmail('demo@example.com');
    setPassword('password');
  };

  return (
    <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-md">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-odoo-dark">Sign in</h2>
        <p className="mt-2 text-odoo-gray">Sign in to your account to continue</p>
      </div>
      
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="odoo-input mt-1"
              placeholder="Email address"
            />
          </div>
          <div>
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
              <Link to="/forgot-password" className="text-sm text-odoo-primary hover:text-odoo-secondary">
                Forgot your password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="odoo-input mt-1"
              placeholder="Password"
            />
          </div>
        </div>

        <div>
          <Button
            type="submit"
            className="w-full bg-odoo-primary hover:bg-odoo-primary/90"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </div>
      </form>

      <div className="text-center mt-4">
        <p className="text-sm text-odoo-gray">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-odoo-primary hover:text-odoo-secondary">
            Sign up
          </Link>
        </p>
      </div>
      
      <div className="mt-4 text-center">
        <button 
          onClick={handleDemoLogin}
          className="text-sm text-odoo-primary hover:text-odoo-secondary"
        >
          Use demo credentials
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
