import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>This is the main page of our Next.js application.</p>
      <div className="login-button">
        <Link href="/login">
          <button>Login</button>
        </Link>
      </div>
    </div>
  );
}