import { prisma } from '@/lib/prisma'
import { randomBytes } from 'crypto'
import nodemailer from 'nodemailer'
import { NextResponse } from 'next/server'
export async function POST(req: Request) {
  const body = await req.json()
  const email = String(body?.email || '').toLowerCase()
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    // don't reveal whether user exists
    return NextResponse.json({ ok: true })
  }

  const token = randomBytes(24).toString('hex')
  const expires = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

  await prisma.user.update({ where: { id: user.id }, data: { passwordResetToken: token, passwordResetExpires: expires } })

  const nextauthUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
  const resetUrl = `${nextauthUrl}/reset-password/${token}`

  // Try to send email if SMTP configured, otherwise return the reset link (dev helper)
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS
  const smtpHost = process.env.SMTP_HOST
  const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined

  if (smtpHost && smtpPort && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({ host: smtpHost, port: smtpPort, secure: smtpPort === 465, auth: { user: smtpUser, pass: smtpPass } })
      await transporter.sendMail({
        to: email,
        from: process.env.EMAIL_FROM || 'no-reply@example.com',
        subject: 'Restablece tu contraseña',
        text: `Usa este enlace para restablecer tu contraseña: ${resetUrl}`,
        html: `<p>Usa este enlace para restablecer tu contraseña:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
      })
      return NextResponse.json({ ok: true })
    } catch (err) {
      // fallthrough to return link
      console.error('SMTP send error', err)
    }
  }

  return NextResponse.json({ ok: true, resetUrl })
}
