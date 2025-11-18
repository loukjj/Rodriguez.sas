import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { Session } from "next-auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions) as Session | null;

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { address, city, state, zip, country } = await req.json();

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const shipping = await prisma.shippingAddress.create({
    data: {
      userId: user.id,
      fullName: user.name || "",
      line1: address,
      line2: state,
      city,
      postal: zip,
      country,
    },
  });

  return NextResponse.json({ ok: true, shipping });
}