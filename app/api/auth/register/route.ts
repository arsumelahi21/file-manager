import { hash } from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return Response.json({ error: 'Missing fields' }, { status: 400 });
  }

  const hashed = await hash(password, 10);

  const { error } = await supabaseAdmin.from('users').insert({
    email,
    password: hashed,
  });

  if (error) {
    console.error('Register error:', error);
    return Response.json({ error: 'User already exists or error creating user' }, { status: 400 });
  }

  return Response.json({ message: 'User created' });
}
