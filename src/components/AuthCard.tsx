// import { createClient } from "@/utils/supabase/client";
import { Avatar, Card, CardBody, CardHeader } from "@nextui-org/react";
import { ReactNode } from "react";
import { GoogleAuthButton } from "./GoogleAuthButton";

interface Props {
  children: ReactNode;
  searchParams: { message: string };
}
export const AuthCard = ({ children, searchParams }: Props) => {
  return (
    <div className="m-8">
      <Card className="mx-auto max-w-[400px] rounded-md bg-gray-50">
        <CardHeader className="primary-gradient relative flex h-[120px] justify-center overflow-hidden rounded-t-md bg-slate-400">
          <Avatar
            src="logo-192.png"
            size="lg"
            className="static z-10 border-1 bg-white"
          />
          <div className="absolute top-[50px] mx-auto h-[600px] w-[600px] rounded-full border-1 bg-gray-50 text-center text-lg font-bold  text-primary-500">
            <span className="leading-[6.5rem] ">Welcome Back</span>
          </div>
        </CardHeader>

        <CardBody className="px-8 py-4">
          <GoogleAuthButton />
          <div>
            <p className="text-center text-sm leading-8 text-gray-600">
              Or Continue with
            </p>
          </div>

          {children}
        </CardBody>

        {searchParams?.message && (
          <p className="mx-8 mb-6 bg-red-200 px-4 py-2 text-center text-red-600">
            {searchParams.message}
          </p>
        )}
      </Card>
    </div>
  );
};
