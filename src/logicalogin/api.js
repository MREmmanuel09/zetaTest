import { loginUser, registerUser } from './auth';

export async function handleLogin(request) {
  try {
    const { email, password } = await request.json();
    const user = await loginUser(email, password);
    
    return {
      status: 200,
      body: { 
        success: true,
        user,
        redirect: user.role === 'admin' ? '/products' : '/public/user.html'
      }
    };
  } catch (error) {
    return {
      status: 401,
      body: { 
        success: false, 
        message: error.message 
      }
    };
  }
}

export async function handleRegister(request) {
  try {
    const { name, email, password } = await request.json();
    const user = await registerUser(name, email, password);
    
    return {
      status: 201,
      body: { 
        success: true,
        user,
        redirect: '/public/user.html'
      }
    };
  } catch (error) {
    return {
      status: 400,
      body: { 
        success: false, 
        message: error.message 
      }
    };
  }
}