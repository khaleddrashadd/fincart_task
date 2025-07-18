import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import LoginForm from '@/features/auth/components/LoginForm'
import AuthFormFooter from '@/features/auth/components/AuthFormFooter'

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Sign in to your account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <AuthFormFooter
            linkText="Sign up"
            title="Don't have an account?"
            linkTo="/register"
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
