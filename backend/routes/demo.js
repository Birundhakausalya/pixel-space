export const handleDemo = (req, res) => {
  const message = process.env.DEMO_MESSAGE ?? "Hello from the SentiLearn backend! 🎓";
  res.json({ message });
};
