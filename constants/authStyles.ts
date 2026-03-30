import { StyleSheet } from "react-native";

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff9e3",
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
  },
  // ─── Logo header ──────────────────────────────────────────────
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    gap: 10,
  },
  logoIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
  },
  logoName: {
    fontFamily: "sans-bold",
    fontSize: 18,
    color: "#081126",
    lineHeight: 22,
  },
  logoSub: {
    fontFamily: "sans-medium",
    fontSize: 9,
    color: "rgba(0,0,0,0.45)",
    letterSpacing: 1.5,
  },
  // ─── Headings ─────────────────────────────────────────────────
  title: {
    fontFamily: "sans-bold",
    fontSize: 26,
    color: "#081126",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: "sans-regular",
    fontSize: 14,
    color: "rgba(0,0,0,0.55)",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 28,
  },
  // ─── Form card ────────────────────────────────────────────────
  form: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    gap: 4,
  },
  // ─── Network error banner (shown at top of form) ──────────────
  networkError: {
    fontFamily: "sans-regular",
    fontSize: 13,
    color: "#dc2626",
    backgroundColor: "rgba(220,38,38,0.06)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 4,
  },
  // ─── Labels & inputs ──────────────────────────────────────────
  label: {
    fontFamily: "sans-semibold",
    fontSize: 14,
    color: "#081126",
    marginBottom: 6,
  },
  labelSpacing: {
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.12)",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontFamily: "sans-regular",
    fontSize: 15,
    color: "#081126",
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "#dc2626",
  },
  codeInput: {
    fontSize: 22,
    letterSpacing: 8,
    textAlign: "center",
    fontFamily: "sans-bold",
  },
  errorText: {
    fontFamily: "sans-regular",
    fontSize: 12,
    color: "#dc2626",
    marginTop: 4,
  },
  // ─── Button ───────────────────────────────────────────────────
  button: {
    backgroundColor: "#ea7a53",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    fontFamily: "sans-semibold",
    fontSize: 16,
    color: "#fff",
  },
  // ─── Footer link row ──────────────────────────────────────────
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
  },
  footerText: {
    fontFamily: "sans-regular",
    fontSize: 14,
    color: "rgba(0,0,0,0.6)",
  },
  footerLink: {
    fontFamily: "sans-semibold",
    fontSize: 14,
    color: "#ea7a53",
  },
  // ─── Resend / secondary actions ───────────────────────────────
  resendRow: {
    alignItems: "center",
    paddingVertical: 12,
  },
  resendText: {
    fontFamily: "sans-semibold",
    fontSize: 14,
    color: "#ea7a53",
  },
});
