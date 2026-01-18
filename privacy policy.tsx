import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Shield, Lock, Eye, Database, UserCheck, Globe, ArrowLeft, X } from 'lucide-react';

interface PrivacyPolicyProps {
  onClose: () => void;
  isModal?: boolean;
}

export default function PrivacyPolicy({ onClose, isModal = false }: PrivacyPolicyProps) {
  const content = (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
        </div>
        <p className="text-muted-foreground">
          Last updated: December 31, 2025
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Our Commitment to Your Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            At SafeRide, we take your privacy seriously. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our school transportation management application.
          </p>
          <p>
            We are committed to transparency and giving you control over your data. This policy applies to all users of SafeRide, including parents, drivers, and administrators.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Information We Collect
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Personal Information</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>User profile information (name, contact details)</li>
              <li>Child profiles (name, grade, allergies, emergency contacts)</li>
              <li>Trip booking details (pickup/dropoff locations, scheduled times)</li>
              <li>Real-time GPS location data (for drivers during active trips)</li>
              <li>Chat messages between parents and drivers</li>
              <li>Emergency alert information</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Technical Information</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Internet Identity authentication data</li>
              <li>Device information and browser type</li>
              <li>Usage patterns and interaction data (anonymized)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Data Encryption & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Encryption at Rest</h3>
            <p className="text-sm text-muted-foreground">
              All sensitive data is encrypted before being stored on our servers using strong symmetric encryption algorithms. This includes:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mt-2">
              <li>Child profiles and medical information</li>
              <li>Emergency contact details</li>
              <li>Trip routes and location data</li>
              <li>Chat message history</li>
              <li>Personal identification information</li>
            </ul>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Encryption in Transit</h3>
            <p className="text-sm text-muted-foreground">
              All data transmitted between your device and our servers is encrypted using industry-standard TLS/SSL protocols. This ensures that your information cannot be intercepted during transmission.
            </p>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Access Control</h3>
            <p className="text-sm text-muted-foreground">
              Data is automatically decrypted only for authorized users verified through Internet Identity and role-based access control. Parents can only access their own children's information, and drivers can only view data for trips assigned to them.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            How We Use Your Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>To provide and maintain our transportation management services</li>
            <li>To facilitate communication between parents and drivers</li>
            <li>To enable real-time tracking and trip status updates</li>
            <li>To ensure child safety through emergency contact information</li>
            <li>To improve our services through anonymized usage analytics</li>
            <li>To comply with legal obligations and protect user safety</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Data Sharing & Third Parties
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-success/10 p-4 border border-success/20">
            <p className="font-semibold text-success mb-2">We Never Share Your Data</p>
            <p className="text-sm text-muted-foreground">
              SafeRide does not sell, rent, or share your personal information with third parties for marketing purposes. Your data remains private and is only accessible to authorized users within the SafeRide platform.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Limited Exceptions</h3>
            <p className="text-sm text-muted-foreground mb-2">
              We may disclose information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>When required by law or legal process</li>
              <li>To protect the safety and security of our users</li>
              <li>In emergency situations involving child safety</li>
              <li>With your explicit consent</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>GDPR Compliance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            SafeRide is designed to be GDPR-ready and respects your data protection rights:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li><strong>Right to Access:</strong> You can request a copy of your personal data</li>
            <li><strong>Right to Rectification:</strong> You can update or correct your information</li>
            <li><strong>Right to Erasure:</strong> You can request deletion of your data</li>
            <li><strong>Right to Data Portability:</strong> You can request your data in a portable format</li>
            <li><strong>Right to Object:</strong> You can object to certain data processing activities</li>
          </ul>
          <p className="text-sm text-muted-foreground mt-4">
            To exercise any of these rights, please contact us through the application or your administrator.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Anonymized Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            We collect anonymized usage data to improve our services. This data cannot be traced back to individual users and includes information such as feature usage patterns, performance metrics, and general usage statistics. No personally identifiable information is included in our analytics.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Retention</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            We retain your personal information only for as long as necessary to provide our services and comply with legal obligations. Trip history and chat messages are retained for operational purposes but can be deleted upon request. Child profiles remain active until you choose to remove them.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Children's Privacy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            SafeRide is designed to protect children's information. Only authorized parents and assigned drivers can access child profiles. We implement strict access controls and encryption to ensure that children's data, including medical information and emergency contacts, is kept secure and private.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Changes to This Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify users of any material changes through the application. Your continued use of SafeRide after such changes constitutes acceptance of the updated policy.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            If you have any questions or concerns about this Privacy Policy or our data practices, please contact your school administrator or reach out through the SafeRide application support channels.
          </p>
        </CardContent>
      </Card>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="fixed inset-4 z-50 md:inset-8">
          <Card className="h-full flex flex-col">
            <CardHeader className="flex-shrink-0 border-b">
              <div className="flex items-center justify-between">
                <CardTitle>Privacy Policy</CardTitle>
                <Button onClick={onClose} variant="ghost" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <ScrollArea className="flex-1 p-6">
              {content}
            </ScrollArea>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <Button onClick={onClose} variant="ghost" className="mb-6 gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      {content}
    </div>
  );
}
