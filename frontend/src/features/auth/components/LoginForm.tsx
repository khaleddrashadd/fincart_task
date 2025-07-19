import { useMutation } from '@tanstack/react-query'
import { useRef } from 'react'
import { useRouter } from '@tanstack/react-router'
import { loginService } from '../services/login'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const LoginForm = () => {
  const email = useRef<HTMLInputElement>(null)
  const password = useRef<HTMLInputElement>(null)
  const { isPending, mutateAsync } = useMutation({
    mutationFn: loginService,
  })
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    // Call the login service with email and password
    const loginData = await mutateAsync({
      email: email.current?.value || '',
      password: password.current?.value || '',
    })
    console.log(loginData)
    localStorage.setItem('token', loginData.token)

    await router.navigate({
      to: '/service',
      replace: true,
    })
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <Label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          className="w-full"
          required
          ref={email}
        />
      </div>
      <div>
        <Label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          className="w-full"
          required
          ref={password}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        Sign In
      </Button>
    </form>
  )
}
export default LoginForm
