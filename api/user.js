export default async function handler(req, res) {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    // Placeholder: In a real app, extract user info from token or session
    // For now, just return a mock user
    const user = {
      id: 1,
      username: "johndoe",
      email: "johndoe@example.com"
    };
  
    res.status(200).json(user);
  }
  