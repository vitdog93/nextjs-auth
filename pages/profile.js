import UserProfile from "../components/profile/user-profile";
import { getSession } from "next-auth/client";

function ProfilePage(props) {
  return <UserProfile />;
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  console.log(session);
  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false
      },
    };
  }
  return {
    props: {
      session,
    },
  };
}

export default ProfilePage;
