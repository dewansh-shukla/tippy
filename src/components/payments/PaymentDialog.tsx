import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Copy, Check } from "lucide-react";
import QRCode from "react-qr-code";

/**
 * Payment Dialog Component
 *
 * A dialog component that allows users to deposit funds by scanning a QR code
 * or copying a wallet address. Supports multiple token networks.
 */
const PaymentDialog = ({
  isOpen,
  onClose,
  walletAddress = "0x8bb6...7302",
  fullWalletAddress = "0x8bb6b9fc6d11a789db5c4f5d25b684012a7302",
}) => {
  const [activeTab, setActiveTab] = useState("scan");
  const [copiedAddress, setCopiedAddress] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(fullWalletAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };


  // Generate proper crypto QR code URL format based on selected network
  const generateQrValue = () => {
    return fullWalletAddress;

    // Different networks use different URI formats
    // switch (network.id) {

    //   case "eth":
    //     return `ethereum:${fullWalletAddress}`;
    //   case "bsc":
    //     return `binance:${fullWalletAddress}`;
    //   case "polygon":
    //     return `polygon:${fullWalletAddress}`;
    //   default:
    //     // Generic fallback
    //     return `${network.id}:${fullWalletAddress}`;
    // }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTitle className="hidden"></DialogTitle>
      <DialogContent className="max-w-md bg-background text-foreground p-0 rounded-lg">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-xl font-medium text-foreground">Deposit</h2>
        </div>

        <Tabs
          defaultValue="scan"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 rounded-none border-b border-border bg-transparent h-12">
            <TabsTrigger
              value="scan"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none h-full"
            >
              Scan &amp; Top Up
            </TabsTrigger>
            <TabsTrigger
              value="wallet"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none h-full"
            >
              From Wallet
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scan" className="p-6">
            <div className="flex flex-col items-center">
              <p className="text-muted-foreground mb-6 text-center">
                Scan to send assets via mobile wallet
              </p>

              <div className="bg-white p-4 rounded-lg mb-4">
                <QRCode
                  value={generateQrValue()}
                  size={180}
                  level="H"
                  fgColor="#000000"
                  bgColor="#FFFFFF"
                />
              </div>

              <div className="flex items-center gap-2 bg-secondary rounded-md p-2 px-3 w-full mt-2">
                <span className="text-sm text-secondary-foreground">Token</span>
                <span className="text-sm text-secondary-foreground">
                  {walletAddress}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto h-6 w-6 hover:bg-accent"
                  onClick={handleCopyAddress}
                >
                  {copiedAddress ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="wallet" className="p-6">
            <div className="flex flex-col">
              <h3 className="text-foreground font-medium mb-4">
                Deposit into your Brahma Account
              </h3>

              <div className="flex items-center gap-2 bg-secondary rounded-md p-3 mb-4">
                <div className="flex items-center justify-center w-6 h-6 bg-accent rounded-md text-accent-foreground">
                  <span className="text-xs">📦</span>
                </div>
                <span className="text-sm text-secondary-foreground">wao</span>
                <span className="text-sm text-secondary-foreground">
                  {walletAddress}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto h-6 w-6 hover:bg-accent"
                  onClick={handleCopyAddress}
                >
                  {copiedAddress ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
