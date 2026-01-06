import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  FileText,
  Users,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Lock,
  FolderOpen,
  Bell,
} from "lucide-react";

export const metadata = {
  title: "Evidence Vault - Compliance Management Platform",
  description: "Professional compliance management system for factory users",
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="p-8">
        <div className="p-4">
          {/* Header Section */}
          <header className="flex flex-col items-center max-w-2xl mx-auto text-center mb-20">
            {/* Icon with subtle glow */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 rounded-full"></div>
              <div className="relative inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl rotate-3 shadow-lg shadow-blue-200 dark:shadow-none transition-transform hover:rotate-0 duration-300">
                <Shield className="w-7 h-7 text-white" />
              </div>
            </div>

            {/* Typography Wrapper */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                Evidence{" "}
                <span className="bg-linear-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                  Vault
                </span>
              </h1>

              <div className="flex flex-col items-center gap-3">
                <span className="px-3 py-1 text-xs font-semibold tracking-wider text-blue-700 uppercase bg-blue-50 rounded-full dark:bg-blue-900/30 dark:text-blue-300">
                  Enterprise Compliance
                </span>
                <p className="text-lg text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
                  Securely manage factory compliance and regulatory
                  documentation in one unified platform.
                </p>
              </div>
            </div>

            {/* Professional Divider */}
            <div className="w-12 h-1 bg-blue-600 rounded-full mt-8 opacity-20"></div>
          </header>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  Active
                </Badge>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                2,847
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Documents Managed
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-green-600" />
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                  Verified
                </Badge>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                124
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Active Buyers
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-8 h-8 text-purple-600" />
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                >
                  Growing
                </Badge>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                98.5%
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Compliance Rate
              </p>
            </div>
          </div>

          {/* Main Action Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-linear-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg">
                    <FolderOpen className="w-6 h-6 text-white" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                  Evidence Vault
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300 text-base">
                  Securely manage, organize, and track all your compliance
                  documents and evidence in one centralized location
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      Advanced document encryption
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      Real-time collaboration
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      Automated compliance checks
                    </span>
                  </div>
                </div>
                <Link href="/vault">
                  <Button
                    size="lg"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  >
                    Access Evidence Vault
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-linear-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-600 rounded-lg">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-green-600 group-hover:translate-x-1 transition-transform" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                  Buyer Requests
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300 text-base">
                  Efficiently manage and fulfill buyer document requests with
                  automated workflows and notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      Priority request management
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      Automated notifications
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      Request tracking dashboard
                    </span>
                  </div>
                </div>
                <Link href="/requests">
                  <Button
                    size="lg"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
                  >
                    View Requests
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
