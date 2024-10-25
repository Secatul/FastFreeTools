"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Share2 } from "lucide-react";
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, WhatsappIcon } from "react-share";

export default function ShareButton({ shareUrl, shareTitle, tooltipText = "Share this tool" }) {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  useEffect(() => {
    setIsTooltipVisible(true); 
    const timer = setTimeout(() => {
      setIsTooltipVisible(false);
    }, 3000);

    return () => clearTimeout(timer); 
  }, []);

  return (
    <TooltipProvider>
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <Tooltip open={isTooltipVisible}>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label="Share tool"
                className="bg-white/10 hover:bg-white/20 text-white"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipText}</p>
          </TooltipContent>
        </Tooltip>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Tool</DialogTitle>
            <DialogDescription>
              Choose a platform to share this tool with your friends and colleagues.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center space-x-4 mt-4">
            <FacebookShareButton url={shareUrl} quote={shareTitle}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <TwitterShareButton url={shareUrl} title={shareTitle}>
              <TwitterIcon size={32} round />
            </TwitterShareButton>
            <WhatsappShareButton url={shareUrl} title={shareTitle}>
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
