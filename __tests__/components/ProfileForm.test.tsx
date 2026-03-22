import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ProfileForm from '@/components/ProfileForm'

describe('ProfileForm – visning', () => {
  it('viser brugerens e-mail', () => {
    render(<ProfileForm email="test@eksempel.dk" onChangePassword={jest.fn()} onDeleteAccount={jest.fn()} />)
    expect(screen.getByText('test@eksempel.dk')).toBeInTheDocument()
  })

  it('viser skift adgangskode-sektion', () => {
    render(<ProfileForm email="test@eksempel.dk" onChangePassword={jest.fn()} onDeleteAccount={jest.fn()} />)
    expect(screen.getByText(/skift adgangskode/i)).toBeInTheDocument()
  })

  it('viser slet konto-knap', () => {
    render(<ProfileForm email="test@eksempel.dk" onChangePassword={jest.fn()} onDeleteAccount={jest.fn()} />)
    expect(screen.getByRole('button', { name: /slet konto/i })).toBeInTheDocument()
  })
})

describe('ProfileForm – skift adgangskode', () => {
  it('kalder onChangePassword med ny adgangskode', () => {
    const onChangePassword = jest.fn()
    render(<ProfileForm email="a@b.dk" onChangePassword={onChangePassword} onDeleteAccount={jest.fn()} />)
    fireEvent.change(screen.getByPlaceholderText(/ny adgangskode/i), { target: { value: 'hemlig123' } })
    fireEvent.click(screen.getByRole('button', { name: /opdater/i }))
    expect(onChangePassword).toHaveBeenCalledWith('hemlig123')
  })

  it('deaktiverer opdater-knap når feltet er tomt', () => {
    render(<ProfileForm email="a@b.dk" onChangePassword={jest.fn()} onDeleteAccount={jest.fn()} />)
    expect(screen.getByRole('button', { name: /opdater/i })).toBeDisabled()
  })
})

describe('ProfileForm – slet konto', () => {
  it('kalder onDeleteAccount ved bekræftelse', () => {
    const onDeleteAccount = jest.fn()
    render(<ProfileForm email="a@b.dk" onChangePassword={jest.fn()} onDeleteAccount={onDeleteAccount} />)
    fireEvent.click(screen.getByRole('button', { name: /slet konto/i }))
    // Confirm-knappen vises nu
    fireEvent.click(screen.getByRole('button', { name: /ja, slet/i }))
    expect(onDeleteAccount).toHaveBeenCalledTimes(1)
  })

  it('annullerer sletning', () => {
    const onDeleteAccount = jest.fn()
    render(<ProfileForm email="a@b.dk" onChangePassword={jest.fn()} onDeleteAccount={onDeleteAccount} />)
    fireEvent.click(screen.getByRole('button', { name: /slet konto/i }))
    fireEvent.click(screen.getByRole('button', { name: /annuller/i }))
    expect(onDeleteAccount).not.toHaveBeenCalled()
    expect(screen.queryByRole('button', { name: /ja, slet/i })).not.toBeInTheDocument()
  })
})
