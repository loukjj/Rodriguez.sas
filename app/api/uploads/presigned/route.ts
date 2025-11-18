import { NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const endpoint = process.env.DO_SPACES_ENDPOINT
const region = endpoint ? new URL(endpoint).hostname.split('.')[0] : 'us-east-1'

const s3 = new S3Client({
  endpoint: process.env.DO_SPACES_ENDPOINT,
  region: region,
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY || '',
    secretAccessKey: process.env.DO_SPACES_SECRET || ''
  }
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { filename, contentType } = body
    if (!filename) return NextResponse.json({ error: 'filename required' }, { status: 400 })

    const key = `${Date.now()}-${filename}`

    const command = new PutObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: key,
      ContentType: contentType || 'application/octet-stream',
      ACL: 'private'
    })

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 5 })

    return NextResponse.json({ url: signedUrl, key })
  } catch (err) {
    console.error('presigned error', err)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
