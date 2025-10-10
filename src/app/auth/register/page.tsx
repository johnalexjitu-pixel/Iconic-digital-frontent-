"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Modal } from '@/components/ui/modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, UserPlus, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    gender: '',
    referralCode: '',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.acceptTerms) {
      setError('You must accept the Terms and Conditions to continue');
      setLoading(false);
      return;
    }

    if (!formData.phoneNumber) {
      setError('Phone number is required');
      setLoading(false);
      return;
    }

    if (!formData.gender) {
      setError('Please select your gender');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          phoneNumber: formData.phoneNumber,
          gender: formData.gender,
          referralCode: formData.referralCode
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Registration successful, redirect to contact support for verification
        router.push('/contact-support?message=Registration successful! Please contact support for account verification.');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-teal-600 hover:text-teal-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <Card className="p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Sign Up</h1>
            <p className="text-gray-600 mt-2">Join Iconic Digital and start earning</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
              />
            </div>

            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="h-10 px-3 border border-gray-300 border-r-0 rounded-l-md bg-gray-50 flex items-center text-sm text-gray-500">
                    +880
                  </div>
                </div>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="rounded-l-none"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => handleSelectChange('gender', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
              />
            </div>

            <div>
              <Label htmlFor="referralCode">Referral Code (Optional)</Label>
              <Input
                id="referralCode"
                name="referralCode"
                type="text"
                value={formData.referralCode}
                onChange={handleChange}
                placeholder="Enter referral code"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="acceptTerms"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) => setFormData({ ...formData, acceptTerms: checked as boolean })}
              />
              <Label htmlFor="acceptTerms" className="text-sm text-gray-600">
                I accept the{' '}
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="text-teal-600 hover:text-teal-700 underline"
                >
                  Terms and Conditions
                </button>
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-teal-600 hover:text-teal-700 font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </Card>
      </div>

      {/* Terms and Conditions Modal */}
      <Modal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        title="Terms and Conditions"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Please read our terms and conditions carefully before proceeding.
          </p>
          
          <p className="text-gray-800">
            Welcome to Iconic Digital. By using our services, you agree to the following terms:
          </p>

          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>All products in campaigns are subject to availability.</li>
            <li>Cancellation or return policies vary by suppliers and merchants.</li>
            <li>Payment information is secured using industry-standard encryption.</li>
            <li>You must be at least 18 years old to participate in a campaign.</li>
            <li>Prices are subject to change until the purchase is confirmed.</li>
            <li>We respect your privacy and handle your data in accordance with our privacy policy.</li>
            <li>By creating an account, you agree to receive occasional promotional emails from us.</li>
            <li>You are responsible for providing accurate information during the campaign process.</li>
            <li>Platform reserves the right to modify terms and conditions at any time.</li>
            <li>Violation of terms may result in account suspension or termination.</li>
          </ol>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Contact Information:</h3>
            <p className="text-gray-700 mb-3">• Telegram: t.me/Iconicdigital_customerservice_BD</p>
            <p className="text-gray-700 mb-4">• Service Hours: 10:00 AM to 10:00 PM (Monday - Sunday)</p>
            
            <div className="flex justify-center">
              <Button
                onClick={() => window.open('https://t.me/Iconicdigital_customerservice_BD', '_blank')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"
              >
                <img src="/Telegram_logo.svg.webp" alt="Telegram" className="w-4 h-4" />
                Contact Support
              </Button>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button
              onClick={() => setShowTermsModal(false)}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
