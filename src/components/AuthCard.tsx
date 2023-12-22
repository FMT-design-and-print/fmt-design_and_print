import { MessageStatus } from "@/types";
import { Avatar } from "@nextui-org/avatar";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
  searchParams: { message: string; messageStatus?: MessageStatus };
}
export const AuthCard = ({ title, children, searchParams }: Props) => {
  const getAlertColor = () => {
    switch (searchParams.messageStatus) {
      case "success":
        return "bg-green-200 text-green-600";
      case "error":
        return "bg-red-200 text-red-600";
      case "info":
        return "bg-blue-200 text-blue-600";
      default:
        return "bg-gray-200 text-gray-600";
    }
  };

  return (
    <div className="relative m-8">
      <Card className="mx-auto max-w-[400px] rounded-md bg-gray-50">
        <CardHeader className="primary-gradient relative flex h-[120px] justify-center overflow-hidden rounded-t-md bg-slate-400">
          <Avatar
            src="logo-192.png"
            size="lg"
            className="static z-10 border-1 bg-white"
          />
          <div className="absolute top-[50px] mx-auto h-[600px] w-[600px] rounded-full border-1 bg-gray-50 text-center text-lg font-bold  text-primary-500">
            <span className="leading-[6.5rem] ">{title}</span>
          </div>
        </CardHeader>

        <CardBody className="px-8 py-4">{children}</CardBody>

        {searchParams?.message && (
          <p className={`mx-8 mb-6 px-4 py-2 text-center ${getAlertColor()}`}>
            {searchParams.message}
          </p>
        )}
      </Card>
    </div>
  );
};
