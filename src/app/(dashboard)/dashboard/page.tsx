import Button from "@/components/ui/Button";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

async function page({}) {
  const session = await getServerSession(authOptions);

  return <div>Dashboard</div>;
}

export default page;
