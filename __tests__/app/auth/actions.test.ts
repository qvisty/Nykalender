// Integration-level tests for auth actions (logic only, no HTTP calls)

describe('auth actions module', () => {
  it('exports login and signup functions', async () => {
    // We test the module shape — actual Supabase calls require integration test
    const mod = await import('@/app/auth/actions')
    expect(typeof mod.login).toBe('function')
    expect(typeof mod.signup).toBe('function')
  })
})
