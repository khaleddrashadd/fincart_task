import { useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { registerService } from '../services/register'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const RegisterForm = () => {
  const firstName = useRef<HTMLInputElement>(null)
  const lastName = useRef<HTMLInputElement>(null)
  const email = useRef<HTMLInputElement>(null)
  const password = useRef<HTMLInputElement>(null)
  const confirmPassword = useRef<HTMLInputElement>(null)
  const role = useRef<string>('user')
  const navigate = useNavigate()
  const {
    isPending,
    mutateAsync,
    data: registerData,
  } = useMutation({
    mutationFn: registerService,
  })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    await mutateAsync({
      email: email.current?.value || '',
      password: password.current?.value || '',
      confirmPassword: confirmPassword.current?.value || '',
      role: role.current,
      firstName: firstName.current?.value || '',
      lastName: lastName.current?.value || '',
    })
    localStorage.setItem('token', registerData.token)
    navigate({
      to: '/service',
      replace: true,
    })
  }
  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="flex gap-4">
        <div className="w-1/2">
          <Label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            First Name
          </Label>
          <Input
            id="firstName"
            type="text"
            placeholder="First Name"
            className="w-full"
            required
            ref={firstName}
          />
        </div>
        <div className="w-1/2">
          <Label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Last Name
          </Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Last Name"
            className="w-full"
            required
            ref={lastName}
          />
        </div>
      </div>
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
      <div>
        <Label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Confirm Password
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          className="w-full"
          required
          ref={confirmPassword}
        />
      </div>
      <div>
        <Label
          htmlFor="role"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Role
        </Label>
        <Select
          name="role"
          defaultValue="user"
          required
          onValueChange={(value) => {
            role.current = value
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="provider">Provider</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        Register
      </Button>
    </form>
  )
}
export default RegisterForm
