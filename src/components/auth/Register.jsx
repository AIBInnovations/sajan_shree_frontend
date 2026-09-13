import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import FormField from "../ui/FormField";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Staff",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = form;
      const res = await ApiService.register(registerData);
      // Optionally auto-login after register
      login({ ...registerData, ...res });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:flex md:w-1/2 lg:w-2/5 flex-col items-center justify-center bg-primary text-primary-foreground p-12">
        <img
          src="/logo.png"
          alt="Sajan Shree Garments"
          className="h-32 w-auto object-contain brightness-0 invert mb-8"
        />
        <h1 className="text-2xl font-bold tracking-tight">Sajan Shree Garments</h1>
        <p className="mt-3 text-center text-primary-foreground/80 max-w-xs">
          Manufacturing management, streamlined.
        </p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex flex-col items-center md:hidden">
            <img src="/logo.png" alt="Sajan Shree Garments" className="h-16 w-auto object-contain mb-2" />
            <span className="font-bold text-lg text-foreground">Sajan Shree Garments</span>
          </div>

          <Card className="rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-center text-foreground mb-6">Register</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormField label="Full Name" htmlFor="name">
                <Input
                  id="name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </FormField>
              <FormField label="Email" htmlFor="email">
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </FormField>
              <FormField label="Role" htmlFor="role">
                <Select id="role" name="role" value={form.role} onChange={handleChange}>
                  <option value="Staff">Staff</option>
                  <option value="Admin">Admin</option>
                </Select>
              </FormField>
              <FormField label="Password" htmlFor="password">
                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </FormField>
              <FormField label="Confirm Password" htmlFor="confirmPassword">
                <Input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </FormField>
              {error && <div className="text-sm text-destructive">{error}</div>}
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Registering..." : "Register"}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                type="button"
                className="text-primary font-medium hover:underline"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;
