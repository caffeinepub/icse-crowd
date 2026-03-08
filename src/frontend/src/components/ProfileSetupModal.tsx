import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { useCreateUserProfile } from "../hooks/useQueries";

interface ProfileSetupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function ProfileSetupModal({
  open,
  onOpenChange,
  onSuccess,
}: ProfileSetupModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [academicDetails, setAcademicDetails] = useState("");
  const createProfile = useCreateUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createProfile.mutateAsync({ name, email, academicDetails });
      toast.success("Profile created successfully!");
      setName("");
      setEmail("");
      setAcademicDetails("");
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to create profile");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to ICSE Connect!</DialogTitle>
          <DialogDescription>
            Please set up your profile to get started.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="academicDetails">Academic Details</Label>
            <Textarea
              id="academicDetails"
              value={academicDetails}
              onChange={(e) => setAcademicDetails(e.target.value)}
              placeholder="Grade, subjects, interests..."
              rows={3}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={createProfile.isPending}
          >
            {createProfile.isPending ? "Creating Profile..." : "Create Profile"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
