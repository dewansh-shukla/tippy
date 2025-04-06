"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import PaymentDialog from "@/components/payments/PaymentDialog";
import { useAuth } from "@/lib/auth";
import api from "@/lib/axiosClient";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useWalletClient } from "wagmi";
import { ethers, JsonRpcProvider, JsonRpcSigner } from "ethers";
import {
  Address,
  ConsoleKit,
  PreComputedAddressData,
} from "brahma-console-kit";
import { erc20Abi, fromHex } from "viem";

// Define types for account data
interface AccountData {
  id: string;
  registryId: string;
  chainId: number;
  duration: number;
  tokenInputs: Record<string, string>;
  tokenLimits: Record<string, string>;
  status: number;
  commitHash: string;
  subAccountAddress: string;
  feeToken: string;
  feeAmount: string;
  metadata: {
    every: string;
    receiver: string;
    transferAmount: string;
  };
  createdAt: string;
}

interface FetchAccountResponse {
  account: AccountData[];
}

const AutomationSubscriptionParams = {
  inputToken: "0xFCBD14DC51f0A4d49d5E53C2E0950e0bC26d0Dce" as Address, // honey ( usdc )
  inputAmount: BigInt(0), // 10 usdc
  inputTokenPerIterationLimit: BigInt(500e6), // 2 usdc,
  duration: 0,
  metadata: {
    every: "60s", // configure to required automation interval
    receiver: "0xAE75B29ADe678372D77A8B41225654138a7E6ff1", // configure to required receiver address
    transferAmount: "200000", // configure to required transfer amount per iteration
  },
};

const consoleKit = new ConsoleKit(
  process.env.NEXT_PUBLIC_CONSOLE_API_KEY as string,
  process.env.NEXT_PUBLIC_CONSOLE_BASE_URL as string
);

