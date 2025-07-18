import { Link } from '@tanstack/react-router'
import type { LinkProps } from '@tanstack/react-router'

type props = {
  title: string
  linkText: string
  linkTo: LinkProps['to']
}

const AuthFormFooter = ({ title, linkText = '', linkTo }: props) => {
  return (
    <div className="mt-6 text-center text-sm text-gray-500">
      {title}{' '}
      <Link to={linkTo} className="text-blue-600 hover:underline">
        {linkText}
      </Link>
    </div>
  )
}
export default AuthFormFooter
