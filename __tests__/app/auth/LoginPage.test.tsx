import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginPage from '@/app/auth/login/page'

// Mock server actions
jest.mock('@/app/auth/actions', () => ({
  login: jest.fn(),
  signup: jest.fn(),
}))

describe('LoginPage', () => {
  it('renders email and password fields', () => {
    render(<LoginPage />)
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/adgangskode/i)).toBeInTheDocument()
  })

  it('renders login button', () => {
    render(<LoginPage />)
    expect(screen.getByRole('button', { name: /log ind/i })).toBeInTheDocument()
  })

  it('renders link to signup page', () => {
    render(<LoginPage />)
    expect(screen.getByRole('link', { name: /opret konto/i })).toBeInTheDocument()
  })

  it('renders Nykalender heading', () => {
    render(<LoginPage />)
    expect(screen.getByRole('heading', { name: /nykalender/i })).toBeInTheDocument()
  })
})