export default function DashboardPage() {
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [taskStatus, setTaskStatus] = useState<string | null>(null);
  const [activeAccount, setActiveAccount] = useState<AccountData | null>(null);

  const { isAuthenticated, address, isLoading } = useAuth();
  const router = useRouter();
  const { data: walletClient } = useWalletClient();

  const {
    data: accountData,
    isLoading: isAccountLoading,
    refetch: refetchAccount,
  } = useQuery({
    queryKey: ["fetch-account", address],
    queryFn: async () => {
      const response = await api.get(`/fetch-account/?address=${address}`);
      return response.data as FetchAccountResponse;
    },
    enabled: !!address,
    retry: false,
  });

  // Check for active accounts whenever account data changes
  useEffect(() => {
    if (accountData) {
      const activeAcc = accountData.account?.find((acc) => acc.status === 2);
      if (activeAcc) {
        setActiveAccount(activeAcc);
        // Show QR dialog if active account is found
        setIsQrDialogOpen(true);
      } else {
        setActiveAccount(null);
      }
    }
  }, [accountData]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  // Poll for task status when taskId is available
  useEffect(() => {
    if (!taskId) return;

    const pollTaskStatus = async () => {
      try {
        const status = (await consoleKit.publicDeployer.fetchDeploymentStatus(
          taskId
        ))?.status;
        console.log({ taskStatus: status });

        // Safely handle status as string
        const statusStr = String(status);
        setTaskStatus(statusStr);

        if (statusStr === "successful") {
          // Refetch account data when deployment is successful
          await refetchAccount();
          setIsCreatingAccount(false);
        } else if (statusStr === "failed") {
          // Handle failure
          setIsCreatingAccount(false);
        } else {
          // Continue polling if not complete
          setTimeout(pollTaskStatus, 5000);
        }
      } catch (error) {
        console.error("Error polling task status:", error);
        setIsCreatingAccount(false);
      }
    };

    pollTaskStatus();
  }, [taskId, refetchAccount]);

  // Redirect if not authenticated (backup protection)
  if (isLoading || isAccountLoading) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center items-center min-h-[60vh]">
        <p className="text-lg font-geist-mono">Loading your dashboard...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center items-center min-h-[60vh]">
        <p className="text-lg font-geist-mono">You are not authenticated</p>
      </div>
    );
  }

  const setupPrecomputeBalances = async (
    _consoleKit: ConsoleKit,
    _provider: JsonRpcProvider,
    _userWallet: JsonRpcSigner,
    _userEoa: Address,
    _chainId: number,
    _inputToken: Address
  ) => {
    const precomputedData =
      await _consoleKit.publicDeployer.fetchPreComputeData(
        _userEoa,
        _chainId,
        _inputToken
      );
    if (!precomputedData) throw new Error("precompute call fail");

    console.log("[precompute]", { precomputedData });
    return precomputedData;
  };

  const signAndDeployAutomationAccount = async (
    _consoleKit: ConsoleKit,
    _provider: JsonRpcProvider,
    _userWallet: JsonRpcSigner,
    _userEoa: Address,
    _chainId: number,
    _precomputeData: PreComputedAddressData,
    _executorRegistryId: string,
    _inputToken: Address,
    _inputAmount: bigint,
    _inputTokenPerIterationLimit: bigint,
    _automationDuration: number
  ) => {
    const inputTokenContract = new ethers.Contract(
      _inputToken,
      erc20Abi,
      _userWallet
    );
    const inputTokenDecimals = await inputTokenContract.decimals();

    const tokens = [_inputToken];
    const amounts = [_inputAmount.toString()];

    const tokenInputs = {
      [_inputToken]: _inputAmount.toString(),
    };
    const tokenLimits = {
      [_inputToken]: ethers.formatUnits(_inputAmount, inputTokenDecimals),
    };

    const automationDuration =
      _automationDuration > 3600
        ? _automationDuration - 3600
        : _automationDuration;

    const accountGenerationData =
      await _consoleKit.publicDeployer.generateAutomationSubAccount(
        _userEoa,
        _precomputeData.precomputedAddress,
        _chainId,
        _executorRegistryId,
        _inputToken,
        _precomputeData.feeEstimate,
        tokens,
        amounts,
        {
          duration: automationDuration,
          tokenInputs: tokenInputs,
          tokenLimits: tokenLimits,
        },
        AutomationSubscriptionParams.metadata
      );
    if (!accountGenerationData)
      throw new Error("automation account generation data fetch fail");

    const {
      signaturePayload: { domain, message, types },
      subAccountPolicyCommit,
      subscriptionDraftID,
    } = accountGenerationData;

    const deploymentSignature = await _userWallet.signTypedData(
      {
        verifyingContract: domain.verifyingContract,
        chainId: fromHex(domain.chainId as Address, "number"),
      },
      types,
      message
    );

    const deployData = await _consoleKit.publicDeployer.deployBrahmaAccount(
      _userEoa,
      _chainId,
      _executorRegistryId,
      subscriptionDraftID,
      subAccountPolicyCommit,
      _inputToken,
      tokens,
      amounts,
      deploymentSignature,
      _precomputeData.feeEstimateSignature,
      _precomputeData.feeEstimate,
      {}
    );
    if (!deployData) throw new Error("automation account deployment fail");
    return deployData;
  };

  const handleCreateAccount = async () => {
    setIsCreatingAccount(true);
    try {
      // Use the user's connected wallet
      if (!address || !walletClient) {
        console.error("No wallet available");
        setIsCreatingAccount(false);
        return;
      }

      // Get the ethers signer from the wallet client
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const { chainId: chainIdBig } = await provider.getNetwork();
      const chainId = parseInt(chainIdBig.toString(), 10);

      console.log("Connected wallet address:", await signer.getAddress());
      const precomputeData = await setupPrecomputeBalances(
        consoleKit,
        provider as unknown as JsonRpcProvider,
        signer,
        address as Address,
        chainId,
        AutomationSubscriptionParams.inputToken
      );

      console.log("precomputeData", precomputeData);

      const { taskId } = await signAndDeployAutomationAccount(
        consoleKit,
        provider as unknown as JsonRpcProvider,
        signer,
        address as Address,
        chainId,
        precomputeData,
        process.env.NEXT_PUBLIC_REGISTRY_ID as string,
        AutomationSubscriptionParams.inputToken,
        AutomationSubscriptionParams.inputAmount,
        AutomationSubscriptionParams.inputTokenPerIterationLimit,
        AutomationSubscriptionParams.duration
      );

      setTaskId(taskId);
    } catch (error) {
      console.error("Error creating account:", error);
      setIsCreatingAccount(false);
    }
  };

  // Format wallet address for display
  const walletAddressShort = address
    ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
    : "";

  // Render the UI based on account state
  const renderAccountStatus = () => {
    if (isCreatingAccount) {
      if (!taskId) {
        return (
          <div className="flex flex-col justify-center items-center mt-6">
            <p className="text-lg font-geist-mono mb-4">
              Setting up your account...
            </p>
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        );
      } else {
        return (
          <div className="flex flex-col justify-center items-center mt-6">
            <p className="text-lg font-geist-mono mb-4">
              Deploying your account...
            </p>
            <p className="text-sm font-geist-mono text-muted-foreground">
              This may take a few moments
            </p>
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mt-4"></div>
            {taskStatus && (
              <p className="text-sm font-geist-mono mt-4">
                Status: {taskStatus}
              </p>
            )}
          </div>
        );
      }
    }

    if (activeAccount) {
      return (
        <div className="flex flex-col justify-center items-center mt-6">
          <p className="text-lg font-geist-mono mb-4">
            Your account is ready to use
          </p>
          <Button
            className="bg-primary text-white font-geist-mono mt-2"
            onClick={() => setIsQrDialogOpen(true)}
          >
            View Your Account
          </Button>
        </div>
      );
    }

    return (
      <div className="flex flex-col justify-center items-center mt-6">
        <p className="text-lg font-geist-mono mb-4">
          You don&apos;t have an account yet
        </p>
        <Button
          className="bg-primary text-white font-geist-mono mt-2"
          onClick={handleCreateAccount}
          disabled={isCreatingAccount}
        >
          Create Account
        </Button>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-transparent flex flex-col justify-center items-center rounded-lg shadow p-6">
        <p className="text-xl font-semibold font-geist-mono mr-2">
          Welcome to your Dashboard
        </p>
        {isAccountLoading ? (
          <p className="text-lg font-geist-mono">Loading your account...</p>
        ) : (
          renderAccountStatus()
        )}
      </div>
      {activeAccount && (
        <PaymentDialog
          isOpen={isQrDialogOpen}
          onClose={() => setIsQrDialogOpen(false)}
          walletAddress={walletAddressShort}
          fullWalletAddress={activeAccount.subAccountAddress || ""}
        />
      )}
    </div>
  );
}
