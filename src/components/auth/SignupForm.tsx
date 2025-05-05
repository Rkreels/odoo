
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

const SignupForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // In a real app, this would connect to a backend
      setTimeout(() => {
        // Simulate signup success
        localStorage.setItem('isAuthenticated', 'true');
        toast({
          title: "Account created",
          description: "Welcome to OdooEcho!",
        });
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      toast({
        title: "Signup failed",
        description: "There was an error creating your account.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-md">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-odoo-dark">Create an account</h2>
        <p className="mt-2 text-odoo-gray">Sign up to start using OdooEcho</p>
      </div>
      
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="odoo-input mt-1"
              placeholder="Full Name"
            />
          </div>
          
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
            <Label htmlFor="company">Company Name</Label>
            <Input
              id="company"
              name="company"
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="odoo-input mt-1"
              placeholder="Company Name (Optional)"
            />
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="odoo-input mt-1"
              placeholder="Create a password"
            />
          </div>
          
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="odoo-input mt-1"
              placeholder="Confirm your password"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="agree"
              checked={agree}
              onCheckedChange={(checked) => setAgree(checked as boolean)}
              required
            />
            <label
              htmlFor="agree"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to the{' '}
              <Link to="/terms" className="text-odoo-primary hover:text-odoo-secondary">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-odoo-primary hover:text-odoo-secondary">
                Privacy Policy
              </Link>
            </label>
          </div>
        </div>

        <div>
          <Button
            type="submit"
            className="w-full bg-odoo-primary hover:bg-odoo-primary/90"
            disabled={loading || !agree}
          >
            {loading ? "Creating account..." : "Sign up"}
          </Button>
        </div>
      </form>

      <div className="text-center mt-4">
        <p className="text-sm text-odoo-gray">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-odoo-primary hover:text-odoo-secondary">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
