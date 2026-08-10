import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { Camera, CheckCircle2, Mail, Pencil, Check, X } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import * as authApi from "../api/auth";
import { updateProfile, uploadAvatar } from "../api/user";
import { Card } from "../components/ui/Card";
import { Avatar } from "../components/ui/Avatar";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Spinner } from "../components/ui/Spinner";

export function ProfilePage() {
  const { user, refreshProfile, updateUser } = useAuthStore();
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(user?.name ?? "");
  const [savingName, setSavingName] = useState(false);
  const [resending, setResending] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    refreshProfile()
      .catch(() => toast.error("Couldn't refresh your profile"))
      .finally(() => setLoadingProfile(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSaveName() {
    if (nameDraft.trim().length < 2) {
      toast.error("Name is too short");
      return;
    }
    setSavingName(true);
    try {
      const profile = await updateProfile({ name: nameDraft.trim() });
      updateUser(profile);
      setEditingName(false);
      toast.success("Name updated");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingName(false);
    }
  }

  async function handleAvatarSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
    setUploadingAvatar(true);
    try {
      const profile = await uploadAvatar(file);
      updateUser(profile);
      toast.success("Avatar updated");
    } catch (err) {
      setAvatarPreview(null);
      toast.error(err.message);
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function handleResendVerification() {
    setResending(true);
    try {
      await authApi.resendVerification();
      toast.success("Verification email sent - check your inbox");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setResending(false);
    }
  }

  if (loadingProfile) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size={32} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="mb-8 font-display text-2xl font-semibold text-slate-900 sm:text-3xl">
        Your profile
      </h1>

      <Card className="mb-6 flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <div className="relative">
          <Avatar name={user?.name} src={avatarPreview ?? user?.avatarUrl} size="lg" />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingAvatar}
            aria-label="Change avatar"
            className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full border-2 border-white bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {uploadingAvatar ? <Spinner size={16} /> : <Camera className="size-4" />}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarSelect}
          />
        </div>
        <div className="min-w-0 flex-1">
          {editingName ? (
            <div className="flex items-center gap-2">
              <Input
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                autoFocus
                className="h-10"
              />
              <Button
                size="sm"
                variant="ghost"
                loading={savingName}
                onClick={handleSaveName}
                aria-label="Save name"
              >
                <Check className="size-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setNameDraft(user.name);
                  setEditingName(false);
                }}
                aria-label="Cancel"
              >
                <X className="size-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <h2 className="text-lg font-semibold text-slate-900">{user?.name}</h2>
              <button
                type="button"
                onClick={() => setEditingName(true)}
                aria-label="Edit name"
                className="text-slate-400 hover:text-slate-600"
              >
                <Pencil className="size-3.5" />
              </button>
            </div>
          )}
          <p className="mt-1 text-sm text-slate-500">
            Member since {user?.createdAt ? format(new Date(user.createdAt), "MMMM yyyy") : "—"}
          </p>
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 text-sm font-semibold text-slate-700">Email</h3>
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Mail className="size-4 text-slate-400" />
            <span className="text-sm text-slate-700">{user?.email}</span>
            {user?.isVerified ? (
              <Badge variant="green">
                <CheckCircle2 className="mr-1 size-3" /> Verified
              </Badge>
            ) : (
              <Badge variant="amber">Not verified</Badge>
            )}
          </div>
          {!user?.isVerified && (
            <Button size="sm" variant="outline" loading={resending} onClick={handleResendVerification}>
              Verify email
            </Button>
          )}
        </div>
        {!user?.isVerified && (
          <p className="mt-3 text-xs text-slate-400">
            Verifying is optional - you can keep using MoodMate without it.
          </p>
        )}
      </Card>
    </div>
  );
}
