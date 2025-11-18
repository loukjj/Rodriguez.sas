import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ShippingForm } from "./ShippingForm";
import type { Session } from "next-auth";

export default async function ShippingPage() {
  const session = await getServerSession(authOptions) as Session | null;

  if (!session || !session.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
      shippingAddresses: true,
    },
  });

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Dirección de Envío
        </h2>
        <ShippingForm user={user} />
      </div>
    </div>
  );
}
