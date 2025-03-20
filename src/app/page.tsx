import { getProfile } from "./(auth)/auth/components/server";

export default async function Home() {
  const session =  await getProfile()
  console.log(session)
  return (
    <main>
      {session?.session ? (
        <div>
          <p>Logged in as: {session.session.username}</p>
        </div>
      ) : (
        <p>Not logged in</p>
      )}
    </main>
  );
}