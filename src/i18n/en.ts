const en = {
  common: {
    ok: "OK!",
    cancel: "Cancel",
    back: "Back",
  },
  welcomeScreen: {
    postscript:
      "psst  — This probably isn't what your app looks like. (Unless your designer handed you these screens, and in that case, ship it!)",
    readyForLaunch: "Your app, almost ready for launch!",
    exciting: "(ohh, this is exciting!)",
  },
  errorScreen: {
    title: "Something went wrong!",
    friendlySubtitle:
      "This is the screen that your users will see in production when an error is thrown. You'll want to customize this message (located in `src/i18n/en.ts`) and probably the layout as well (`app/screens/ErrorScreen`). If you want to remove this entirely, check `app/app.tsx` for the <ErrorBoundary> component.",
    reset: "RESET APP",
  },
  loginScreen: {
    heading: "Login",
    subheading: "Don't have an account? ",
    link: "Sign Up",
    emailInputPlaceholder: "Email",
    passwordInputPlaceholder: "Password",
    submitButton: "Login",
    errorInvalidCredentials: "Invalid credentials",
    errorGeneric: "Something went wrong",
  },
  signupScreen: {
    heading: "Sign Up",
    subheading: "Already have an account? ",
    link: "Login",
    emailInputPlaceholder: "Email",
    passwordInputPlaceholder: "Password",
    confirmPasswordInputPlaceholder: "Confirm Password",
    submitButton: "Sign Up",
    errorPasswordsDoNotMatch: "Passwords do not match",
    errorWeakPassword: "Password is too weak",
    errorEmailInUse: "Email is already in use",
    errorInvalidEmail: "Invalid email",
    errorGeneric: "Something went wrong",
  },
  emptyStateComponent: {
    generic: {
      heading: "So empty... so sad",
      content: "No data found yet. Try clicking the button to refresh or reload the app.",
      button: "Let's try this again",
    },
  },
}

export default en
export type Translations = typeof en
