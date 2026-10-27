import { redirect } from "next/navigation";

type Props = { searchParams: Promise<{ code?: string; error_code?: string }> };

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams;

  // Rede de segurança do Auth: se o Supabase cair na Site URL (por exemplo,
  // quando a URL de retorno não está na lista de permitidas), o `?code=`
  // chega aqui. Encaminha para o callback em vez de perder o login.
  if (params.code) {
    redirect(`/auth/callback?code=${encodeURIComponent(params.code)}`);
  }

  // Apex/Admin → manda para /admin (que decide login vs dashboard)
  redirect("/admin");
}
