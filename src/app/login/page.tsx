"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getUserByEmail, loginUser } from "@/utils/api";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Insira um email válido")
    .required("O e-mail é obrigatório"),
  password: Yup.string().required("A senha é obrigatória"),
});

const initialValues = {
  email: "",
  password: "",
};

export default function Login() {
  const router = useRouter();

  const onSubmit = async (values: typeof initialValues) => {
    console.log(values);
    try {
      const { access_token } = await loginUser(values.email, values.password);
      console.log("Token:", access_token);

      if (access_token) {
        const user = await getUserByEmail(values.email);
        if (user) {
          console.log(localStorage.getItem("authToken"));
          router.push(`/user/aluno/${user.id}`);
        }
      } else {
        alert("Falha no login. Verifique suas credenciais.");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Erro ao fazer login. Tente novamente.");
    }
  };
  return (
    <div className="w-full h-screen flex  relative">
      <div className="ImgContainer h-full flex-1 relative">
        <Image
          src="/background-login.png"
          alt="Imagem de background da parte esquerda"
          layout="fill"
        />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center bg-gray-100">
        <div className="text-5xl font-mono font-bold text-black">
          <h1>Avaliação de</h1>
          <h1>Professores</h1>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form className="w-full flex flex-col items-center">
            <Field
              name="email"
              type="email"
              className="w-3/4 h-12 p-2 border-[0.125rem] border-gray-300 rounded-lg focus:border-gray-500 mt-8 text-black"
              placeholder="Email"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 mt-1 text-sm"
            />

            <Field
              name="password"
              type="password"
              className="w-3/4 h-12 p-2 border-[0.125rem] border-gray-300 rounded-lg focus:border-gray-500 mt-8 text-black"
              placeholder="Senha"
            />
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-500 mt-1 text-sm"
            />

            <section className="mt-20 flex space-x-6">
              <button
                type="submit"
                className="bg-green-300 border-[0.125rem] border-gray-500 p-2 rounded-lg hover:scale-110 duration-200 w-40 h-12 text-xl text-black"
              >
                Entrar
              </button>

              <button
                type="button"
                onClick={() => router.push("/cadastro")}
                className="bg-green-300 border-[0.125rem] border-gray-500 p-2 rounded-lg hover:scale-110 duration-200 w-40 h-12 text-xl text-black"
              >
                Criar Conta
              </button>
            </section>
          </Form>
        </Formik>
      </div>
    </div>
  );
}
