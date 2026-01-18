import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { SiGoogle, SiApple } from 'react-icons/si';
import { Smartphone, Shield, MapPin, MessageCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface LoginScreenProps {
  onPrivacyClick: () => void;
}

export default function LoginScreen({ onPrivacyClick }: LoginScreenProps) {
  const { login, loginStatus } = useInternetIdentity();
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpStep, setOtpStep] = useState<'phone' | 'verify'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const isLoggingIn = loginStatus === 'logging-in';

  const handleGoogleSignIn = async () => {
    setIsProcessing(true);
    try {
      // Simulate Google Sign-In flow
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.info('Google Sign-In is not yet configured. Using Internet Identity instead.');
      login();
    } catch (error) {
      toast.error('Google Sign-In failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAppleSignIn = async () => {
    setIsProcessing(true);
    try {
      // Simulate Apple Sign-In flow
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.info('Apple Sign-In is not yet configured. Using Internet Identity instead.');
      login();
    } catch (error) {
      toast.error('Apple Sign-In failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMobileSignIn = () => {
    setShowOTPModal(true);
    setOtpStep('phone');
    setPhoneNumber('');
    setOtpCode('');
  };

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate OTP sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('OTP sent to your phone');
      setOtpStep('verify');
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otpCode.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.info('Mobile authentication is not yet configured. Using Internet Identity instead.');
      setShowOTPModal(false);
      login();
    } catch (error) {
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleModalClose = () => {
    if (!isProcessing) {
      setShowOTPModal(false);
      setOtpStep('phone');
      setPhoneNumber('');
      setOtpCode('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="container flex min-h-screen flex-col items-center justify-center px-4 py-12">
        {/* Logo and Tagline */}
        <div className="mb-12 text-center">
          <img
            src="/assets/generated/app-logo-transparent.dim_200x200.png"
            alt="SafeRide Logo"
            className="mx-auto mb-6 h-32 w-32 drop-shadow-lg"
          />
          <h1 className="mb-3 text-5xl font-bold tracking-tight text-foreground">
            SafeRide
          </h1>
          <p className="text-xl text-muted-foreground">
            Safe & Reliable School Transportation
          </p>
        </div>

        {/* Sign-In Buttons */}
        <div className="w-full max-w-md space-y-4">
          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoggingIn || isProcessing}
            size="lg"
            variant="outline"
            className="w-full gap-3 h-14 text-base font-medium shadow-sm hover:shadow-md transition-all"
          >
            {isProcessing ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <SiGoogle className="h-5 w-5 text-[#4285F4]" />
            )}
            Sign in with Google
          </Button>

          <Button
            onClick={handleAppleSignIn}
            disabled={isLoggingIn || isProcessing}
            size="lg"
            variant="outline"
            className="w-full gap-3 h-14 text-base font-medium shadow-sm hover:shadow-md transition-all"
          >
            {isProcessing ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <SiApple className="h-5 w-5" />
            )}
            Sign in with Apple
          </Button>

          <Button
            onClick={handleMobileSignIn}
            disabled={isLoggingIn || isProcessing}
            size="lg"
            variant="outline"
            className="w-full gap-3 h-14 text-base font-medium shadow-sm hover:shadow-md transition-all"
          >
            <Smartphone className="h-5 w-5" />
            Sign in with Mobile Number
          </Button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Button
            onClick={login}
            disabled={isLoggingIn || isProcessing}
            size="lg"
            className="w-full gap-3 h-14 text-base font-medium shadow-md hover:shadow-lg transition-all"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                <Shield className="h-5 w-5" />
                Internet Identity
              </>
            )}
          </Button>
        </div>

        {/* Feature Highlights */}
        <div className="mt-12 w-full max-w-md space-y-4">
          <div className="flex items-start gap-4 rounded-lg bg-card/50 p-4 backdrop-blur-sm">
            <div className="rounded-full bg-success/10 p-2">
              <Shield className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="font-semibold text-sm">Safe & Secure</p>
              <p className="text-xs text-muted-foreground">
                Real-time tracking and emergency alerts for peace of mind
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-lg bg-card/50 p-4 backdrop-blur-sm">
            <div className="rounded-full bg-warning/10 p-2">
              <MapPin className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="font-semibold text-sm">Live GPS Tracking</p>
              <p className="text-xs text-muted-foreground">
                Track your child's journey from pickup to drop-off
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-lg bg-card/50 p-4 backdrop-blur-sm">
            <div className="rounded-full bg-accent/10 p-2">
              <MessageCircle className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="font-semibold text-sm">Direct Communication</p>
              <p className="text-xs text-muted-foreground">
                Chat with drivers and receive instant notifications
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Policy Link */}
        <div className="mt-8 text-center">
          <button
            onClick={onPrivacyClick}
            className="text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors"
          >
            View Privacy Policy
          </button>
        </div>
      </div>

      {/* OTP Modal */}
      <Dialog open={showOTPModal} onOpenChange={handleModalClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {otpStep === 'phone' ? 'Enter Mobile Number' : 'Verify OTP'}
            </DialogTitle>
            <DialogDescription>
              {otpStep === 'phone'
                ? 'Enter your mobile number to receive a verification code'
                : `Enter the 6-digit code sent to ${phoneNumber}`}
            </DialogDescription>
          </DialogHeader>

          {otpStep === 'phone' ? (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Mobile Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={isProcessing}
                  className="h-12 text-base"
                />
              </div>
              <Button
                onClick={handleSendOTP}
                disabled={isProcessing}
                className="w-full h-12"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send OTP'
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-center block">
                  Verification Code
                </Label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otpCode}
                    onChange={setOtpCode}
                    disabled={isProcessing}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>
              <Button
                onClick={handleVerifyOTP}
                disabled={isProcessing || otpCode.length !== 6}
                className="w-full h-12"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify & Continue'
                )}
              </Button>
              <Button
                onClick={() => setOtpStep('phone')}
                disabled={isProcessing}
                variant="ghost"
                className="w-full"
              >
                Change Number
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
