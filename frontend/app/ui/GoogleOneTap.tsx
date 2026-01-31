"use client";
import { signIn, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Script from "next/script";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (momentListener: (notification: any) => void) => void;
          cancel: () => void;
          revoke: (hint: string, callback: () => void) => void;
        };
      };
    };
  }
}

export default function GoogleOneTap() {

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    let id = null;
    if(status === 'unauthenticated' || !session){
      id = setTimeout(() => {
        initializeGoogleOneTap();
      }, 5000);
    }

    return ()=> {
      if(id){
        clearTimeout(id);
      }
    }
  }, [status]);  

  const handleCredentialResponse = async (response: any) => {
    // ✅ Using "google-one-tap" provider
    const toastId = toast.loading("Signing in with Google...");

    const result = await signIn("google-one-tap", {
      credential: response.credential,
      redirect: false,
    });
    toast.dismiss(toastId);

    if (result?.error) {
      toast.error("Google One Tap sign-in failed.");
    }
    if(result?.ok){
      toast.success("Login Successful!");
      const params = new URLSearchParams(window.location.search);
      const redirectTo = params.get("redirectTo") || "/";
      router.replace(redirectTo);
    }
  };

  const initializeGoogleOneTap = () => {

    if(session || status === 'loading') return;

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: handleCredentialResponse,
      close_on_tap_outside: false,
      itp_support: true, // Enables ITP support for Safari
      use_fedcm_for_prompt: true, // Recommended for 2026 FedCM standards
    });

    // ✅ FedCM compatible notification handling
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed()) {
        console.log("One Tap not displayed:", notification.getNotDisplayedReason());
      } 
      else if (notification.isSkippedMoment()) {
        console.log("One Tap skipped:", notification.getSkippedReason());
      } 
      else if (notification.isDismissedMoment()) {
        console.log("One Tap dismissed:", notification.getDismissedReason());
      }
    });

  };

  return (
    <Script
      src="https://accounts.google.com/gsi/client"
      defer
      async
      onLoad={initializeGoogleOneTap} // ✅ Automatically triggers when script is ready
      strategy="afterInteractive"
    />
  )
}
