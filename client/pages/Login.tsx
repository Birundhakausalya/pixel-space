import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Calendar, ArrowLeft, LogIn, Sparkles, ShieldCheck, ChevronRight, Heart } from "lucide-react";

export default function Login() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [touched, setTouched] = useState({ name: false, dob: false });
  const navigate = useNavigate();

  const valid = useMemo(() => name.trim().length >= 2 && Boolean(dob), [name, dob]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    try {
      localStorage.setItem("senti.user.name", name.trim());
      localStorage.setItem("senti.user.dob", dob);
    } catch {}
    navigate("/");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full blur-3xl opacity-40 bg-gradient-to-br from-purple-400 to-blue-400" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full blur-3xl opacity-40 bg-gradient-to-br from-pink-400 to-purple-400" />

      <header className="relative z-10 p-6 backdrop-blur-sm bg-white/80 border-b border-purple-100">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="hover:bg-purple-100">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg gradient-fun flex items-center justify-center">
                <LogIn className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gradient">Welcome to SentiLearn</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-10">
        <Card className="overflow-hidden border-2 border-purple-100">
          <div className="grid md:grid-cols-2">
            {/* Left showcase */}
            <div className="relative p-8 md:p-10 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_0%,white,transparent_40%)]" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-sm font-medium">Fast sign in • No password</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">Learn Feelings with Stories</h2>
                <p className="text-white/90 mb-6">Watch short videos, answer fun questions, track progress, and earn your certificate.</p>
                <ul className="space-y-3 text-white/95">
                  <li className="flex items-center gap-3"><ShieldCheck className="w-5 h-5" /> Safe and kid‑friendly</li>
                  <li className="flex items-center gap-3"><Heart className="w-5 h-5" /> Encouraging feedback</li>
                  <li className="flex items-center gap-3"><ChevronRight className="w-5 h-5" /> Certificates for achievement</li>
                </ul>
              </div>
            </div>

            {/* Right form */}
            <div className="p-8 md:p-10">
              <div className="text-center mb-6">
                <Badge className="bg-purple-100 text-purple-700">Step 1 of 1</Badge>
                <h3 className="text-2xl font-bold mt-3 mb-2 text-gray-800">Sign in to start learning</h3>
                <p className="text-gray-600">Just your name and date of birth. We’ll personalize your journey.</p>
              </div>

              <form onSubmit={submit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <div className={`flex items-center gap-2 p-3 rounded-xl border-2 ${
                    touched.name && name.trim().length < 2 ? "border-red-300" : "border-gray-200 focus-within:border-purple-400"
                  } bg-white shadow-sm`}
                  >
                    <User className="w-4 h-4 text-gray-500" />
                    <input
                      className="w-full outline-none"
                      placeholder="e.g. Aisha Khan"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                      required
                      minLength={2}
                    />
                  </div>
                  {touched.name && name.trim().length < 2 && (
                    <p className="mt-1 text-sm text-red-600">Please enter at least 2 characters.</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <div className={`flex items-center gap-2 p-3 rounded-xl border-2 ${
                    touched.dob && !dob ? "border-red-300" : "border-gray-200 focus-within:border-purple-400"
                  } bg-white shadow-sm`}
                  >
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <input
                      type="date"
                      className="w-full outline-none"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      onBlur={() => setTouched((t) => ({ ...t, dob: true }))}
                      required
                    />
                  </div>
                  {touched.dob && !dob && (
                    <p className="mt-1 text-sm text-red-600">Please select your date of birth.</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={!valid}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-12 rounded-xl"
                >
                  Continue
                </Button>

                <div className="text-xs text-gray-500 text-center">
                  We store your name and date locally on this device to personalize your experience.
                </div>
              </form>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
