'use client';

import { useState } from 'react';
import { useGetChildProfiles, useCreateChildProfile } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  User,
  Phone,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

type ChildFormData = {
  name: string;
  grade: string;
  allergies: string;
  emergencyContact: string;
};

const INITIAL_FORM_DATA: ChildFormData = {
  name: '',
  grade: '',
  allergies: '',
  emergencyContact: ''
};

export default function ChildrenManagement() {
  const { data: children = [], isLoading } = useGetChildProfiles();
  const createChild = useCreateChildProfile();

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<ChildFormData>(INITIAL_FORM_DATA);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (createChild.isPending) return;

    const { name, grade, emergencyContact, allergies } = formData;

    if (!name || !grade || !emergencyContact) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createChild.mutateAsync({
        name,
        grade,
        emergencyContact,
        allergies: allergies || null
      });

      toast.success('Child profile created successfully!');
      setFormData(INITIAL_FORM_DATA);
      setOpen(false);
    } catch (error) {
      console.error('Create child error:', error);
      toast.error('Failed to create child profile');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Children Profiles</h3>
          <p className="text-sm text-muted-foreground">
            Manage your children's information
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Child
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Child Profile</DialogTitle>
              <DialogDescription>
                Enter your child's information for safe transportation
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Child's Name *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter child's full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="grade">Grade *</Label>
                <Input
                  id="grade"
                  required
                  value={formData.grade}
                  onChange={(e) =>
                    setFormData({ ...formData, grade: e.target.value })
                  }
                  placeholder="e.g., Grade 5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies (Optional)</Label>
                <Textarea
                  id="allergies"
                  value={formData.allergies}
                  onChange={(e) =>
                    setFormData({ ...formData, allergies: e.target.value })
                  }
                  placeholder="List any allergies or medical conditions"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergency">Emergency Contact *</Label>
                <Input
                  id="emergency"
                  type="tel"
                  inputMode="tel"
                  required
                  value={formData.emergencyContact}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyContact: e.target.value
                    })
                  }
                  placeholder="Phone number"
                />
              </div>

              <Button
                type="submit"
                disabled={createChild.isPending}
                className="w-full gap-2"
              >
                {createChild.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Add Child
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Content */}
      {children.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="mb-2 text-lg font-medium">No children added yet</p>
            <p className="text-sm text-muted-foreground">
              Add your first child to start booking trips
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {children.map((child) => (
            <Card key={child.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {child.name}
                </CardTitle>
                <CardDescription>
                  <Badge variant="secondary">{child.grade}</Badge>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-start gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Emergency Contact</p>
                    <p className="text-muted-foreground">
                      {child.emergencyContact}
                    </p>
                  </div>
                </div>

                {child.allergies && (
                  <div className="flex items-start gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-warning" />
                    <div>
                      <p className="font-medium">Allergies</p>
                      <p className="text-muted-foreground">
                        {child.allergies}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

