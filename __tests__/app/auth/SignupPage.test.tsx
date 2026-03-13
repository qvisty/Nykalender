import { render, screen } from '@testing-library/react'
import SignupPage from '@/app/auth/signup/page'

jest.mock('@/app/auth/actions', () => ({
  login: jest.fn(),
  signup: jest.fn(),
}))

describe('SignupPage', () => {
  it('renders email and password fields', () => {
    render(<SignupPage />)
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/adgangskode/i)).toBeInTheDocument()
  })

  it('renders signup button', () => {
    render(<SignupPage />)
    expect(screen.getByRole('button', { name: /opret konto/i })).toBeInTheDocument()
  })

  it('renders link back to login', () => {
    render(<SignupPage />)
    expect(screen.getByRole('link', { name: /log ind/i })).toBeInTheDocument()
  })

  it('renders Nykalender heading', () => {
    render(<SignupPage />)
    expect(screen.getByRole('heading', { name: /nykalender/i })).toBeInTheDocument()
  })
})
