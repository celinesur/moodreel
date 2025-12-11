export default function Home() {
  const key = process.env.TMDB_API_KEY;

  return (
    <main className="p-10 bg-black">
      <p className="text-green-400 text-3xl">
        KEY EXISTS? {key ? "YES" : "NO"}
      </p>
    </main>
  );
}
