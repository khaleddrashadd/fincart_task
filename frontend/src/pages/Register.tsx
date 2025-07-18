import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import AuthFormFooter from '@/features/auth/components/AuthFormFooter'
import RegisterForm from '@/features/auth/components/RegisterForm'

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-blue-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Create your account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RegisterForm />

          <AuthFormFooter
            linkText="Sign in"
            title=" Already have an account?"
            linkTo="/login"
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default Register
