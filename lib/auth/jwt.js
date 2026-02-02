import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export async function getAuthUser(request) {
  const token = request.cookies.get('token')?.value;
  
  if (!token) {
    return null;
  }

  const decoded = verifyToken(token);
  return decoded ? decoded.userId : null;
}

export function createAuthResponse(data, token) {
  const response = NextResponse.json(data);
  
  if (token) {
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
  }
  
  return response;
}

export function clearAuthCookie() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('token');
  return response;
}
