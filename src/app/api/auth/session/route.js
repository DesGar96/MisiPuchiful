import { NextResponse } from 'next/server';

export async function GET(request) {
  const session = request.cookies.get('user_session');
  
  if (!session) {
    return NextResponse.json({
      success: false,
      authenticated: false
    });
  }
  
  try {
    const userData = JSON.parse(session.value);
    return NextResponse.json({
      success: true,
      authenticated: true,
      user: userData
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      authenticated: false
    });
  }
}